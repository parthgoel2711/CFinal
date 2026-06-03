import { NextResponse } from "next/server";
import { readDB, writeDB, Consultation } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, phone, date, occasion } = await request.json();

    if (!name || !email || !phone || !date || !occasion) {
      return NextResponse.json(
        { error: "Name, email, phone, date, and occasion are required" },
        { status: 400 }
      );
    }

    // Read current database
    const db = readDB();
    if (!db.consultations) {
      db.consultations = [];
    }

    // Generate unique ID
    const id = "consultation_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();

    const newBooking: Consultation = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      date,
      occasion,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    db.consultations.push(newBooking);
    const writeSuccess = writeDB(db);

    if (!writeSuccess) {
      return NextResponse.json(
        { error: "Failed to write booking to database" },
        { status: 500 }
      );
    }

    // Attempt to send email notification
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;
    const ownerEmail = "genialstoffa@gmail.com";

    const emailSubject = `[Genial Stoffa] New Consultation Booked - ${newBooking.name}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
        <h2 style="color: #C6A87C; border-bottom: 2px solid #C6A87C; padding-bottom: 10px;">New Consultation Request</h2>
        <p>A new consultation has been booked on the website. Here are the details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold; width: 30%;">Customer Name:</td>
            <td style="padding: 10px;">${newBooking.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Email Address:</td>
            <td style="padding: 10px;"><a href="mailto:${newBooking.email}">${newBooking.email}</a></td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold;">Phone Number:</td>
            <td style="padding: 10px;"><a href="tel:${newBooking.phone}">${newBooking.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Preferred Date:</td>
            <td style="padding: 10px;">${newBooking.date}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 10px; font-weight: bold;">Suit Type/Occasion:</td>
            <td style="padding: 10px;">${newBooking.occasion}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Booking Time:</td>
            <td style="padding: 10px;">${new Date(newBooking.createdAt).toLocaleString()}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="http://localhost:3000/admin" style="background-color: #C6A87C; color: black; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 3px; display: inline-block;">
            Manage in Admin Dashboard
          </a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">This is an automated notification from Genial Stoffa tailor shop.</p>
      </div>
    `;

    if (host && port && user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port: Number(port),
          secure: Number(port) === 465,
          auth: { user, pass },
        });

        await transporter.sendMail({
          from,
          to: ownerEmail,
          subject: emailSubject,
          html: emailHtml,
        });

        console.log(`[Email] Consultation email successfully sent to ${ownerEmail}`);
      } catch (err) {
        console.error("[Email Error] Failed to send email via SMTP:", err);
      }
    } else {
      // Stylized local development fallback notification in server console
      console.log(`
================================================================================
✉️  [SIMULATED EMAIL NOTIFICATION TO SITE OWNER]
To: ${ownerEmail}
Subject: ${emailSubject}
--------------------------------------------------------------------------------
Dear Website Owner,

A new consultation has been booked!

Customer Details:
- Name: ${newBooking.name}
- Email: ${newBooking.email}
- Phone: ${newBooking.phone}
- Occasion: ${newBooking.occasion}
- Preferred Date: ${newBooking.date}
- Booking Time: ${new Date(newBooking.createdAt).toLocaleString()}

Please act accordingly. You can review and manage this booking at:
👉 http://localhost:3000/admin
================================================================================
      `);
    }

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("Consultation API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
