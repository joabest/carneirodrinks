"use client";

import { useMemo, useState } from "react";
import {
  Beer, ShoppingCart, Search, MapPin, Clock3, Instagram, MessageCircle,
  Plus, Minus, X, Flame, Sparkles, Truck, ShieldCheck, Home, Heart,
  PackageCheck, ChevronRight, Wine, GlassWater, Snowflake, Zap
} from "lucide-react";
import type { StoreProduct, StoreSettings } from "@/lib/demo";

type CartLine = { product: StoreProduct; qty: number };

const categoryIcons: Record<string, React.ReactNode> = {
  "Cervejas": <Beer size={24} />,
  "Whisky": <Wine size={24} />,
  "Vodka": <GlassWater size={24} />,
  "Gin": <Wine size={24} />,
  "Energéticos": <Zap size={24} />,
  "Refrigerantes": <GlassWater size={24} />,
  "Gelo": <Snowflake size={24} />,
  "Combos": <Sparkles size={24} />,
  "Promoções": <Flame size={24} />,
};

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function Storefront({ initialProducts, settings }: { initialProducts: StoreProduct[]; settings: StoreSettings }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const categories = useMemo(() => {
    const preferred = ["Cervejas", "Whisky", "Vodka", "Gin", "Destilados", "Energéticos", "Refrigerantes", "Sucos", "Água", "Gelo", "Drinks", "Combos", "Promoções"];
    const fromProducts = Array.from(new Set(initialProducts.map((p) => p.category)));
    return ["Todos", ...preferred, ...fromProducts.filter((item) => !preferred.includes(item))];
  }, [initialProducts]);
  const filtered = useMemo(() => initialProducts.filter((p) => {
    const cat = category === "Todos" || p.category === category;
    const q = !query || (p.name + " " + p.description + " " + p.category).toLowerCase().includes(query.toLowerCase());
    return cat && q;
  }), [initialProducts, category, query]);
  const featured = initialProducts.filter((p) => p.featured).slice(0, 4);
  const combos = initialProducts.filter((p) => p.combo || p.category === "Combos").slice(0, 3);
  const cartCount = cart.reduce((n, line) => n + line.qty, 0);
  const total = cart.reduce((sum, line) => sum + (line.product.promoPrice ?? line.product.price) * line.qty, 0);

  function add(product: StoreProduct) {
    if (!product.available) return;
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) return current.map((line) => line.product.id === product.id ? { ...line, qty: line.qty + 1 } : line);
      return [...current, { product, qty: 1 }];
    });
  }

  function change(id: string, delta: number) {
    setCart((current) => current.map((line) => line.product.id === id ? { ...line, qty: line.qty + delta } : line).filter((line) => line.qty > 0));
  }

  function whatsappCheckout() {
    if (!cart.length) return;
    const lines = cart.map((line) => line.qty + "x " + line.product.name + " — " + money((line.product.promoPrice ?? line.product.price) * line.qty));
    const message = "Olá, quero fazer este pedido:\n\n" + lines.join("\n") + "\n\nTotal: " + money(total);
    const phone = (settings.whatsapp || "").replace(/\D/g, "");
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  }

  function scrollToCatalog() {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0605]/90 backdrop-blur-xl">
        <div className="container-site flex h-16 items-center justify-between gap-3">
          <a href="#" className="flex items-center" aria-label="Carneiro Drinks - início">
            <img src="/carneiro-drinks-logo-v2.svg" alt="Carneiro Drinks" className="h-14 w-auto object-contain drop-shadow-[0_0_12px_rgba(208,16,47,.24)]" />
          </a>
          <div className="hidden items-center gap-2 text-xs text-white/70 md:flex"><MapPin size={16} className="text-[#d0102f]" /> {settings.delivery_region}</div>
          <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
            <a href="#catalogo" className="hover:text-[#e01538]">Bebidas</a>
            <a href="#promocoes" className="hover:text-[#e01538]">Promoções</a>
            <a href="#entrega" className="hover:text-[#e01538]">Entrega</a>
          </nav>
          <button onClick={() => setCartOpen(true)} className="relative grid h-11 w-11 place-items-center rounded-full bg-[#d0102f] transition hover:scale-105" aria-label="Abrir carrinho">
            <ShoppingCart size={20}/>
            {cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-black text-black">{cartCount}</span>}
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <img src={settings.hero_image} alt="Carneiro Drinks" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0a0605_5%,rgba(10,6,5,.92)_42%,rgba(10,6,5,.35)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(208,16,47,.25),transparent_30%)]" />
        </div>
        <div className="container-site relative z-10 flex min-h-[560px] items-center py-20 md:min-h-[650px]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d0102f]/35 bg-[#d0102f]/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#ff4a66]"><Flame size={15}/> Delivery de bebidas</div>
            <h1 className="max-w-xl text-5xl font-black uppercase leading-[.9] tracking-[-.05em] sm:text-6xl md:text-7xl">{settings.hero_title.split(".")[0]}<span className="text-[#d0102f]">.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/68 md:text-lg">{settings.hero_subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={scrollToCatalog} className="red-gradient flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-black uppercase shadow-glow transition hover:-translate-y-0.5">Fazer pedido <ChevronRight size={18}/></button>
              <a href={settings.link99} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-black uppercase transition hover:bg-white/10">Pedir pela 99</a>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="text-xl font-black text-[#ff3b59]">Rápido</div><div className="mt-1 text-xs text-white/50">pedido em poucos toques</div></div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="text-xl font-black text-[#ff3b59]">Gelado</div><div className="mt-1 text-xs text-white/50">bebida pronta pro rolê</div></div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4"><div className="text-xl font-black text-[#ff3b59]">2 opções</div><div className="mt-1 text-xs text-white/50">WhatsApp ou 99</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-9">
        <div className="container-site">
          <div className="glass hide-scrollbar flex gap-2 overflow-x-auto rounded-[28px] p-3 shadow-2xl">
            {categories.map((item) => (
              <button key={item} onClick={() => { setCategory(item); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }} className={(category === item ? "bg-[#d0102f] text-white shadow-glow " : "bg-white/[.04] text-white/70 hover:bg-white/[.08] ") + "min-w-[92px] rounded-2xl px-4 py-3 text-center transition"}>
                <span className="mx-auto mb-2 grid h-8 place-items-center">{item === "Todos" ? <Sparkles size={24}/> : categoryIcons[item] || <GlassWater size={24}/>}</span>
                <span className="text-xs font-black">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="promocoes" className="container-site py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div><div className="text-xs font-black uppercase tracking-[.2em] text-[#d0102f]">Destaques</div><h2 className="mt-2 text-3xl font-black uppercase tracking-tight">Mais pedidos <span className="text-[#d0102f]">hoje</span></h2></div>
          <button onClick={scrollToCatalog} className="text-sm font-bold text-white/60 hover:text-white">Ver todos</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <article key={product.id} className={(index === 0 ? "md:col-span-2 " : "") + "card group relative min-h-[310px] overflow-hidden rounded-[26px]"}>
              <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0605] via-[#0a0605]/55 to-transparent" />
              {product.promoPrice && <span className="absolute left-4 top-4 rounded-full bg-[#d0102f] px-3 py-1 text-[11px] font-black uppercase">Oferta</span>}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="text-xs font-bold uppercase text-[#ff516b]">{product.category}</div>
                <h3 className="mt-1 text-xl font-black">{product.name}</h3>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>{product.promoPrice && <div className="text-xs text-white/40 line-through">{money(product.price)}</div>}<div className="text-xl font-black text-white">{money(product.promoPrice ?? product.price)}</div></div>
                  <button onClick={() => add(product)} className="grid h-11 w-11 place-items-center rounded-full bg-[#d0102f] transition hover:scale-110"><Plus size={21}/></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {combos.length > 0 && <section className="container-site pb-8">
        <div className="red-gradient relative overflow-hidden rounded-[30px] p-7 shadow-glow md:p-10">
          <div className="absolute -right-12 -top-12 h-60 w-60 rounded-full bg-black/20 blur-2xl" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div><div className="text-xs font-black uppercase tracking-[.2em] text-white/70">Combos do rolê</div><h2 className="mt-2 text-3xl font-black uppercase md:text-4xl">Mais bebida. <br/>Menos complicação.</h2><p className="mt-3 max-w-md text-sm leading-6 text-white/75">Combos prontos para festa, encontro ou madrugada. Adicione ao carrinho e escolha como quer pedir.</p></div>
            <div className="grid gap-3 sm:grid-cols-3">{combos.map((p) => <button key={p.id} onClick={() => add(p)} className="rounded-2xl border border-white/15 bg-black/20 p-4 text-left backdrop-blur transition hover:bg-black/30"><div className="line-clamp-2 text-sm font-black">{p.name}</div><div className="mt-2 text-lg font-black">{money(p.promoPrice ?? p.price)}</div><div className="mt-3 inline-flex items-center gap-1 text-xs font-bold">Adicionar <Plus size={14}/></div></button>)}</div>
          </div>
        </div>
      </section>}

      <section id="catalogo" className="container-site py-12">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><div className="text-xs font-black uppercase tracking-[.2em] text-[#d0102f]">Catálogo</div><h2 className="mt-2 text-3xl font-black uppercase">Escolha suas <span className="text-[#d0102f]">bebidas</span></h2></div>
          <label className="glass flex h-12 items-center gap-2 rounded-full px-4 md:w-[360px]"><Search size={18} className="text-white/45"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar bebida, combo..." className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"/></label>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <article key={product.id} className="card overflow-hidden rounded-2xl">
              <div className="relative aspect-[1/1] overflow-hidden bg-black/30">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105"/>
                {!product.available && <div className="absolute inset-0 grid place-items-center bg-black/70"><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">Indisponível</span></div>}
                {product.promoPrice && <span className="absolute left-2 top-2 rounded-full bg-[#d0102f] px-2.5 py-1 text-[10px] font-black uppercase">Promo</span>}
              </div>
              <div className="p-3.5 md:p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-[#e83a54]">{product.category}</div>
                <h3 className="mt-1 min-h-10 text-sm font-black leading-5 md:text-base">{product.name}</h3>
                <p className="mt-1 line-clamp-2 min-h-8 text-[11px] leading-4 text-white/45">{product.description}</p>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <div>{product.promoPrice && <div className="text-[10px] text-white/35 line-through">{money(product.price)}</div>}<div className="text-base font-black md:text-lg">{money(product.promoPrice ?? product.price)}</div></div>
                  <button disabled={!product.available} onClick={() => add(product)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#d0102f] disabled:cursor-not-allowed disabled:opacity-30"><Plus size={18}/></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!filtered.length && <div className="card mt-4 rounded-2xl p-10 text-center text-white/50">Nenhum produto encontrado nesta categoria.</div>}
      </section>

      <section id="entrega" className="container-site pb-14 pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card rounded-3xl p-6"><Clock3 className="text-[#d0102f]"/><h3 className="mt-5 font-black uppercase">Horário</h3><p className="mt-2 text-sm leading-6 text-white/55">{settings.hours}</p></div>
          <div className="card rounded-3xl p-6"><Truck className="text-[#d0102f]"/><h3 className="mt-5 font-black uppercase">Entrega</h3><p className="mt-2 text-sm leading-6 text-white/55">{settings.delivery_region}<br/>Pedido mínimo: {settings.min_order}</p></div>
          <div className="card rounded-3xl p-6"><MapPin className="text-[#d0102f]"/><h3 className="mt-5 font-black uppercase">Endereço</h3><p className="mt-2 text-sm leading-6 text-white/55">{settings.address}</p></div>
        </div>
      </section>

      <section className="red-gradient py-12">
        <div className="container-site flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-black uppercase">Bateu a sede?</h2><p className="mt-2 text-sm text-white/75">Monte seu carrinho e escolha WhatsApp ou 99 para finalizar.</p></div>
          <button onClick={scrollToCatalog} className="rounded-full bg-black px-7 py-4 text-sm font-black uppercase transition hover:scale-105">Fazer meu pedido</button>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-[#070404] py-10">
        <div className="container-site grid gap-8 md:grid-cols-3">
          <div><img src="/carneiro-drinks-logo-v2.svg" alt="Carneiro Drinks" className="h-28 w-auto object-contain" /><p className="mt-3 max-w-sm text-sm leading-6 text-white/45">Delivery de bebidas com compra rápida pelo WhatsApp ou pela 99.</p><p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-white/30">Venda proibida para menores de 18 anos.</p></div>
          <div><div className="text-sm font-black uppercase">Atendimento</div><p className="mt-3 text-sm leading-6 text-white/45">{settings.hours}<br/>{settings.address}</p></div>
          <div className="flex items-start gap-3 md:justify-end"><a href={settings.instagram} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 hover:bg-white/5"><Instagram size={19}/></a><button onClick={() => window.open("https://wa.me/" + (settings.whatsapp || "").replace(/\D/g, ""), "_blank")} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 hover:bg-white/5"><MessageCircle size={19}/></button></div>
        </div>
      </footer>

      <button onClick={() => window.open("https://wa.me/" + (settings.whatsapp || "").replace(/\D/g, ""), "_blank")} className="pulse-soft fixed bottom-24 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#d0102f] shadow-2xl md:bottom-6 md:right-6" aria-label="WhatsApp"><MessageCircle/></button>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0707]/95 px-4 py-2 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex w-16 flex-col items-center gap-1 text-[10px] font-bold text-[#ff3d5b]"><Home size={19}/>Início</button>
          <button onClick={scrollToCatalog} className="flex w-16 flex-col items-center gap-1 text-[10px] font-bold text-white/55"><PackageCheck size={19}/>Produtos</button>
          <button onClick={() => setCartOpen(true)} className="relative -mt-7 grid h-14 w-14 place-items-center rounded-full bg-[#d0102f] shadow-glow"><ShoppingCart size={23}/>{cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-black text-black">{cartCount}</span>}</button>
          <a href={settings.instagram} target="_blank" rel="noreferrer" className="flex w-16 flex-col items-center gap-1 text-[10px] font-bold text-white/55"><Heart size={19}/>Social</a>
          <button onClick={() => window.open(settings.link99, "_blank")} className="flex w-16 flex-col items-center gap-1 text-[10px] font-bold text-white/55"><ShieldCheck size={19}/>99</button>
        </div>
      </nav>

      {cartOpen && <div className="fixed inset-0 z-50">
        <button className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setCartOpen(false)} aria-label="Fechar carrinho"/>
        <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0e0909] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-5"><div><div className="text-xs font-black uppercase tracking-[.16em] text-[#d0102f]">Seu pedido</div><h2 className="mt-1 text-2xl font-black">Carrinho</h2></div><button onClick={() => setCartOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white/5"><X size={20}/></button></div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {!cart.length && <div className="grid h-full place-items-center text-center"><div><ShoppingCart className="mx-auto text-white/20" size={48}/><p className="mt-4 font-bold text-white/60">Seu carrinho está vazio.</p><button onClick={() => { setCartOpen(false); scrollToCatalog(); }} className="mt-4 text-sm font-black text-[#e51a3a]">Escolher bebidas</button></div></div>}
            {cart.map((line) => <div key={line.product.id} className="card flex gap-3 rounded-2xl p-3"><img src={line.product.image} alt="" className="h-20 w-20 rounded-xl object-cover"/><div className="min-w-0 flex-1"><div className="truncate text-sm font-black">{line.product.name}</div><div className="mt-1 text-sm font-black text-[#e51a3a]">{money(line.product.promoPrice ?? line.product.price)}</div><div className="mt-3 inline-flex items-center gap-3 rounded-full bg-white/5 p-1"><button onClick={() => change(line.product.id, -1)} className="grid h-7 w-7 place-items-center rounded-full bg-white/5"><Minus size={13}/></button><span className="w-4 text-center text-xs font-black">{line.qty}</span><button onClick={() => change(line.product.id, 1)} className="grid h-7 w-7 place-items-center rounded-full bg-[#d0102f]"><Plus size={13}/></button></div></div></div>)}
          </div>
          <div className="border-t border-white/10 p-5">
            <div className="mb-4 flex items-center justify-between"><span className="text-sm text-white/55">Total</span><strong className="text-2xl">{money(total)}</strong></div>
            <button disabled={!cart.length} onClick={whatsappCheckout} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d0102f] px-5 py-4 text-sm font-black uppercase disabled:opacity-30"><MessageCircle size={18}/> Finalizar pelo WhatsApp</button>
            <a href={settings.link99} target="_blank" rel="noreferrer" className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-5 py-4 text-sm font-black uppercase">Pedir pela 99</a>
            <p className="mt-3 text-center text-[10px] leading-4 text-white/35">Na 99, o cliente será direcionado para o link configurado pela loja.</p>
          </div>
        </aside>
      </div>}
    </main>
  );
}
