import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { filename, content } = await request.json();
    
    if (!filename || !content) {
      return NextResponse.json(
        { error: "Filename and content are required" },
        { status: 400 }
      );
    }

    const { url } = await put(filename, content, { access: 'public' });
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}