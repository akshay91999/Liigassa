import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player, { IPlayer } from "@/models/Player";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const { playerId, team } = (await req.json()) as { playerId?: string; team?: string };

    if (!playerId || !team) {
      return NextResponse.json(
        { error: "Player ID and team are required" },
        { status: 400 }
      );
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      { team },
      { new: true }
    );

    if (!updatedPlayer) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Convert to plain object and ensure _id is a string
    const playerObj: IPlayer & { _id: string } = updatedPlayer.toObject() as IPlayer & { _id: string };
    playerObj._id = playerObj._id.toString();

    return NextResponse.json({ player: playerObj });
  } catch (err) {
    console.error("PATCH /api/players/update error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
