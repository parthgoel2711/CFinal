import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be pending, confirmed, or cancelled." },
        { status: 400 }
      );
    }

    const db = readDB();
    if (!db.consultations) {
      db.consultations = [];
    }

    const bookingIndex = db.consultations.findIndex((c) => c.id === id);

    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: "Consultation booking not found" },
        { status: 404 }
      );
    }

    // Update status
    db.consultations[bookingIndex].status = status as any;
    
    const success = writeDB(db);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to save data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, booking: db.consultations[bookingIndex] });
  } catch (error) {
    console.error("PATCH Consultation API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const db = readDB();
    if (!db.consultations) {
      db.consultations = [];
    }

    const initialLength = db.consultations.length;
    db.consultations = db.consultations.filter((c) => c.id !== id);

    if (db.consultations.length === initialLength) {
      return NextResponse.json({ error: "Consultation booking not found" }, { status: 404 });
    }

    const success = writeDB(db);
    if (!success) {
      return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Consultation API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
