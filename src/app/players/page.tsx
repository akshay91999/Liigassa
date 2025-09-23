type LeanPlayer = {
  _id: string;
  fullname: string;
  dob: string;
  email: string;
  phone: string;
  position: string;
  place: string;
  image: string;
};

export const dynamic = "force-dynamic";

export default async function PlayersPage() {
  let serialized: LeanPlayer[] = [];
  try {
    const res = await fetch(`/api/players`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch players");
    const data = await res.json();
    serialized = data.players as LeanPlayer[];
  } catch {
    serialized = [];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b2040] via-[#111827] to-[#a90a18] px-4 pt-28 pb-16">
      <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#a90a18] to-[#fff8db] bg-clip-text text-transparent mb-10">
        Players
      </h1>

      {serialized.length === 0 ? (
        <p className="text-center text-gray-300">No players registered yet.</p>
      ) : (
        <PlayersGrid players={serialized} />
      )}
    </div>
  );
}

import PlayersGrid from "./PlayersGrid";
