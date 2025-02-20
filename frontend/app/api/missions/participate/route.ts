import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = verify(token.value, JWT_SECRET) as { id: string };
    const { missionId } = await req.json();

    // Vérifier que la mission existe et est active
    const missionExists = await prisma.mission.findUnique({
      where: {
        id: missionId,
        isActive: true
      }
    });

    if (!missionExists) {
      return NextResponse.json(
        { error: "Mission non disponible" },
        { status: 400 }
      );
    }

    // Mettre à jour la participation
    const participation = await prisma.participation.upsert({
      where: {
        missionId_userId: {
          missionId,
          userId: decoded.id
        }
      },
      create: {
        missionId,
        userId: decoded.id
      },
      update: {} // Ne rien mettre à jour si existe déjà
    });

    return NextResponse.json({ success: true, participation });
  } catch (error: any) {
    console.error('Erreur de participation:', error);
    
    // Gestion spécifique des erreurs Prisma
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Vous participez déjà à cette mission" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
} 