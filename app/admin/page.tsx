"use client";

import { FormEvent, useEffect, useState } from "react";
import { Beer, LogOut, Plus, Save, Trash2, Settings, Package, Pencil, X } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  promoPrice: number | null;
  available: boolean;
  featured: boolean;
  combo: boolean;
  sortOrder: number;
};

type SettingsMap = Record<string, string>;

const blankProduct: Omit<Product, "id"> = {
  name: "",
  description: "",
  category: "Cervejas",
  image: "",
  price: 0,
  promoPrice: null,
  available: true,
  featured: false,
  combo: false,
  sortOrder: 0,
};

const settingFields = [
  ["hero_title", "Título principal"],
  ["hero_subtitle", "Texto do banner"],
  ["hero_image", "Banner principal"],
  ["category_strip_image", "Faixa com imagens das categorias"],
  ["promo_combo_image", "Imagem da promoção: combo"],
  ["promo_beer_image", "Imagem da promoção: cervejas"],
  ["promo_drinks_image", "Imagem da promoção: drinks"],
  ["whatsapp", "WhatsApp com DDI + DDD"],
  ["link99", "Link oficial da 99"],
  ["instagram", "Link do Instagram"],
  ["address", "Endereço"],
  ["hours", "Horário de funcionamento"],
  ["delivery_region", "Região de entrega"],
  ["min_order", "Pedido mínimo"],
] as const;

const imageSettingKeys = new Set([
  "hero_image", "category_strip_image", "promo_combo_image",
  "promo_beer_image", "promo_drinks_image"
]);

async function fileToOptimizedDataUrl(file: File) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = objectUrl;
    });
    const limit = 1920;
    const scale = Math.min(1, limit / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.86);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SettingsMap>({});
  const [tab, setTab] = useState<"products" | "settings">("products");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<Product, "id">>(blankProduct);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const productResponse = await fetch("/api/admin/products", { cache: "no-store" });
    if (productResponse.status === 401) {
      setAuthorized(false);
      return;
    }
    const settingResponse = await fetch("/api/admin/settings", { cache: "no-store" });
    setProducts(await productResponse.json());
    setSettings(await settingResponse.json());
    setAuthorized(true);
  }

  useEffect(() => { load(); }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setLoading(false);
    if (!response.ok) { setMessage("Senha inválida."); return; }
    setPassword("");
    await load();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthorized(false);
  }

  function openCreate() {
    setDraft({ ...blankProduct });
    setEditing(null);
    setCreating(true);
  }

  function openEdit(product: Product) {
    setDraft({
      name: product.name,
      description: product.description,
      category: product.category,
      image: product.image,
      price: product.price,
      promoPrice: product.promoPrice,
      available: product.available,
      featured: product.featured,
      combo: product.combo,
      sortOrder: product.sortOrder,
    });
    setEditing(product);
    setCreating(true);
  }

  async function saveProduct(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const url = editing ? "/api/admin/products/" + editing.id : "/api/admin/products";
    const response = await fetch(url, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
    setLoading(false);
    if (!response.ok) { const data = await response.json().catch(() => ({})); setMessage(data.error || "Não foi possível salvar."); return; }
    setCreating(false);
    setEditing(null);
    setMessage("Produto salvo com sucesso.");
    await load();
  }

  async function removeProduct(id: string) {
    if (!confirm("Excluir este produto?")) return;
    const response = await fetch("/api/admin/products/" + id, { method: "DELETE" });
    if (response.ok) { setMessage("Produto excluído."); await load(); }
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/admin/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setLoading(false);
    setMessage(response.ok ? "Configurações salvas." : "Erro ao salvar configurações.");
  }

  async function selectSettingImage(key: string, file?: File) {
    if (!file) return;
    setLoading(true);
    setMessage("Preparando imagem...");
    try {
      const value = await fileToOptimizedDataUrl(file);
      setSettings((current) => ({ ...current, [key]: value }));
      setMessage("Imagem pronta. Clique em Salvar configurações.");
    } catch {
      setMessage("Não foi possível processar essa imagem.");
    } finally {
      setLoading(false);
    }
  }

  async function selectProductImage(file?: File) {
    if (!file) return;
    setLoading(true);
    try {
      const image = await fileToOptimizedDataUrl(file);
      setDraft((current) => ({ ...current, image }));
    } catch {
      setMessage("Não foi possível processar essa foto.");
    } finally {
      setLoading(false);
    }
  }

  if (authorized === null) return <main className="grid min-h-screen place-items-center bg-[#0a0605] text-white"><div className="animate-pulse font-black uppercase">Carregando painel...</div></main>;

  if (!authorized) return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,#2c050a,#0a0605_48%)] p-4 text-white">
      <form onSubmit={login} className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#130d0d] p-7 shadow-2xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#d0102f] shadow-glow"><Beer size={30}/></div>
        <h1 className="mt-5 text-center text-2xl font-black uppercase">Carneiro <span className="text-[#d0102f]">Drinks</span></h1>
        <p className="mt-2 text-center text-sm text-white/45">Painel administrativo</p>
        <label className="mt-6 block text-xs font-black uppercase text-white/55">Senha</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-[#d0102f]" required />
        {message && <p className="mt-3 text-sm text-[#ff6077]">{message}</p>}
        <button disabled={loading} className="mt-5 w-full rounded-xl bg-[#d0102f] py-3.5 text-sm font-black uppercase disabled:opacity-50">{loading ? "Entrando..." : "Entrar"}</button>
      </form>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#0a0605] text-white">
      <header className="border-b border-white/10 bg-[#0d0808]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#d0102f]"><Beer size={20}/></span><div><div className="font-black uppercase">Carneiro <span className="text-[#d0102f]">Drinks</span></div><div className="text-xs text-white/40">Administração do delivery</div></div></div>
          <div className="flex items-center gap-2"><a href="/" target="_blank" className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold hover:bg-white/5">Ver site</a><button onClick={logout} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 hover:bg-white/5"><LogOut size={17}/></button></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr] md:px-6">
        <aside className="h-fit rounded-2xl border border-white/10 bg-[#130d0d] p-2">
          <button onClick={() => setTab("products")} className={(tab === "products" ? "bg-[#d0102f] " : "hover:bg-white/5 ") + "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-black"}><Package size={18}/> Produtos</button>
          <button onClick={() => setTab("settings")} className={(tab === "settings" ? "bg-[#d0102f] " : "hover:bg-white/5 ") + "mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-black"}><Settings size={18}/> Configurações</button>
        </aside>

        <section className="min-w-0">
          {message && <div className="mb-4 rounded-xl border border-[#d0102f]/30 bg-[#d0102f]/10 px-4 py-3 text-sm">{message}<button onClick={() => setMessage("")} className="float-right"><X size={16}/></button></div>}

          {tab === "products" && <>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-black uppercase">Produtos</h1><p className="mt-1 text-sm text-white/45">Cadastre bebidas, combos, preços e disponibilidade.</p></div><button onClick={openCreate} className="flex items-center justify-center gap-2 rounded-xl bg-[#d0102f] px-4 py-3 text-sm font-black"><Plus size={17}/> Novo produto</button></div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#130d0d]">
              <div className="hidden grid-cols-[70px_1.2fr_.8fr_.7fr_.6fr_100px] gap-3 border-b border-white/10 bg-white/[.02] px-4 py-3 text-[11px] font-black uppercase text-white/40 md:grid"><div>Foto</div><div>Produto</div><div>Categoria</div><div>Preço</div><div>Status</div><div>Ações</div></div>
              {products.length === 0 && <div className="p-8 text-center text-sm text-white/45">Nenhum produto no banco ainda. Clique em “Novo produto”.</div>}
              {products.map((product) => <div key={product.id} className="grid gap-3 border-b border-white/5 p-4 last:border-0 md:grid-cols-[70px_1.2fr_.8fr_.7fr_.6fr_100px] md:items-center">
                <div>{product.image ? <img src={product.image} alt="" className="h-14 w-14 rounded-xl object-cover"/> : <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/5 text-xs text-white/30">sem foto</div>}</div>
                <div><div className="font-black">{product.name}</div><div className="mt-1 line-clamp-1 text-xs text-white/40">{product.description}</div></div>
                <div className="text-sm text-white/60">{product.category}</div>
                <div><div className="font-black">R$ {(product.promoPrice ?? product.price).toFixed(2).replace(".", ",")}</div>{product.promoPrice !== null && <div className="text-xs text-white/35 line-through">R$ {product.price.toFixed(2).replace(".", ",")}</div>}</div>
                <div><span className={(product.available ? "bg-green-500/10 text-green-300 " : "bg-white/5 text-white/35 ") + "rounded-full px-2.5 py-1 text-[11px] font-black"}>{product.available ? "Disponível" : "Indisponível"}</span></div>
                <div className="flex gap-2"><button onClick={() => openEdit(product)} className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 hover:bg-white/10"><Pencil size={15}/></button><button onClick={() => removeProduct(product.id)} className="grid h-9 w-9 place-items-center rounded-lg bg-[#d0102f]/10 text-[#ff5470] hover:bg-[#d0102f]/20"><Trash2 size={15}/></button></div>
              </div>)}
            </div>
          </>}

          {tab === "settings" && <form onSubmit={saveSettings} className="rounded-2xl border border-white/10 bg-[#130d0d] p-5 md:p-6">
            <div className="mb-6"><h1 className="text-2xl font-black uppercase">Configurações</h1><p className="mt-1 text-sm text-white/45">WhatsApp, link da 99, banner, atendimento e informações da loja.</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              {settingFields.map(([key, label]) => <label key={key} className={key === "hero_subtitle" || imageSettingKeys.has(key) ? "md:col-span-2" : ""}>
                <span className="text-xs font-black uppercase text-white/55">{label}</span>
                {key === "hero_subtitle" ? <textarea value={settings[key] || ""} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-[#d0102f]"/> : imageSettingKeys.has(key) ? <div className="mt-2 flex flex-col gap-3 rounded-xl border border-dashed border-white/15 bg-white/[.03] p-3 sm:flex-row sm:items-center">
                  {settings[key] ? <img src={settings[key]} alt="Prévia" className="h-24 w-full rounded-lg bg-black/40 object-contain sm:w-40"/> : <div className="grid h-24 w-full place-items-center rounded-lg bg-black/25 text-xs text-white/35 sm:w-40">Sem imagem</div>}
                  <div className="flex-1">
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => selectSettingImage(key, e.target.files?.[0])} className="block w-full text-xs text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#d0102f] file:px-4 file:py-2.5 file:font-black file:text-white"/>
                    <input value={settings[key]?.startsWith("data:") ? "" : settings[key] || ""} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} placeholder="ou cole a URL da imagem" className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-xs outline-none focus:border-[#d0102f]"/>
                  </div>
                </div> : <input value={settings[key] || ""} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-[#d0102f]"/>}
              </label>)}
            </div>
            <button disabled={loading} className="mt-6 flex items-center gap-2 rounded-xl bg-[#d0102f] px-5 py-3 text-sm font-black uppercase disabled:opacity-50"><Save size={17}/> Salvar configurações</button>
          </form>}
        </section>
      </div>

      {creating && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
        <form onSubmit={saveProduct} className="my-6 w-full max-w-2xl rounded-[26px] border border-white/10 bg-[#130d0d] p-5 shadow-2xl md:p-7">
          <div className="flex items-center justify-between"><div><div className="text-xs font-black uppercase tracking-[.18em] text-[#d0102f]">Catálogo</div><h2 className="mt-1 text-2xl font-black">{editing ? "Editar produto" : "Novo produto"}</h2></div><button type="button" onClick={() => setCreating(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white/5"><X size={18}/></button></div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label><span className="text-xs font-black uppercase text-white/55">Nome</span><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-[#d0102f]"/></label>
            <label><span className="text-xs font-black uppercase text-white/55">Categoria</span><input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} required className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-[#d0102f]"/></label>
            <label className="md:col-span-2"><span className="text-xs font-black uppercase text-white/55">Descrição</span><textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-[#d0102f]"/></label>
            <label className="md:col-span-2"><span className="text-xs font-black uppercase text-white/55">Foto do produto</span><div className="mt-2 flex flex-col gap-3 rounded-xl border border-dashed border-white/15 bg-white/[.03] p-3 sm:flex-row sm:items-center">
              {draft.image ? <img src={draft.image} alt="Prévia do produto" className="h-24 w-full rounded-lg bg-black/40 object-contain sm:w-32"/> : <div className="grid h-24 w-full place-items-center rounded-lg bg-black/25 text-xs text-white/35 sm:w-32">Sem foto</div>}
              <div className="flex-1"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => selectProductImage(e.target.files?.[0])} className="block w-full text-xs text-white/60 file:mr-3 file:rounded-lg file:border-0 file:bg-[#d0102f] file:px-4 file:py-2.5 file:font-black file:text-white"/><input value={draft.image.startsWith("data:") ? "" : draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="ou cole a URL da imagem" className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-xs outline-none focus:border-[#d0102f]"/></div>
            </div></label>
            <label><span className="text-xs font-black uppercase text-white/55">Preço normal</span><input type="number" step="0.01" min="0" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} required className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-[#d0102f]"/></label>
            <label><span className="text-xs font-black uppercase text-white/55">Preço promocional</span><input type="number" step="0.01" min="0" value={draft.promoPrice ?? ""} onChange={(e) => setDraft({ ...draft, promoPrice: e.target.value === "" ? null : Number(e.target.value) })} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-[#d0102f]"/></label>
            <label><span className="text-xs font-black uppercase text-white/55">Ordem</span><input type="number" value={draft.sortOrder} onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 outline-none focus:border-[#d0102f]"/></label>
            <div className="flex flex-wrap items-end gap-4 pb-2">
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={draft.available} onChange={(e) => setDraft({ ...draft, available: e.target.checked })}/> Disponível</label>
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}/> Destaque</label>
              <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={draft.combo} onChange={(e) => setDraft({ ...draft, combo: e.target.checked })}/> Combo</label>
            </div>
          </div>
          <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d0102f] py-3.5 text-sm font-black uppercase disabled:opacity-50"><Save size={17}/> {loading ? "Salvando..." : "Salvar produto"}</button>
        </form>
      </div>}
    </main>
  );
}
