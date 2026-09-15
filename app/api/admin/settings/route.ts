import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { demoSettings } from "@/lib/demo";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const rows = await prisma.setting.findMany();
  const settings: Record<string, string> = { ...demoSettings };
  for (const row of rows) settings[row.key] = row.value;
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const body = await request.json();
  const allowed = [
    "hero_title", "hero_subtitle", "hero_image", "category_strip_image",
    "promo_combo_image", "promo_beer_image", "promo_drinks_image",
    "whatsapp", "link99", "instagram", "address", "hours",
    "delivery_region", "min_order"
  ];
  const entries = Object.entries(body).filter(([key]) => allowed.includes(key));
  await prisma.$transaction(entries.map(([key, value]) => prisma.setting.upsert({ where: { key }, update: { value: String(value ?? "") }, create: { key, value: String(value ?? "") } })));
  return NextResponse.json({ ok: true });
}
