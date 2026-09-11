import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "carneiro_admin";

function expectedToken() {
  const password = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  if (!password || !secret) return "";
  return crypto.createHash("sha256").update(password + ":" + secret).digest("hex");
}

export function makeAdminToken(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || !process.env.ADMIN_SESSION_SECRET) return null;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return expectedToken();
}

export async function isAdmin() {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value || "";
  const expected = expectedToken();
  return Boolean(expected && value && value === expected);
}

export const adminCookieName = COOKIE;
