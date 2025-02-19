import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { Wallet } from "xrpl";
import { ethers } from "ethers";

export async function POST(req: Request) {
  try{
    const { username, password } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username already exists"}, { status: 400});
    }

    const xrplWallet = Wallet.generate();
    const xrplAddress = xrplWallet.address;
    const xrplSeed = xrplWallet.seed;

    const evmWallet = ethers.Wallet.createRandom();
    const evmAddress = evmWallet.address;
    const evmPrivateKey = evmWallet.privateKey;

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data:{
        username,
        password: hashedPassword,
        xrplAddress,
        evmAddress,
      }
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

  } catch (err) {
    return NextResponse.json({err: "Erreur lors de l'inscription"}, { status: 500});
  }
}