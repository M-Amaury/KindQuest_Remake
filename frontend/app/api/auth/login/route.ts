import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sign } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Nom d'utilisateur ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Nom d'utilisateur ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Créer le token JWT
    const token = sign(
      {
        id: user.id,
        username: user.username,
        xrplAddress: user.xrplAddress,
        evmAddress: user.evmAddress,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Définir le cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        xrplAddress: user.xrplAddress,
        evmAddress: user.evmAddress,
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 heures
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    );
  }
} 