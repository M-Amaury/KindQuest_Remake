import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const missions = await prisma.mission.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        kindReward: true,
        xrpReward: true,
        participations: {
          where: { 
            validated: false,
            user: { isAdmin: false }
          },
          select: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedMissions = missions.map(mission => ({
      ...mission,
      participants: mission.participations.map(p => p.user)
    }));

    return NextResponse.json({ missions: formattedMissions });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
} 