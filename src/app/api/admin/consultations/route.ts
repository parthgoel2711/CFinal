import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  try {
    const db = readDB();
    const consultations = db.consultations || [];

    // Sort by creation date descending (newest first)
    const sorted = [...consultations].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ consultations: sorted });
  } catch (error) {
    console.error("Admin Fetch Consultations API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
