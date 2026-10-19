import { NextResponse } from "next/server";
import { sessionCookieName, sessionCookieOptions } from "@/lib/session";
import { forbiddenCrossSite, isSameOrigin } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return forbiddenCrossSite();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(sessionCookieName, "", sessionCookieOptions(request, 0));
  return response;
}
