import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { Wallet } from "xrpl";
import { ethers } from "ethers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ce nom d'utilisateur existe déjà" },
        { status: 400 }
      );
    }

    // Générer une adresse XRPL
    const xrplWallet = Wallet.generate();
    const xrplAddress = xrplWallet.address;
    // Stocker la seed de manière sécurisée ou la donner à l'utilisateur
    const xrplSeed = xrplWallet.seed;

    // Générer une adresse EVM
    const evmWallet = ethers.Wallet.createRandom();
    const evmAddress = evmWallet.address;
    // Stocker la clé privée de manière sécurisée ou la donner à l'utilisateur
    const evmPrivateKey = evmWallet.privateKey;

    // Hasher le mot de passe
    const hashedPassword = await hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        xrplAddress,
        evmAddress,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        xrplAddress: user.xrplAddress,
        evmAddress: user.evmAddress,
      },
      xrplSeed,
      evmPrivateKey,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    );
  }
}