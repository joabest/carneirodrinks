import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const products = await prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(products.map((p) => ({ ...p, price: Number(p.price), promoPrice: p.promoPrice === null ? null : Number(p.promoPrice) })));
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const b = await request.json();
  if (!b.name || !b.category || b.price === undefined) return NextResponse.json({ error: "Nome, categoria e preço são obrigatórios" }, { status: 400 });
  const product = await prisma.product.create({ data: {
    name: String(b.name),
    description: String(b.description || ""),
    category: String(b.category),
    image: String(b.image || ""),
    price: Number(b.price),
    promoPrice: b.promoPrice === "" || b.promoPrice === null || b.promoPrice === undefined ? null : Number(b.promoPrice),
    available: b.available !== false,
    featured: Boolean(b.featured),
    combo: Boolean(b.combo),
    sortOrder: Number(b.sortOrder || 0),
  }});
  return NextResponse.json({ ...product, price: Number(product.price), promoPrice: product.promoPrice === null ? null : Number(product.promoPrice) }, { status: 201 });
}
