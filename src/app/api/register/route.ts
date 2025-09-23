import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/models/Player";
import cloudinary from "@/lib/cloudinary"; // make sure lib/cloudinary.ts exists
import { Readable } from "stream";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Disable Next.js default body parsing
export const config = {
  api: { bodyParser: false },
};

// Helper to convert buffer to readable stream for Cloudinary
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

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
      return NextResponse.json(
        { error: "All fields and image are required" },
        { status: 400 }
      );
    }

    // Convert image to Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    let buffer: Buffer = Buffer.from(arrayBuffer);

    // Optional: Remove background using rembg-node
    try {
      const dynamicImport = (Function("return import"))() as unknown as <T>(m: string) => Promise<T>;
      const rembg: { removeBackground: (buffer: Buffer) => Promise<Buffer | ArrayBuffer> } = await dynamicImport("rembg-node");
      const outputAny: Buffer | ArrayBuffer = await rembg.removeBackground(buffer);
      buffer = Buffer.isBuffer(outputAny) ? outputAny : Buffer.from(outputAny as ArrayBuffer);
    } catch {
      console.warn("Background removal failed, using original image");
    }

    // Upload to Cloudinary
    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "players" }, // optional folder
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Unknown Cloudinary upload error"));
        }
      );
      bufferToStream(buffer).pipe(stream);
    });

    const imageUrl = uploadResult.secure_url; // store in MongoDB

    // Connect to MongoDB and create document
    await connectDB();
    const created = await Player.create({
      fullname,
      dob,
      email,
      phone,
      position,
      place,
      image: imageUrl,
    });

    return NextResponse.json(
      { message: "Registration successful", playerId: created._id },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Register POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
