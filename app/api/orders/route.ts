import { NextResponse } from "next/server";
import { randomInt } from "node:crypto";
import { getVerifiedSession } from "@/lib/auth";
import { getDb, isMongoConfigured } from "@/lib/db";
import { getProducts } from "@/lib/products";
import { rateLimit } from "@/lib/rate-limit";
import { BadRequest, cleanText, forbiddenCrossSite, isSameOrigin, jsonError, readJsonBody, str } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossSite();

  const session = await getVerifiedSession("dealer");
  if (!session) return jsonError("Please sign in with an approved dealer account to place an order.", 401);

  const limit = rateLimit(`orders:${session.id}`, 30, 10 * 60_000);
  if (!limit.ok) return jsonError("Too many orders in a short time. Please wait a moment.", 429);

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(request, 32 * 1024);
  } catch (error) {
    if (error instanceof BadRequest) return jsonError("Choose at least one valid product and quantity.", 400);
    throw error;
  }

  const input = Array.isArray(body.items) ? body.items.slice(0, 101) : [];
  if (!input.length || input.length > 100) return jsonError("Choose between 1 and 100 order lines.", 400);

  // Only products that really exist in the catalogue can be ordered. Prices are
  // taken from the server, never from the browser.
  const catalogue = new Map((await getProducts()).map((p) => [String(p.id), p]));
  const items: { productId: string | number; quantity: number; brand: string; pattern: string; size: string; unitPrice: number | null }[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") return jsonError("Choose at least one valid product and quantity.", 400);
    const line = raw as Record<string, unknown>;
    const quantity = Number(line.quantity);
    const product = catalogue.get(str(line.productId, 40));
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 10_000) {
      return jsonError("One of the products or quantities isn’t valid.", 400);
    }
    items.push({
      productId: product.id,
      quantity,
      brand: product.brand,
      pattern: product.pattern,
      size: product.size,
      unitPrice: typeof product.wholesalePrice === "number" ? product.wholesalePrice : null
    });
  }

  const orderRef = "UT-" + randomInt(100000, 1000000);
  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
  const order = {
    orderId: orderRef,
    dealerId: session.dealerId,
    dealerEmail: session.email,
    status: "submitted",
    items,
    poNumber: cleanText(body.poNumber, 60) || null,
    deliveryNotes: cleanText(body.deliveryNotes, 1000) || null,
    createdAt: new Date()
  };

  if (isMongoConfigured() && !session.demo) {
    try {
      const db = await getDb();
      await db.collection("orders").insertOne(order);
    } catch (error) {
      console.error("order submission failed", error);
      return jsonError("Unable to submit the order right now. Please try again or call your account manager.", 503);
    }
  } else {
    console.info(`[demo] order ${orderRef} accepted (${totalUnits} tyres) – not stored`);
  }

  return NextResponse.json(
    {
      message: `Order #${orderRef} submitted. Your account manager has received your ${totalUnits} tyres and will confirm dispatch.`,
      orderId: orderRef
    },
    { status: 201 }
  );
}
