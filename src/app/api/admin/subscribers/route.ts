import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  try {
    const db = readDB();
    const subscribers = db.subscribers || [];

    // Return the list, sorted by newest first
    subscribers.sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());

    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("Admin Fetch Subscribers API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
