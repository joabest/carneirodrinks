# Carneiro Drinks

Site completo de delivery de bebidas, mobile-first, com identidade visual preto/vermelho/branco e experiência inspirada em apps de delivery.

## Recursos

- Home responsiva com hero, categorias, destaques, combos e catálogo
- Busca e filtros por categoria
- Carrinho com quantidades e total automático
- Checkout por WhatsApp com mensagem pronta
- Botão/link para pedido pela 99
- Horário, região de entrega, pedido mínimo, endereço e mapa
- Painel administrativo em `/admin`
- CRUD de produtos
- Destaques, promoções e combos
- Configuração de WhatsApp, link da 99, Instagram, banner, endereço e horários
- PostgreSQL via Prisma

## Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Lucide Icons

## Configuração

1. Crie um banco PostgreSQL (Supabase, Neon ou outro provedor).
2. Copie `.env.example` para `.env.local`.
3. Configure:

```env
DATABASE_URL="postgresql://..."
ADMIN_PASSWORD="uma-senha-forte"
ADMIN_SESSION_SECRET="uma-chave-longa-e-aleatoria"
```

4. Instale as dependências:

```bash
npm install
```

5. Crie as tabelas:

```bash
npm run db:push
```

6. Opcional: carregue dados iniciais:

```bash
npm run db:seed
```

7. Rode localmente:

```bash
npm run dev
```

## Vercel

Importe este repositório na Vercel e cadastre as 3 variáveis de ambiente acima. O comando de build já executa `prisma generate` automaticamente.

Depois de publicar, acesse `/admin` para cadastrar produtos e trocar WhatsApp, link da 99 e informações da loja.

## Observação

Sem `DATABASE_URL`, a home utiliza um catálogo demonstrativo para que o layout continue visível. O painel administrativo requer banco configurado para funcionar.
