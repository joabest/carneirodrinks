import { prisma } from "@/lib/prisma";
import { demoProducts, demoSettings, StoreProduct, StoreSettings } from "@/lib/demo";
import Storefront from "@/components/storefront";

export const dynamic = "force-dynamic";

async function loadStore() {
  if (!process.env.DATABASE_URL) return { products: demoProducts, settings: demoSettings };
  try {
    const [rows, settingRows] = await Promise.all([
      prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
      prisma.setting.findMany()
    ]);
    const products: StoreProduct[] = rows.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      image: p.image,
      price: Number(p.price),
      promoPrice: p.promoPrice === null ? null : Number(p.promoPrice),
      available: p.available,
      featured: p.featured,
      combo: p.combo,
    }));
    const settings: StoreSettings = { ...demoSettings };
    for (const s of settingRows) settings[s.key] = s.value;
    return { products, settings };
  } catch (error) {
    console.error("Falha ao carregar banco. Usando catálogo demonstrativo.", error);
    return { products: demoProducts, settings: demoSettings };
  }
}

export default async function Home() {
  const data = await loadStore();
  return <Storefront initialProducts={data.products} settings={data.settings} />;
}
