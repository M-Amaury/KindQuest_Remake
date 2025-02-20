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

if (!JWT_SECRET || !CONTRACT_ADDRESS || !PROVIDER_URL || !ADMIN_PRIVATE_KEY) {
  throw new Error("Missing environment variables");
}

export async function POST(req: Request) {
  try {
    // Vérifier l'authentification et les droits admin
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = verify(token.value, JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Récupérer les données de la mission
    const { name, description, kindReward, xrpReward } = await req.json();

    // Créer la mission dans la blockchain
    let provider;
    try {
      provider = new ethers.JsonRpcProvider(PROVIDER_URL);
      await provider.getNetwork(); // Vérifier la connexion
    } catch (error) {
      console.error('Provider error:', error);
      return NextResponse.json(
        { error: "Erreur de connexion au réseau blockchain" },
        { status: 500 }
      );
    }

    const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, KindTokenABI.abi, wallet);

    try {
      const tx = await contract.createMission(name, description, kindReward, xrpReward);
      await tx.wait();
    } catch (error) {
      console.error('Contract error:', error);
      return NextResponse.json(
        { error: "Erreur lors de l'interaction avec le contrat" },
        { status: 500 }
      );
    }

    // Créer la mission dans la base de données
    const mission = await prisma.mission.create({
      data: {
        name,
        description,
        kindReward,
        xrpReward,
        isActive: true,
      },
    });

    return NextResponse.json({ mission });
  } catch (error: any) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la mission: " + error.message },
      { status: 500 }
    );
  }
} 