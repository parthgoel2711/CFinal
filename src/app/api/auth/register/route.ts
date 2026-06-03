import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, password, name, cart } = await request.json();

    if (!username || !password || !name) {
      return NextResponse.json(
        { error: "Name, username, and password are required" },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();
    
    if (normalizedUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long" },
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

    if (db.users[normalizedUsername]) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    db.users[normalizedUsername] = {
      username: username.trim(),
      password,
      name: name.trim(),
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
      email: "",
      phone: "",
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
