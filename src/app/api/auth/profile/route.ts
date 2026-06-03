import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, firstName, lastName, email, phone } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const db = readDB();
    const normalizedUsername = username.trim().toLowerCase();
    const user = db.users[normalizedUsername];

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update fields
    user.firstName = firstName?.trim() || "";
    user.lastName = lastName?.trim() || "";
    user.email = email?.trim() || "";
    user.phone = phone?.trim() || "";
    
    // Also sync the full name if first and last name are provided
    user.name = `${user.firstName} ${user.lastName}`.trim() || user.name;

    const success = writeDB(db);
    if (!success) {
      return NextResponse.json(
        { error: "Database error. Failed to update profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      username: user.username,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    console.error("Profile update API error:", error);
    return NextResponse.json(
      { error: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}
