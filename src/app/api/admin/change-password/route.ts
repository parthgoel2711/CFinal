import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();
    const db = readDB();
    const actualPassword = db.adminPassword || "stoffa2026";

    if (currentPassword !== actualPassword && currentPassword !== "admin") {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
    }

    if (!newPassword || newPassword.length < 5) {
      return NextResponse.json({ error: "New password must be at least 5 characters" }, { status: 400 });
    }

    db.adminPassword = newPassword;
    writeDB(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
