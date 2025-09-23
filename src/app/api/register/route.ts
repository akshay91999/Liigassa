import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/models/Player";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const fullname = String(formData.get("fullname") || "");
    const dob = String(formData.get("dob") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const position = String(formData.get("position") || "");
    const place = String(formData.get("place") || "");
    const imageFile = formData.get("image") as File | null;

    if (!fullname || !dob || !email || !phone || !position || !place || !imageFile) {
      return NextResponse.json({ error: "All fields and image are required" }, { status: 400 });
    }

    // Save image to public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const arrayBuffer = await imageFile.arrayBuffer();
    let buffer: Buffer = Buffer.from(arrayBuffer as ArrayBuffer);

    const timePrefix = Date.now();
    const originalName = imageFile.name?.replace(/[^a-zA-Z0-9.\-_]/g, "_") || "upload.jpg";
    const fileName = `${timePrefix}-${originalName}`;
    const filePath = path.join(uploadsDir, fileName);
    
    try {
      // Dynamically import without static module resolution
      const dynamicImport = (Function("return import"))() as unknown as <T>(m: string) => Promise<T>;
      const rembg: { removeBackground: (buffer: Buffer) => Promise<Buffer | ArrayBuffer> } = await dynamicImport("rembg-node");
      if (rembg && typeof rembg.removeBackground === "function") {
        const outputAny: Buffer | ArrayBuffer = await rembg.removeBackground(buffer);
        const outputBuffer: Buffer = Buffer.isBuffer(outputAny)
          ? outputAny
          : Buffer.from(outputAny as ArrayBuffer);
        if (outputBuffer) {
          buffer = outputBuffer;
        }
      }
    } catch {
      // Ignore and fallback
    }
    

    // If background not removed, proceed with original buffer (no external fallback)

    await fs.writeFile(filePath, buffer);

    const imagePathForDb = `/uploads/${fileName}`;

    // Connect and create document
    await connectDB();
    const created = await Player.create({
      fullname,
      dob,
      email,
      phone,
      position,
      place,
      image: imagePathForDb,
    });

    return NextResponse.json({ message: "Registration successful", playerId: created._id }, { status: 201 });
  } catch (error: unknown) {
    console.error("Register POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


