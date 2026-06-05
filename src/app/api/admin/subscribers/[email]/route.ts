import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const resolvedParams = await params;
    const email = decodeURIComponent(resolvedParams.email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = readDB();
    if (!db.subscribers) {
      db.subscribers = [];
    }

    const initialLength = db.subscribers.length;
    db.subscribers = db.subscribers.filter((s) => s.email !== email);

    if (db.subscribers.length === initialLength) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    writeDB(db);

    return NextResponse.json({ success: true, message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Subscriber API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
