import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, password, name, phone, email, cart } = await request.json();

    if (!username || !password || !name || !phone || !email) {
      return NextResponse.json(
        { error: "Name, username, email, phone, and password are required" },
        { status: 400 }
      );
    }

    const normalizedUsername = email.trim().toLowerCase(); // We use email as the primary key now

    if (normalizedUsername.length < 3) {
      return NextResponse.json(
        { error: "Email must be valid" },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters long" },
        { status: 400 }
      );
    }

    const db = readDB();

    // Deny if a user with this email already exists
    if (db.users[normalizedUsername]) {
      return NextResponse.json(
        { error: "An account with this email is already registered." },
        { status: 409 }
      );
    }

    // Also check if any other user has this exact email (just in case the key isn't the email for old accounts)
    const emailExists = Object.values(db.users).some(u => u.email?.toLowerCase() === normalizedUsername);
    if (emailExists) {
      return NextResponse.json(
        { error: "An account with this email is already registered." },
        { status: 409 }
      );
    }

    db.users[normalizedUsername] = {
      username: username.trim(),
      password,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      cart: cart || [],
    };

    const success = writeDB(db);
    if (!success) {
      return NextResponse.json(
        { error: "Database error. Failed to register user." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      username: username.trim(),
      name: name.trim(),
      firstName: "",
      lastName: "",
      email: email.trim(),
      phone: phone.trim(),
      cart: cart || [],
    }, { status: 201 });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { error: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}
