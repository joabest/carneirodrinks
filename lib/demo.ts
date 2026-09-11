export type StoreProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  promoPrice?: number | null;
  available: boolean;
  featured: boolean;
  combo: boolean;
};

export type StoreSettings = Record<string, string>;

export const demoProducts: StoreProduct[] = [
  { id: "demo-1", name: "Heineken Long Neck", description: "Cerveja premium gelada, 330ml.", category: "Cervejas", image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80", price: 9.9, promoPrice: 8.9, available: true, featured: true, combo: false },
  { id: "demo-2", name: "Budweiser 350ml", description: "Lata gelada pronta para chegar rápido.", category: "Cervejas", image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80", price: 7.5, promoPrice: null, available: true, featured: true, combo: false },
  { id: "demo-3", name: "Whisky Red Label", description: "Johnnie Walker Red Label 1L.", category: "Whisky", image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80", price: 109.9, promoPrice: 99.9, available: true, featured: true, combo: false },
  { id: "demo-4", name: "Combo Whisky + Energético", description: "1 whisky + 4 energéticos + gelo.", category: "Combos", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", price: 159.9, promoPrice: 139.9, available: true, featured: true, combo: true },
  { id: "demo-5", name: "Gin Tanqueray", description: "Gin London Dry 750ml.", category: "Gin", image: "https://images.unsplash.com/photo-1608885898957-a5598a2b1d7a?auto=format&fit=crop&w=800&q=80", price: 119.9, promoPrice: null, available: true, featured: false, combo: false },
  { id: "demo-6", name: "Red Bull 250ml", description: "Energético gelado.", category: "Energéticos", image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=800&q=80", price: 12.9, promoPrice: null, available: true, featured: false, combo: false },
  { id: "demo-7", name: "Coca-Cola 2L", description: "Refrigerante gelado 2 litros.", category: "Refrigerantes", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80", price: 14.9, promoPrice: null, available: true, featured: false, combo: false },
  { id: "demo-8", name: "Gelo 5kg", description: "Saco de gelo para o rolê não parar.", category: "Gelo", image: "https://images.unsplash.com/photo-1517620430776-7f4f991ad4b8?auto=format&fit=crop&w=800&q=80", price: 12, promoPrice: null, available: true, featured: false, combo: false }
];

export const demoSettings: StoreSettings = {
  hero_title: "Seu rolê começa aqui.",
  hero_subtitle: "Bebidas geladas, combos e entrega rápida. Escolha, adicione ao carrinho e peça pelo WhatsApp ou pela 99.",
  hero_image: "https://images.unsplash.com/photo-1774403269113-43095738ff07?auto=format&fit=crop&fm=jpg&q=82&w=1800",
  whatsapp: "5511999999999",
  link99: "https://99app.com/",
  instagram: "https://instagram.com/",
  address: "Rua Olga Artacho, 349 - Jardim Piratininga",
  hours: "Domingo: 19h às 05h • Segunda: 19h às 05h • Terça: fechado • Quarta a sábado: 19h às 05h",
  delivery_region: "Zona Leste de São Paulo e região",
  min_order: "R$ 30,00"
};
