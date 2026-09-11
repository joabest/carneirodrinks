import { NextResponse } from "next/server";
import { adminCookieName, makeAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = makeAdminToken(String(body.password || ""));
  if (!token) return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
