"use client";

import { useMemo, useState } from "react";
import {
  Bike, ChevronDown, ChevronRight, Clock3, Heart, Home, Instagram, MapPin,
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

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function ProductImage({ product, className = "" }: { product: StoreProduct; className?: string }) {
  return (
    <div className={"relative grid place-items-center overflow-hidden bg-white " + className}>
      <span className="absolute text-6xl opacity-20">{fallbackEmoji[product.category] || "🥤"}</span>
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        className="relative z-10 h-full w-full object-contain object-center p-3"
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
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-[#050303] pb-20 text-white md:pb-0">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/95 shadow-[0_10px_40px_rgba(0,0,0,.35)] backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1024px] items-center gap-5 px-4 lg:px-6">
          <button onClick={() => setMenuOpen(true)} className="grid h-10 w-10 place-items-center lg:hidden" aria-label="Abrir menu"><Menu /></button>
          <a href="#" className="shrink-0">
            <BrandLogo className="block h-[72px] w-[112px] [&>svg]:h-full [&>svg]:w-full" />
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-5 text-[12px] font-semibold lg:flex">
            <a href="#" className="rounded-full bg-[#ff1838] px-5 py-2.5">Início</a>
            <button onClick={() => goCatalog("Cervejas")} className="flex items-center gap-1 hover:text-[#ff334f]">Bebidas <ChevronDown size={14}/></button>
            <button onClick={() => goCatalog("Combos")} className="flex items-center gap-1 hover:text-[#ff334f]">Combos <ChevronDown size={14}/></button>
            <a href="#promocoes" className="hover:text-[#ff334f]">Promoções</a>
            <a href="#sobre" className="hover:text-[#ff334f]">Sobre</a>
            <a href="#contato" className="hover:text-[#ff334f]">Contato</a>
          </nav>

          <label className="hidden h-11 w-[185px] items-center gap-2 rounded-full border border-white/20 bg-white/[.03] px-4 xl:flex">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar bebidas..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-white/35" />
            <Search size={18}/>
          </label>

          <button onClick={() => setCartOpen(true)} className="relative ml-auto grid h-11 w-11 place-items-center rounded-full lg:ml-0" aria-label="Carrinho">
            <ShoppingCart />
            {cartCount > 0 && <span className="absolute -right-1 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-[#ff1838] px-1 text-[10px] font-black">{cartCount}</span>}
          </button>
          <button onClick={() => goCatalog()} className="hidden rounded-xl bg-[#ff1838] px-6 py-3 text-sm font-black lg:block">Fazer Pedido</button>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#130303]">
        <img src="/hero-reference.webp" alt="Bebidas geladas no gelo" className="absolute right-0 top-0 h-full w-full object-cover object-center opacity-95 [filter:saturate(1.06)_contrast(1.04)_brightness(.92)] md:w-[61%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050202_0%,#080303_38%,rgba(8,3,3,.78)_51%,rgba(8,3,3,.10)_76%,rgba(0,0,0,.06)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_40%,rgba(255,0,30,.13),transparent_32%)]" />
        <div className="relative mx-auto flex min-h-[350px] max-w-[1024px] items-center px-4 py-7 lg:min-h-[325px] lg:px-8">
          <div className="max-w-[470px] pt-0">
            <h1 className="text-[36px] font-black leading-[.98] tracking-[-.035em] sm:text-[42px] lg:text-[43px]">
              Bebidas geladas,<br/><span className="text-[#ff1838]">onde você estiver!</span>
            </h1>
            <p className="mt-3 max-w-[430px] text-[14px] leading-5 text-white/82 lg:text-[12px]">{settings.hero_subtitle}</p>
            <button onClick={() => goCatalog()} className="mt-4 flex items-center gap-3 rounded-xl bg-[#ff1838] px-6 py-3.5 text-[14px] font-black shadow-[0_12px_32px_rgba(255,24,56,.2)]">
              <Bike size={24}/> Fazer Pedido Agora <ChevronRight size={20}/>
            </button>
            <div className="mt-5 hidden flex-wrap gap-x-5 gap-y-2 text-[10px] text-white/75 sm:flex">
              <span className="flex items-center gap-2"><Bike size={17}/>Entrega rápida</span>
              <span className="flex items-center gap-2"><ShieldCheck size={17}/>Bebidas originais</span>
              <span className="flex items-center gap-2"><Tag size={17}/>Melhores preços</span>
              <span className="flex items-center gap-2"><Zap size={17}/>Qualidade garantida</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-0 px-3 sm:px-4">
        <div className="mx-auto max-w-[990px] overflow-x-auto rounded-2xl bg-white p-1.5 text-black shadow-[0_14px_45px_rgba(0,0,0,.45)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-stretch">
            {categories.map(([name, icon]) => (
              <button key={name} onClick={() => goCatalog(name)} className={"group min-w-[72px] rounded-xl px-2 py-2 text-center transition sm:min-w-[76px] " + (category === name ? "bg-[#fff0f2] text-[#ff1838]" : "hover:bg-[#f7f7f7]")}>
                <span className="block text-[20px]">{icon}</span>
                <span className={"mt-1 block text-[11px] font-semibold " + (category === name ? "border-b-2 border-[#ff1838] pb-1" : "")}>{name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="promocoes" className="mx-auto max-w-[1024px] px-4 pb-3 pt-3 lg:px-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-[17px] font-black"><Zap className="fill-[#ff1838] text-[#ff1838]"/> Promoções em Destaque</h2>
            <p className="ml-8 text-xs text-white/50">Aproveite nossas ofertas especiais</p>
          </div>
          <button onClick={() => goCatalog("Promoções")} className="rounded-full border border-[#ff1838] px-4 py-2 text-xs">Ver todas <ChevronRight size={13} className="inline"/></button>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          <article className="relative min-h-[139px] overflow-hidden rounded-xl border border-white/10 bg-[#1a0808] p-4">
            {combo && <ProductImage product={combo} className="absolute right-0 top-0 h-full w-[48%] bg-transparent [&>span]:hidden [&>img]:p-0" />}
            <div className="relative z-10 max-w-[55%]">
              <h3 className="text-[18px] font-black uppercase leading-[.95]">Combo do<br/><span className="text-[#ff1838]">fim de semana</span></h3>
              <p className="mt-2 text-[10px] leading-4 text-white/80">1 Whisky Red Label<br/>+ 4 Energéticos<br/>+ Gelo Grátis</p>
              <div className="mt-2 flex items-end gap-2">
                <button onClick={() => combo && add(combo)} className="rounded-full bg-[#ff1838] px-4 py-2 text-[10px] font-bold">Aproveitar</button>
                <div><span className="block text-[10px] text-white/45 line-through">De R$ 169,90</span><strong className="text-[18px] text-[#ff1838]">R$ 149,90</strong></div>
              </div>
            </div>
          </article>

          <article className="relative min-h-[139px] overflow-hidden rounded-xl border border-white/10 bg-[#071409] p-4">
            <img src="https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=900&q=85" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" onError={(e)=>e.currentTarget.style.display="none"} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071409] via-[#071409]/90 to-transparent"/>
            <div className="relative z-10 max-w-[58%]">
              <h3 className="text-[18px] font-black uppercase leading-[.95]">Cervejas<br/><span className="text-[#ff1838]">em promoção</span></h3>
              <p className="mt-2 text-[10px] leading-4 text-white/80">Heineken Long Neck<br/>Por apenas:</p>
              <strong className="mt-0 block text-[19px] text-[#ff1838]">R$ 6,99</strong>
              <button onClick={() => goCatalog("Cervejas")} className="mt-3 rounded-full bg-[#ff1838] px-4 py-2 text-[10px] font-bold">Ver Ofertas</button>
            </div>
          </article>

          <article className="relative min-h-[139px] overflow-hidden rounded-xl border border-white/10 bg-[#240707] p-4">
            <img src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" onError={(e)=>e.currentTarget.style.display="none"} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#200505] via-[#200505]/88 to-transparent"/>
            <div className="relative z-10 max-w-[55%]">
              <h3 className="text-[18px] font-black uppercase leading-[.95]">Drinks<br/><span className="text-[#ff1838]">especiais</span></h3>
              <p className="mt-2 text-[10px] leading-4 text-white/80">Caipirinhas, Gin Tônica<br/>e muito mais!</p>
              <button onClick={() => goCatalog("Drinks")} className="mt-4 rounded-full bg-[#ff1838] px-4 py-2 text-[10px] font-bold">Ver Cardápio</button>
            </div>
          </article>
        </div>
      </section>

      <section id="catalogo" className="mx-auto max-w-[1024px] px-4 pb-3 pt-1 lg:px-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-[17px] font-black"><span className="text-[20px]">🔥</span> Mais Pedidos</h2>
            <p className="ml-8 text-xs text-white/50">Os favoritos dos nossos clientes</p>
          </div>
          <button onClick={() => goCatalog()} className="rounded-full border border-[#ff1838] px-4 py-2 text-xs">Ver todos <ChevronRight size={13} className="inline"/></button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(query || category !== "Todos" ? filtered : popular).map((product) => (
            <article key={product.id} className="min-w-[128px] max-w-[128px] overflow-hidden rounded-lg bg-white text-black sm:min-w-[128px] sm:max-w-[128px]">
              <ProductImage product={product} className="h-[112px] w-full" />
              <div className="p-2">
                <h3 className="min-h-[30px] text-[10px] font-black leading-4">{product.name}</h3>
                <p className="mt-0.5 text-[9px] text-black/50">{product.description}</p>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <strong className="text-[12px]">{money(product.promoPrice ?? product.price)}</strong>
                  <button onClick={() => add(product)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ff1838] text-white"><Plus size={20}/></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer id="contato" className="border-t border-white/10 bg-black">
        <div className="mx-auto grid max-w-[1024px] gap-7 px-4 py-4 md:grid-cols-[1.15fr_1fr_1fr_.8fr]">
          <div id="sobre">
            <BrandLogo className="block h-[72px] w-[118px] [&>svg]:h-full [&>svg]:w-full" />
            <p className="mt-2 max-w-[270px] text-[10px] leading-4 text-white/65">Qualidade, variedade e entrega rápida.<br/>Bebidas para todos os momentos.</p>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-[12px] font-bold"><Clock3 size={18}/> Horário de Funcionamento</h3>
            <div className="mt-2 space-y-0.5 text-[9px] leading-4 text-white/65">
              {settings.hours.split("•").map((line) => <p key={line.trim()} className={line.includes("Terça") ? "text-[#ff1838]" : ""}>{line.trim()}</p>)}
            </div>
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-[12px] font-bold"><Truck size={18}/> Região de Entrega</h3>
            <p className="mt-2 text-[10px] leading-4 text-white/65">{settings.delivery_region}</p>
            <h3 className="mt-4 flex items-center gap-2 text-[12px] font-bold"><MapPin size={18}/> Endereço</h3>
            <p className="mt-2 text-[10px] leading-4 text-white/65">{settings.address}</p>
          </div>
          <div>
            <h3 className="text-[12px] font-bold">Redes Sociais</h3>
            <div className="mt-3 flex gap-2">
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-lg border border-[#ff1838] text-[#ff1838]"><Instagram size={22}/></a>
              <a href={"https://wa.me/" + (settings.whatsapp || "").replace(/\D/g, "")} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-lg border border-white/30"><MessageCircle size={22}/></a>
            </div>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1024px] flex-col gap-3 border-t border-white/10 px-4 py-3 text-[9px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Carneiro Drinks. Todos os direitos reservados.</span>
          <span className="flex items-center gap-3 uppercase">Proibida a venda para menores de 18 anos <b className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#ff1838] text-sm text-white">18+</b></span>
        </div>
      </footer>

      <button onClick={() => window.open("https://wa.me/" + (settings.whatsapp || "").replace(/\D/g, ""), "_blank")} className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#ff1838] shadow-[0_10px_30px_rgba(255,24,56,.35)] md:bottom-6" aria-label="WhatsApp"><MessageCircle/></button>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 px-4 py-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-end justify-between">
          <button onClick={() => window.scrollTo({top:0,behavior:"smooth"})} className="flex w-14 flex-col items-center gap-1 text-[9px] text-[#ff1838]"><Home size={20}/>Início</button>
          <button onClick={() => goCatalog()} className="flex w-14 flex-col items-center gap-1 text-[9px] text-white/65"><PackageCheck size={20}/>Categorias</button>
          <button onClick={() => goCatalog()} className="-mt-5 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-[#ff1838] text-[8px] font-bold"><Bike size={23}/></button>
          <button onClick={() => goCatalog("Promoções")} className="flex w-14 flex-col items-center gap-1 text-[9px] text-white/65"><Tag size={20}/>Promoções</button>
          <button className="flex w-14 flex-col items-center gap-1 text-[9px] text-white/65"><UserRound size={20}/>Perfil</button>
        </div>
      </nav>

      {menuOpen && <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm lg:hidden">
        <aside className="h-full w-[82%] max-w-[330px] bg-[#090505] p-5 shadow-2xl">
          <div className="flex items-center justify-between"><BrandLogo className="block h-20 w-32 [&>svg]:h-full [&>svg]:w-full"/><button onClick={()=>setMenuOpen(false)}><X/></button></div>
          <div className="mt-7 space-y-2">
            {["Todos","Cervejas","Whisky","Vodka","Gin","Energéticos","Refrigerantes","Combos","Promoções"].map((item)=><button key={item} onClick={()=>{goCatalog(item);setMenuOpen(false)}} className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-white/5">{item === "Todos" ? "Início / Todos" : item}</button>)}
          </div>
        </aside>
      </div>}

      {cartOpen && <div className="fixed inset-0 z-[80]">
        <button className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setCartOpen(false)} aria-label="Fechar"/>
        <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0a0606]">
          <div className="flex items-center justify-between border-b border-white/10 p-5"><div><span className="text-xs font-bold uppercase text-[#ff1838]">Seu pedido</span><h2 className="text-2xl font-black">Carrinho</h2></div><button onClick={()=>setCartOpen(false)}><X/></button></div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {!cart.length && <div className="grid h-full place-items-center text-center text-white/50"><div><ShoppingCart className="mx-auto mb-3" size={46}/><p>Seu carrinho está vazio.</p></div></div>}
            {cart.map((line)=><div key={line.product.id} className="flex gap-3 rounded-xl border border-white/10 bg-white/[.03] p-2"><ProductImage product={line.product} className="h-20 w-20 shrink-0 rounded-lg"/><div className="min-w-0 flex-1"><h3 className="truncate text-[12px] font-bold">{line.product.name}</h3><p className="mt-1 text-sm font-black text-[#ff1838]">{money(line.product.promoPrice ?? line.product.price)}</p><div className="mt-3 flex w-fit items-center gap-3 rounded-full bg-white/5 p-1"><button onClick={()=>change(line.product.id,-1)} className="grid h-7 w-7 place-items-center rounded-full"><Minus size={14}/></button><span className="text-xs font-bold">{line.qty}</span><button onClick={()=>change(line.product.id,1)} className="grid h-7 w-7 place-items-center rounded-full bg-[#ff1838]"><Plus size={14}/></button></div></div></div>)}
          </div>
          <div className="border-t border-white/10 p-5">
            <div className="mb-4 flex items-center justify-between"><span className="text-white/55">Total</span><strong className="text-[20px]">{money(total)}</strong></div>
            <button disabled={!cart.length} onClick={whatsappCheckout} className="w-full rounded-xl bg-[#ff1838] py-4 text-sm font-black uppercase disabled:opacity-40">Finalizar pelo WhatsApp</button>
            <a href={settings.link99} target="_blank" rel="noreferrer" className="mt-2 block w-full rounded-xl border border-white/15 py-4 text-center text-sm font-black uppercase">Pedir pela 99</a>
          </div>
        </aside>
      </div>}
    </main>
  );
}
