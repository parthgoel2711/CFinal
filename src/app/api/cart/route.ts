import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, cart } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required to sync cart" },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();
    const db = readDB();

    if (!db.users[normalizedUsername]) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    db.users[normalizedUsername].cart = cart || [];

    const success = writeDB(db);
    if (!success) {
      return NextResponse.json(
        { error: "Database error. Failed to sync cart." },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      cart: db.users[normalizedUsername].cart 
    });
  } catch (error) {
    console.error("Cart Sync API error:", error);
    return NextResponse.json(
      { error: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();
    const db = readDB();
    const user = db.users[normalizedUsername];

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      cart: user.cart || [] 
    });
  } catch (error) {
    console.error("Cart GET API error:", error);
    return NextResponse.json(
      { error: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}
