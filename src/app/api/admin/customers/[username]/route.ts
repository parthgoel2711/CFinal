import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const resolvedParams = await params;
    const email = decodeURIComponent(resolvedParams.username);

    if (!email) {
      return NextResponse.json(
        { error: "Email/Account ID is required" },
        { status: 400 }
      );
    }

    const db = readDB();

    if (!db.users[email]) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Remove user
    delete db.users[email];
    writeDB(db);

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Customer API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
