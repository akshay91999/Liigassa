import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/models/Player";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const players = await Player.find().sort({ createdAt: -1 }).lean();
    const serialized = players.map((p: any) => ({
      _id: String(p._id),
      fullname: p.fullname,
      dob: p.dob,
      email: p.email,
      phone: p.phone,
      position: p.position,
      place: p.place,
      image: p.image,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
    return NextResponse.json({ players: serialized }, { status: 200 });
  } catch (error) {
    console.error("GET /api/players error", error);
    return NextResponse.json({ error: "Failed to load players" }, { status: 500 });
  }
}


