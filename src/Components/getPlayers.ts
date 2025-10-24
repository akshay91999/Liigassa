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
export default async function getPlayers() {

let serialized: LeanPlayer[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://192.168.31.236:3000"}/api/players`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch players");
    const data = await res.json();
    serialized = data.players as LeanPlayer[];
    // loading=false
  } catch {
    serialized = [];
  }
  return serialized
}