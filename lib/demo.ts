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
  { id: "demo-1", name: "Heineken Long Neck", description: "330ml", category: "Cervejas", image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=500&q=85", price: 6.99, promoPrice: null, available: true, featured: true, combo: false },
  { id: "demo-2", name: "Budweiser Long Neck", description: "330ml", category: "Cervejas", image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=500&q=85", price: 5.99, promoPrice: null, available: true, featured: true, combo: false },
  { id: "demo-3", name: "Corona Long Neck", description: "330ml", category: "Cervejas", image: "https://images.unsplash.com/photo-1527496726692-ee3caf2b259d?auto=format&fit=crop&w=500&q=85", price: 6.99, promoPrice: null, available: true, featured: true, combo: false },
  { id: "demo-4", name: "Whisky Red Label", description: "750ml", category: "Whisky", image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=500&q=85", price: 89.90, promoPrice: null, available: true, featured: true, combo: false },
  { id: "demo-5", name: "Red Bull", description: "250ml", category: "Energéticos", image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=500&q=85", price: 9.99, promoPrice: null, available: true, featured: false, combo: false },
  { id: "demo-6", name: "Coca-Cola", description: "2 Litros", category: "Refrigerantes", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=85", price: 12.90, promoPrice: null, available: true, featured: false, combo: false },
  { id: "demo-7", name: "Gelo 5kg", description: "Em cubos", category: "Gelo", image: "https://images.unsplash.com/photo-1517620430776-7f4f991ad4b8?auto=format&fit=crop&w=500&q=85", price: 9.90, promoPrice: null, available: true, featured: false, combo: false },
  { id: "demo-8", name: "Combo do Fim de Semana", description: "Whisky + 4 energéticos + gelo", category: "Combos", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85", price: 169.90, promoPrice: 149.90, available: true, featured: false, combo: true }
];

export const demoSettings: StoreSettings = {
  hero_title: "Bebidas geladas, onde você estiver!",
  hero_subtitle: "Carneiro Drinks – Qualidade, variedade e entrega rápida para os seus melhores momentos.",
  hero_image: "https://images.unsplash.com/photo-1527496726692-ee3caf2b259d?auto=format&fit=crop&fm=jpg&q=85&w=2000",
  whatsapp: "5511999999999",
  link99: "https://99app.com/",
  instagram: "https://instagram.com/",
  address: "Rua Olga Artacho, 349 • Jardim Piratininga • São Paulo - SP",
  hours: "Domingo: 19:05 às 02:00 • Segunda: 19:05 às 02:00 • Terça: Não abrimos • Quarta: 19:00 às 02:00 • Quinta: 19:00 às 02:00 • Sexta: 19:00 às 03:00 • Sábado: 19:00 às 03:00",
  delivery_region: "São Paulo e região • Consulte sua região no WhatsApp",
  min_order: "R$ 30,00"
};
