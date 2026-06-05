import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const db = readDB();

    if (!db.subscribers) {
      db.subscribers = [];
    }

    // Check if already subscribed
    if (db.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { error: "You are already subscribed to the newsletter!" },
        { status: 400 }
      );
    }

    db.subscribers.push({
      email: email.trim(),
      subscribedAt: new Date().toISOString(),
    });

    const success = writeDB(db);
    if (!success) {
      return NextResponse.json(
        { error: "Database error. Failed to save subscription." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Subscribed successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
