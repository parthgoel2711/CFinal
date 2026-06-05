import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";

export async function GET() {
  try {
    const db = readDB();
    const customers = Object.values(db.users).map((u) => ({
      username: u.username,
      name: u.name || null,
      email: u.email || u.username,
      phone: u.phone || null,
      password: u.password,
      cartItemCount: u.cart.reduce((sum, item) => sum + item.quantity, 0),
      cartItems: u.cart,
    }));

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("Admin Fetch Customers API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
