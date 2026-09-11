import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await context.params;
  const b = await request.json();
  const data: Record<string, unknown> = {};
  for (const key of ["name", "description", "category", "image"]) if (b[key] !== undefined) data[key] = String(b[key]);
  for (const key of ["available", "featured", "combo"]) if (b[key] !== undefined) data[key] = Boolean(b[key]);
  if (b.price !== undefined) data.price = Number(b.price);
  if (b.promoPrice !== undefined) data.promoPrice = b.promoPrice === "" || b.promoPrice === null ? null : Number(b.promoPrice);
  if (b.sortOrder !== undefined) data.sortOrder = Number(b.sortOrder || 0);
  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ ...product, price: Number(product.price), promoPrice: product.promoPrice === null ? null : Number(product.promoPrice) });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { id } = await context.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
