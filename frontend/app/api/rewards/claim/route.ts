import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ethers } from "ethers";
import KindTokenABI from "../../../../public/KindToken.json";

const JWT_SECRET = process.env.JWT_SECRET!;
const CONTRACT_ADDRESS = process.env.KIND_TOKEN_ADDRESS!;
const PROVIDER_URL = process.env.PROVIDER_URL!;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY!;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = verify(token.value, JWT_SECRET) as { id: string };
    const { rewardId, rewardCost } = await req.json();

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { evmAddress: true }
    });

    if (!user?.evmAddress) {
      return NextResponse.json(
        { error: "Adresse EVM manquante" },
        { status: 400 }
      );
    }

    // Brûler les tokens KIND
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, KindTokenABI.abi, wallet);
    
    await contract.burnFrom(user.evmAddress, ethers.parseEther(rewardCost.toString()));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur lors de l'échange" },
      { status: 500 }
    );
  }
} 