"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bike, ChevronDown, ChevronRight, Clock3, Home, Instagram, MapPin,
  Menu, MessageCircle, Minus, PackageCheck, Plus, Search, ShieldCheck,
  ShoppingCart, Tag, Truck, UserRound, X, Zap
} from "lucide-react";
import BrandLogo from "@/components/brand-logo";
import type { StoreProduct, StoreSettings } from "@/lib/demo";

type CartLine = { product: StoreProduct; qty: number };

const categories = [
  ["Cervejas", "🍺"], ["Whisky", "🥃"], ["Vodka", "🍾"], ["Gin", "🍸"],
  ["Destilados", "🥃"], ["Energéticos", "⚡"], ["Refrigerantes", "🥤"],
  ["Sucos", "🧃"], ["Água", "💧"], ["Gelo", "🧊"], ["Drinks", "🍸"],
  ["Combos", "🎁"], ["Promoções", "🏷️"]
] as const;

const fallbackEmoji: Record<string, string> = {
  Cervejas: "🍺", Whisky: "🥃", Vodka: "🍾", Gin: "🍸", Destilados: "🥃",
  Energéticos: "⚡", Refrigerantes: "🥤", Sucos: "🧃", Água: "💧",
  Gelo: "🧊", Drinks: "🍸", Combos: "🎁", Promoções: "🏷️"
};

const categoryImageKeys: Record<string, string> = {
  Cervejas: "category_cervejas", Whisky: "category_whisky", Vodka: "category_vodka",
  Gin: "category_gin", Destilados: "category_destilados", Energéticos: "category_energeticos",
  Refrigerantes: "category_refrigerantes", Sucos: "category_sucos", Água: "category_agua",
  Gelo: "category_gelo", Drinks: "category_drinks", Combos: "category_combos",
  Promoções: "category_promocoes"
};

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function ProductImage({ product, className = "" }: { product: StoreProduct; className?: string }) {
  return (
    <div className={"relative grid place-items-center overflow-hidden bg-white " + className}>
      <span className="absolute text-5xl opacity-15">{fallbackEmoji[product.category] || "🥤"}</span>
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="relative z-10 h-full w-full object-contain object-center p-2 sm:p-3"
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    </div>
  );
}

export default function Storefront({ initialProducts, settings }: { initialProducts: StoreProduct[]; settings: StoreSettings }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroImages = [settings.hero_image, settings.hero_image_2, settings.hero_image_3].filter(Boolean);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length < 2) return;
    const timer = window.setInterval(() => setHeroIndex((current) => (current + 1) % heroImages.length), 5500);
    return () => window.clearInterval(timer);
  }, [heroImages.length]);

  const filtered = useMemo(() => initialProducts.filter((p) => {
    const cat = category === "Todos" || category === "Promoções"
      ? category === "Todos" || Boolean(p.promoPrice)
      : p.category === category;
    const q = !query || (p.name + " " + p.description + " " + p.category).toLowerCase().includes(query.toLowerCase());
    return cat && q;
  }), [initialProducts, category, query]);

  const popular = initialProducts.filter((p) => !p.combo).slice(0, 7);
  const combo = initialProducts.find((p) => p.combo) || initialProducts[0];
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
    setCart((current) => current
      .map((line) => line.product.id === id ? { ...line, qty: line.qty + delta } : line)
      .filter((line) => line.qty > 0));
  }

  function whatsappCheckout() {
    if (!cart.length) return;
    const lines = cart.map((line) => line.qty + "x " + line.product.name + " — " + money((line.product.promoPrice ?? line.product.price) * line.qty));
    const message = "Olá, quero fazer este pedido:\n\n" + lines.join("\n") + "\n\nTotal: " + money(total);
    const phone = (settings.whatsapp || "").replace(/\D/g, "");
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  }

  function goCatalog(cat = "Todos") {
    setCategory(cat);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050303] pb-[78px] text-white md:pb-0">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/95 shadow-[0_10px_40px_rgba(0,0,0,.35)] backdrop-blur-xl">
        <div className="relative mx-auto flex h-[72px] max-w-[1024px] items-center justify-between px-3 sm:px-4 lg:h-[78px] lg:gap-5">
          <button onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center lg:hidden" aria-label="Abrir menu">
            <Menu size={25} />
          </button>

          <a href="#" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0">
            <BrandLogo className="block h-[62px] w-[100px] sm:h-[66px] sm:w-[106px] lg:h-[72px] lg:w-[112px] [&>svg]:h-full [&>svg]:w-full" />
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-5 text-[12px] font-semibold lg:flex">
            <a href="#" className="rounded-full bg-[#ff1838] px-5 py-2.5">Início</a>
            <button onClick={() => goCatalog("Cervejas")} className="flex items-center gap-1 hover:text-[#ff334f]">Bebidas <ChevronDown size={14}/></button>
            <button onClick={() => goCatalog("Combos")} className="flex items-center gap-1 hover:text-[#ff334f]">Combos <ChevronDown size={14}/></button>
            <a href="#promocoes" className="hover:text-[#ff334f]">Promoções</a>
            <a href="#sobre" className="hover:text-[#ff334f]">Sobre</a>
            <a href="#contato" className="hover:text-[#ff334f]">Contato</a>
          </nav>

          <label className="hidden h-10 w-[180px] items-center gap-2 rounded-full border border-white/20 bg-white/[.03] px-4 xl:flex">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar bebidas..." className="min-w-0 flex-1 bg-transparent text-[11px] outline-none placeholder:text-white/35" />
            <Search size={17}/>
          </label>

          <button onClick={() => setCartOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-full" aria-label="Carrinho">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="absolute -right-1 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[#ff1838] px-1 text-[10px] font-black">{cartCount}</span>}
          </button>

          <button onClick={() => goCatalog()} className="hidden rounded-xl bg-[#ff1838] px-5 py-3 text-[12px] font-black lg:block">Fazer Pedido</button>
        </div>
      </header>

      <section className="relative isolate min-h-[445px] overflow-hidden bg-[#130303] sm:min-h-[460px] md:min-h-[350px] lg:min-h-[325px]">
        <img
          src={heroImages[heroIndex] || "/hero-reference.webp"}
          alt="Bebidas geladas em um balde de gelo"
          loading="eager"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
          className="absolute bottom-0 left-0 h-[250px] w-full object-cover object-center opacity-95 [filter:saturate(1.06)_contrast(1.04)_brightness(.92)] sm:h-[270px] md:bottom-auto md:left-auto md:right-0 md:top-0 md:h-full md:w-[61%] md:object-cover md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#070303_0%,#080303_45%,rgba(8,3,3,.35)_66%,rgba(0,0,0,.15)_100%)] md:bg-[linear-gradient(90deg,#050202_0%,#080303_38%,rgba(8,3,3,.78)_51%,rgba(8,3,3,.10)_76%,rgba(0,0,0,.06)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_40%,rgba(255,0,30,.13),transparent_32%)]" />

        <div className="relative mx-auto flex max-w-[1024px] items-start justify-center px-4 pt-7 text-center sm:pt-8 md:min-h-[350px] md:items-center md:justify-start md:py-7 md:text-left lg:min-h-[325px] lg:px-8">
          <div className="max-w-[390px] md:max-w-[470px]">
            <h1 className="text-[31px] font-black leading-[.98] tracking-[-.035em] sm:text-[36px] md:text-[40px] lg:text-[43px]">
              Bebidas geladas,<br/><span className="text-[#ff1838]">onde você estiver!</span>
            </h1>
            <p className="mx-auto mt-3 max-w-[360px] text-[12px] leading-[18px] text-white/80 md:mx-0 md:max-w-[430px] md:text-[13px] md:leading-5">
              {settings.hero_subtitle}
            </p>
            <button onClick={() => goCatalog()} className="mx-auto mt-4 flex items-center gap-2.5 rounded-xl bg-[#ff1838] px-5 py-3 text-[12px] font-black shadow-[0_12px_32px_rgba(255,24,56,.2)] md:mx-0 md:px-6 md:py-3.5 md:text-[14px]">
              <Bike size={21}/> Fazer Pedido Agora <ChevronRight size={18}/>
            </button>
            <div className="mt-5 hidden flex-wrap gap-x-5 gap-y-2 text-[10px] text-white/75 md:flex">
              <span className="flex items-center gap-2"><Bike size={16}/>Entrega rápida</span>
              <span className="flex items-center gap-2"><ShieldCheck size={16}/>Bebidas originais</span>
              <span className="flex items-center gap-2"><Tag size={16}/>Melhores preços</span>
              <span className="flex items-center gap-2"><Zap size={16}/>Qualidade garantida</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-1 px-3 sm:px-4 lg:mt-0">
        <div className="mx-auto max-w-[990px]">
          <div className="hide-scrollbar flex gap-1.5 overflow-x-auto rounded-2xl bg-white p-2 text-black shadow-[0_14px_45px_rgba(0,0,0,.45)] lg:hidden">
            {categories.map(([name, icon]) => (
              <button
                key={name}
                onClick={() => goCatalog(name)}
                className={"min-w-[74px] rounded-xl px-2 py-2 text-center transition " + (category === name ? "bg-[#fff0f2] text-[#ff1838]" : "bg-white")}
              >
                {settings[categoryImageKeys[name]] ? <img src={settings[categoryImageKeys[name]]} alt="" className="mx-auto h-7 w-8 object-contain"/> : <span className="block text-[21px] leading-6">{icon}</span>}
                <span className={"mt-1 block whitespace-nowrap text-[9px] font-semibold " + (category === name ? "border-b-2 border-[#ff1838] pb-1" : "")}>{name}</span>
              </button>
            ))}
          </div>

          <div className="relative hidden overflow-hidden rounded-2xl bg-white shadow-[0_14px_45px_rgba(0,0,0,.45)] lg:block">
            {categories.some(([name]) => settings[categoryImageKeys[name]]) ? <div className="grid h-[87px] grid-cols-[repeat(13,minmax(0,1fr))] text-black">{categories.map(([name, icon]) => <button key={name} onClick={() => goCatalog(name)} className="grid place-items-center border-r border-black/5 px-1 py-2 last:border-0"><span>{settings[categoryImageKeys[name]] ? <img src={settings[categoryImageKeys[name]]} alt="" className="h-9 w-11 object-contain"/> : <span className="text-2xl">{icon}</span>}</span><span className="text-[9px] font-semibold">{name}</span></button>)}</div> : <><img src={settings.category_strip_image || "/categories-reference.webp"} alt="Categorias de bebidas Carneiro Drinks" className="block h-auto w-full select-none" draggable={false} /><div className="absolute inset-0 grid" style={{ gridTemplateColumns: "repeat(13,minmax(0,1fr))" }}>{categories.map(([name]) => <button key={name} onClick={() => goCatalog(name)} aria-label={"Ver " + name} className="h-full w-full bg-transparent" />)}</div></>}
          </div>
        </div>
      </section>

      <section id="promocoes" className="mx-auto max-w-[1024px] px-3 pb-3 pt-4 sm:px-4 lg:px-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="flex items-center gap-1.5 text-[15px] font-black sm:text-[17px]">
              <Zap size={18} className="shrink-0 fill-[#ff1838] text-[#ff1838]"/> Promoções em Destaque
            </h2>
            <p className="ml-6 text-[9px] text-white/50 sm:ml-7 sm:text-[10px]">Aproveite nossas ofertas especiais</p>
          </div>
          <button onClick={() => goCatalog("Promoções")} className="shrink-0 rounded-full border border-[#ff1838] px-3 py-1.5 text-[9px] sm:px-4 sm:py-2 sm:text-[10px]">
            Ver todas <ChevronRight size={12} className="inline"/>
          </button>
        </div>

        <div className="hide-scrollbar -mx-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-1 sm:-mx-4 sm:px-4 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-3 lg:overflow-visible lg:px-0">
          <article className="relative min-h-[144px] min-w-[88%] snap-start overflow-hidden rounded-xl border border-white/10 bg-[#1a0808] p-4 sm:min-w-[56%] lg:min-w-0">
            {settings.promo_combo_image ? <img src={settings.promo_combo_image} alt="" className="absolute right-0 top-0 h-full w-[46%] object-cover" /> : combo && <img src={combo.image} alt="" className="absolute right-0 top-0 h-full w-[46%] object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
            <div className="relative z-10 max-w-[58%]">
              <h3 className="text-[17px] font-black uppercase leading-[.95] sm:text-[18px]">Combo do<br/><span className="text-[#ff1838]">fim de semana</span></h3>
              <p className="mt-2 text-[9px] leading-[14px] text-white/80 sm:text-[10px] sm:leading-4">1 Whisky Red Label<br/>+ 4 Energéticos<br/>+ Gelo Grátis</p>
              <div className="mt-2 flex items-end gap-2">
                <button onClick={() => combo && add(combo)} className="rounded-full bg-[#ff1838] px-3 py-2 text-[9px] font-bold sm:px-4 sm:text-[10px]">Aproveitar</button>
                <div>
                  <span className="block text-[8px] text-white/45 line-through sm:text-[9px]">De R$ 169,90</span>
                  <strong className="text-[16px] text-[#ff1838] sm:text-[18px]">R$ 149,90</strong>
                </div>
              </div>
            </div>
          </article>

          <article className="relative min-h-[144px] min-w-[88%] snap-start overflow-hidden rounded-xl border border-white/10 bg-[#071409] p-4 sm:min-w-[56%] lg:min-w-0">
            <img src={settings.promo_beer_image || "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=900&q=85"} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" onError={(e)=>e.currentTarget.style.display="none"} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071409] via-[#071409]/90 to-transparent"/>
            <div className="relative z-10 max-w-[60%]">
              <h3 className="text-[17px] font-black uppercase leading-[.95] sm:text-[18px]">Cervejas<br/><span className="text-[#ff1838]">em promoção</span></h3>
              <p className="mt-2 text-[9px] leading-[14px] text-white/80 sm:text-[10px] sm:leading-4">Heineken Long Neck<br/>Por apenas:</p>
              <strong className="mt-0 block text-[18px] text-[#ff1838] sm:text-[19px]">R$ 6,99</strong>
              <button onClick={() => goCatalog("Cervejas")} className="mt-2 rounded-full bg-[#ff1838] px-4 py-2 text-[9px] font-bold sm:text-[10px]">Ver Ofertas</button>
            </div>
          </article>

          <article className="relative min-h-[144px] min-w-[88%] snap-start overflow-hidden rounded-xl border border-white/10 bg-[#240707] p-4 sm:min-w-[56%] lg:min-w-0">
            <img src={settings.promo_drinks_image || "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85"} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" onError={(e)=>e.currentTarget.style.display="none"} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#200505] via-[#200505]/88 to-transparent"/>
            <div className="relative z-10 max-w-[58%]">
              <h3 className="text-[17px] font-black uppercase leading-[.95] sm:text-[18px]">Drinks<br/><span className="text-[#ff1838]">especiais</span></h3>
              <p className="mt-2 text-[9px] leading-[14px] text-white/80 sm:text-[10px] sm:leading-4">Caipirinhas, Gin Tônica<br/>e muito mais!</p>
              <button onClick={() => goCatalog("Drinks")} className="mt-3 rounded-full bg-[#ff1838] px-4 py-2 text-[9px] font-bold sm:text-[10px]">Ver Cardápio</button>
            </div>
          </article>
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-[1024px] scroll-mt-20 px-3 pb-4 pt-1 sm:px-4 lg:px-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h2 className="flex items-center gap-1.5 text-[15px] font-black sm:text-[17px]"><span className="text-[18px] sm:text-[20px]">🔥</span> Mais Pedidos</h2>
            <p className="ml-6 text-[9px] text-white/50 sm:ml-7 sm:text-[10px]">Os favoritos dos nossos clientes</p>
          </div>
          <button onClick={() => goCatalog()} className="shrink-0 rounded-full border border-[#ff1838] px-3 py-1.5 text-[9px] sm:px-4 sm:py-2 sm:text-[10px]">
            Ver todos <ChevronRight size={12} className="inline"/>
          </button>
        </div>

        <div className="hide-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-2 sm:-mx-4 sm:px-4 lg:mx-0 lg:px-0">
          {(query || category !== "Todos" ? filtered : popular).map((product) => (
            <article key={product.id} className="min-w-[132px] max-w-[132px] overflow-hidden rounded-lg bg-white text-black sm:min-w-[145px] sm:max-w-[145px] lg:min-w-[128px] lg:max-w-[128px]">
              <ProductImage product={product} className="h-[106px] w-full sm:h-[118px] lg:h-[112px]" />
              <div className="p-2">
                <h3 className="min-h-[30px] text-[10px] font-black leading-[14px] sm:text-[11px] lg:text-[10px]">{product.name}</h3>
                <p className="mt-0.5 truncate text-[9px] text-black/50">{product.description}</p>
                <div className="mt-2 flex items-center justify-between gap-1.5">
                  <strong className="text-[11px] sm:text-[12px]">{money(product.promoPrice ?? product.price)}</strong>
                  <button onClick={() => add(product)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ff1838] text-white" aria-label={"Adicionar " + product.name}>
                    <Plus size={18}/>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer id="contato" className="border-t border-white/10 bg-black">
        <div className="mx-auto grid max-w-[1024px] grid-cols-1 gap-6 px-4 py-5 sm:grid-cols-2 md:grid-cols-[1.15fr_1fr_1fr_.8fr] md:gap-5">
          <div id="sobre">
            <BrandLogo className="block h-[72px] w-[118px] [&>svg]:h-full [&>svg]:w-full" />
            <p className="mt-2 max-w-[270px] text-[10px] leading-4 text-white/65">Qualidade, variedade e entrega rápida.<br/>Bebidas para todos os momentos.</p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-[12px] font-bold"><Clock3 size={17}/> Horário de Funcionamento</h3>
            <div className="mt-2 space-y-0.5 text-[9px] leading-4 text-white/65">
              {settings.hours.split("•").map((line) => <p key={line.trim()} className={line.includes("Terça") ? "text-[#ff1838]" : ""}>{line.trim()}</p>)}
            </div>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-[12px] font-bold"><Truck size={17}/> Região de Entrega</h3>
            <p className="mt-2 text-[10px] leading-4 text-white/65">{settings.delivery_region}</p>
            <h3 className="mt-4 flex items-center gap-2 text-[12px] font-bold"><MapPin size={17}/> Endereço</h3>
            <p className="mt-2 text-[10px] leading-4 text-white/65">{settings.address}</p>
          </div>

          <div>
            <h3 className="text-[12px] font-bold">Redes Sociais</h3>
            <div className="mt-3 flex gap-2">
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-lg border border-[#ff1838] text-[#ff1838]"><Instagram size={21}/></a>
              <a href={"https://wa.me/" + (settings.whatsapp || "").replace(/\D/g, "")} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-lg border border-white/30"><MessageCircle size={21}/></a>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1024px] flex-col gap-2 border-t border-white/10 px-4 py-3 text-[8px] text-white/45 sm:flex-row sm:items-center sm:justify-between sm:text-[9px]">
          <span>© 2026 Carneiro Drinks. Todos os direitos reservados.</span>
          <span className="flex items-center gap-2 uppercase">Proibida a venda para menores de 18 anos <b className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#ff1838] text-[11px] text-white">18+</b></span>
        </div>
      </footer>

      <button
        onClick={() => window.open("https://wa.me/" + (settings.whatsapp || "").replace(/\D/g, ""), "_blank")}
        className="fixed bottom-6 right-5 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#ff1838] shadow-[0_10px_30px_rgba(255,24,56,.35)] md:grid"
        aria-label="WhatsApp"
      >
        <MessageCircle/>
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 px-2 pb-[max(7px,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-end justify-around">
          <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})} className="flex min-w-[54px] flex-col items-center gap-1 text-[9px] text-[#ff1838]"><Home size={20}/>Início</button>
          <button onClick={() => goCatalog()} className="flex min-w-[54px] flex-col items-center gap-1 text-[9px] text-white/65"><PackageCheck size={20}/>Categorias</button>
          <button onClick={() => goCatalog()} className="-mt-5 flex min-w-[64px] flex-col items-center gap-1 text-[8px] font-bold text-white">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ff1838] shadow-lg"><Bike size={22}/></span>
            Fazer Pedido
          </button>
          <button onClick={() => goCatalog("Promoções")} className="flex min-w-[54px] flex-col items-center gap-1 text-[9px] text-white/65"><Tag size={20}/>Promoções</button>
          <button className="flex min-w-[54px] flex-col items-center gap-1 text-[9px] text-white/65"><UserRound size={20}/>Perfil</button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm lg:hidden">
          <button className="absolute inset-0" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" />
          <aside className="relative h-full w-[84%] max-w-[330px] overflow-y-auto bg-[#090505] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <BrandLogo className="block h-20 w-32 [&>svg]:h-full [&>svg]:w-full"/>
              <button onClick={()=>setMenuOpen(false)} className="grid h-10 w-10 place-items-center"><X/></button>
            </div>
            <div className="mt-5 space-y-1">
              {["Todos","Cervejas","Whisky","Vodka","Gin","Destilados","Energéticos","Refrigerantes","Sucos","Água","Gelo","Drinks","Combos","Promoções"].map((item) => (
                <button key={item} onClick={()=>{goCatalog(item);setMenuOpen(false)}} className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-white/5">
                  {item === "Todos" ? "Início / Todos" : item}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-[80]">
          <button className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setCartOpen(false)} aria-label="Fechar"/>
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0a0606]">
            <div className="flex items-center justify-between border-b border-white/10 p-4 sm:p-5">
              <div><span className="text-xs font-bold uppercase text-[#ff1838]">Seu pedido</span><h2 className="text-2xl font-black">Carrinho</h2></div>
              <button onClick={()=>setCartOpen(false)} className="grid h-10 w-10 place-items-center"><X/></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4">
              {!cart.length && <div className="grid h-full place-items-center text-center text-white/50"><div><ShoppingCart className="mx-auto mb-3" size={46}/><p>Seu carrinho está vazio.</p></div></div>}
              {cart.map((line) => (
                <div key={line.product.id} className="flex gap-3 rounded-xl border border-white/10 bg-white/[.03] p-2.5">
                  <ProductImage product={line.product} className="h-20 w-20 shrink-0 rounded-lg"/>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[12px] font-bold">{line.product.name}</h3>
                    <p className="mt-1 text-sm font-black text-[#ff1838]">{money(line.product.promoPrice ?? line.product.price)}</p>
                    <div className="mt-3 flex w-fit items-center gap-3 rounded-full bg-white/5 p-1">
                      <button onClick={()=>change(line.product.id,-1)} className="grid h-7 w-7 place-items-center rounded-full"><Minus size={14}/></button>
                      <span className="text-xs font-bold">{line.qty}</span>
                      <button onClick={()=>change(line.product.id,1)} className="grid h-7 w-7 place-items-center rounded-full bg-[#ff1838]"><Plus size={14}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between"><span className="text-white/55">Total</span><strong className="text-[20px]">{money(total)}</strong></div>
              <button disabled={!cart.length} onClick={whatsappCheckout} className="w-full rounded-xl bg-[#ff1838] py-4 text-sm font-black uppercase disabled:opacity-40">Finalizar pelo WhatsApp</button>
              <a href={settings.link99} target="_blank" rel="noreferrer" className="mt-2 block w-full rounded-xl border border-white/15 py-4 text-center text-sm font-black uppercase">Pedir pela 99</a>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
