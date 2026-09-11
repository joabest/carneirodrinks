import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  ["Heineken Long Neck", "Cerveja premium gelada, 330ml.", "Cervejas", 9.9, 8.9, true, false],
  ["Budweiser 350ml", "Lata gelada pronta para chegar rápido.", "Cervejas", 7.5, null, true, false],
  ["Whisky Red Label", "Johnnie Walker Red Label 1L.", "Whisky", 109.9, 99.9, true, false],
  ["Combo Whisky + Energético", "1 whisky + 4 energéticos + gelo.", "Combos", 159.9, 139.9, true, true],
  ["Gin Tanqueray", "Gin London Dry 750ml.", "Gin", 119.9, null, false, false],
  ["Red Bull 250ml", "Energético gelado.", "Energéticos", 12.9, null, false, false]
] as const;

async function main() {
  const count = await prisma.product.count();
  if (count === 0) {
    for (let i = 0; i < products.length; i++) {
      const [name, description, category, price, promoPrice, featured, combo] = products[i];
      await prisma.product.create({ data: { name, description, category, price, promoPrice, featured, combo, available: true, sortOrder: i } });
    }
  }

  const defaults: Record<string, string> = {
    hero_title: "Seu rolê começa aqui.",
    hero_subtitle: "Bebidas geladas, combos e entrega rápida. Escolha, adicione ao carrinho e peça pelo WhatsApp ou pela 99.",
    hero_image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1800&q=85",
    whatsapp: "5511999999999",
    link99: "https://99app.com/",
    instagram: "https://instagram.com/",
    address: "Rua Olga Artacho, 349 - Jardim Piratininga",
    hours: "Todos os dias, 19h às 05h",
    delivery_region: "Zona Leste de São Paulo e região",
    min_order: "R$ 30,00"
  };
  for (const [key, value] of Object.entries(defaults)) await prisma.setting.upsert({ where: { key }, update: {}, create: { key, value } });
}

main().finally(async () => prisma.$disconnect());
