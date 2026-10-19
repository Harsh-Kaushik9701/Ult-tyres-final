import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb, isMongoConfigured } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { BadRequest, cleanText, clientIp, EMAIL_RE, forbiddenCrossSite, isSameOrigin, jsonError, readJsonBody, str } from "@/lib/security";

const KINDS = ["contact", "dealer-application", "careers"] as const;
const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];
const TOPICS = ["Fleet tyres", "Fleet services", "Dealer network", "General enquiry"];

function successMessage(kind: string) {
  return kind === "dealer-application"
    ? "Application received. We’ll review your business before activating portal access."
    : "Thanks. The Ultimate Tyres team will be in touch.";
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossSite();

  const limit = rateLimit(`lead:${clientIp(request)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return jsonError("Too many submissions. Please try again in a few minutes.", 429, { "Retry-After": String(limit.retryAfter) });
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(request, 24 * 1024);
  } catch (error) {
    if (error instanceof BadRequest) return jsonError("Please check the form and try again.", 400);
    throw error;
  }

  const kind = (KINDS as readonly string[]).includes(body.kind as string) ? (body.kind as (typeof KINDS)[number]) : "contact";

  // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
  if (str(body.website, 200)) return NextResponse.json({ message: successMessage(kind) }, { status: 201 });

  const name = cleanText(body.name, 160);
  const email = str(body.email, 254).toLowerCase();
  const phone = str(body.phone, 40);
  const message = cleanText(body.message, 4000);

  if (!name || !email || !phone || !EMAIL_RE.test(email) || !/^[+()\d\s.-]{6,40}$/.test(phone)) {
    return jsonError("Please provide a valid name, email and phone number.", 400);
  }

  let record: Record<string, unknown>;
  let collection: "dealer_applications" | "enquiries";

  if (kind === "dealer-application") {
    const business = cleanText(body.business, 180);
    const state = str(body.state, 3).toUpperCase();
    const abn = str(body.abn, 20).replace(/\s/g, "");
    const password = typeof body.password === "string" ? body.password : "";
    if (!business || !STATES.includes(state) || !message) {
      return jsonError("Include your business name, state and a short description of your business.", 400);
    }
    if (password.length < 12 || password.length > 128) {
      return jsonError("Choose a portal password between 12 and 128 characters.", 400);
    }
    if (abn && !/^\d{11}$/.test(abn)) return jsonError("An ABN has 11 digits.", 400);
    collection = "dealer_applications";
    record = {
      name,
      email,
      phone,
      businessName: business,
      abn,
      state,
      message,
      passwordHash: await bcrypt.hash(password, 12),
      status: "pending",
      createdAt: new Date()
    };
  } else {
    const topic = str(body.topic, 60);
    collection = "enquiries";
    record = {
      kind,
      name,
      email,
      phone,
      topic: TOPICS.includes(topic) ? topic : kind === "careers" ? "Careers" : "General enquiry",
      roleInterest: cleanText(body.role, 120),
      message,
      createdAt: new Date()
    };
  }

  if (!isMongoConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error("lead received but MONGODB_URI is not configured – nothing was stored");
      return jsonError("Our online form is temporarily unavailable. Please call or WhatsApp us.", 503);
    }
    console.info(`[dev] ${collection} submission accepted (not stored – no database configured)`);
    return NextResponse.json({ message: successMessage(kind) }, { status: 201 });
  }

  try {
    const db = await getDb();
    if (kind === "dealer-application") {
      const [existingAccount, existingApp] = await Promise.all([
        db.collection("accounts").findOne({ email }, { projection: { _id: 1 } }),
        db.collection("dealer_applications").findOne({ email, status: "pending" }, { projection: { _id: 1 } })
      ]);
      if (existingAccount || existingApp) {
        // Same response as success, so the form can't be used to discover which emails have accounts.
        return NextResponse.json({ message: successMessage(kind) }, { status: 201 });
      }
    }
    await db.collection(collection).insertOne(record);
    return NextResponse.json({ message: successMessage(kind) }, { status: 201 });
  } catch (error) {
    console.error("lead submission failed", error);
    return jsonError("We couldn’t save that just now. Please try again shortly or call us.", 503);
  }
}
