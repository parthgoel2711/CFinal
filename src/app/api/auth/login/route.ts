import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = readDB();
    const normalizedInput = username.trim().toLowerCase();
    
    // Find user by matching the normalized input against either email or the username key
    const user = Object.values(db.users).find((u: any) => 
      u.email?.toLowerCase() === normalizedInput || u.username?.toLowerCase() === normalizedInput
    );

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      username: user.username,
      name: user.name || user.username,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      cart: user.cart || [],
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Something went wrong on the server" },
      { status: 500 }
    );
  }
}
