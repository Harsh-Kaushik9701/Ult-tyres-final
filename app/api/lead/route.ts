import { NextResponse } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const kind = ["contact", "dealer-application", "careers"].includes(body.kind)
      ? body.kind
      : "contact";
    const name = String(body.name || "").trim().slice(0, 160);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
    const phone = String(body.phone || "").trim().slice(0, 60);
    const message = String(body.message || "").trim().slice(0, 4000);

    if (!name || !email || !phone || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid name, email and phone." }, { status: 400 });
    }

    if (isMongoConfigured()) {
      try {
        const db = await getDb();

        if (kind === "dealer-application") {
          const business = String(body.business || "").trim().slice(0, 180);
          const state = String(body.state || "").trim().slice(0, 20);
          const password = String(body.password || "");

          if (!business || !state || password.length < 12) {
            return NextResponse.json(
              { error: "Include your business, state and a password of at least 12 characters." },
              { status: 400 }
            );
          }

          const existingAccount = await db.collection("accounts").findOne({ email });
          const existingApp = await db.collection("dealer_applications").findOne({ email, status: "pending" });

          if (existingAccount || existingApp) {
            return NextResponse.json(
              { error: "An account or pending application already uses that email." },
              { status: 409 }
            );
          }

          const hash = await bcrypt.hash(password, 12);
          await db.collection("dealer_applications").insertOne({
            name,
            email,
            phone,
            businessName: business,
            abn: String(body.abn || "").trim().slice(0, 30),
            state,
            message,
            passwordHash: hash,
            status: "pending",
            createdAt: new Date()
          });
        } else {
          await db.collection("enquiries").insertOne({
            kind,
            name,
            email,
            phone,
            businessName: String(body.business || "").slice(0, 180),
            abn: String(body.abn || "").slice(0, 30),
            state: String(body.state || "").slice(0, 20),
            topic: String(body.topic || "").slice(0, 100),
            roleInterest: String(body.role || "").slice(0, 120),
            message,
            createdAt: new Date()
          });
        }
      } catch (dbErr) {
        console.warn("MongoDB lead storage error, acknowledged gracefully", dbErr);
      }
    }

    return NextResponse.json(
      {
        message:
          kind === "dealer-application"
            ? "Application received. We’ll review your business before activating portal access."
            : "Thanks. The Ultimate Tyres team will be in touch."
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("lead submission failed", error);
    return NextResponse.json(
      { error: "We couldn’t save that just now. Please try again shortly." },
      { status: 500 }
    );
  }
}
