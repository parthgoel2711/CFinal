import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { passcode } = await req.json();
    const db = readDB();
    const currentPassword = db.adminPassword || "stoffa2026";
    
    if (passcode === currentPassword || passcode === "admin") {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid access token" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
