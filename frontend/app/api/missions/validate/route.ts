import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ethers } from "ethers";
import { 
  Client, 
  Wallet, 
  Payment,
} from "xrpl";
import KindTokenABI from "../../../../public/KindToken.json";

const JWT_SECRET = process.env.JWT_SECRET!;
const CONTRACT_ADDRESS = process.env.KIND_TOKEN_ADDRESS!;
const PROVIDER_URL = process.env.PROVIDER_URL!;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY!;
const XRPL_ADMIN_SEED = process.env.XRPL_ADMIN_SEED!;
const XRPL_NODE = process.env.XRPL_NODE || 'wss://s.altnet.rippletest.net:51233';

export async function POST(req: Request) {
  let client: Client | null = null;
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = verify(token.value, JWT_SECRET) as { id: string; isAdmin: boolean };
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    const { missionId, participantId } = await req.json();

    const [mission, user, participation] = await Promise.all([
      prisma.mission.findUnique({
        where: { id: missionId },
        select: { kindReward: true, xrpReward: true }
      }),
      prisma.user.findUnique({
        where: { id: participantId },
        select: { evmAddress: true, xrplAddress: true }
      }),
      prisma.participation.findFirst({
        where: { missionId, userId: participantId }
      })
    ]);

    if (!mission || !user || !participation) {
      throw new Error("Données invalides");
    }

    // Envoyer les récompenses
    if (mission.kindReward > 0) {
      const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, KindTokenABI.abi, wallet);
      await contract.mint(user.evmAddress, ethers.parseEther(mission.kindReward.toString()));
    }

    if (mission.xrpReward > 0) {
      client = new Client(XRPL_NODE);
      await client.connect();

      const wallet = Wallet.fromSeed(XRPL_ADMIN_SEED);

      const payment: Payment = {
          TransactionType: "Payment",
          Account: wallet.address,
          Destination: user.xrplAddress,
          Amount: (mission.xrpReward * 1_000_000).toString(),
      }

      try {
          const prepared = await client.autofill(payment);
          const signed = wallet.sign(prepared);
          const tx = await client.submitAndWait(signed.tx_blob);
        
        if (typeof tx.result.meta !== 'string' && tx.result.meta?.TransactionResult !== "tesSUCCESS") {
          throw new Error(`Transaction failed: ${tx.result.meta?.TransactionResult}`);
        }
      } catch (xrplError: any) {
        console.error('Erreur XRPL:', xrplError);
        throw new Error(`Erreur lors du paiement XRP: ${xrplError.message}`);
      }
    }

    // Mettre à jour la participation
    await prisma.participation.update({
      where: { id: participation.id },
      data: { 
        validated: true,
        validatedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Erreur de validation" },
      { status: 500 }
    );
  } finally {
    if (client) await client.disconnect();
  }
} 