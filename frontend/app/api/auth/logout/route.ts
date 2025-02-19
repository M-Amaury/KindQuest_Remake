import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Supprimer le cookie de token
  cookieStore.delete('token');

  return NextResponse.json({ message: "Déconnecté avec succès" });
} 