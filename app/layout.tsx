import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carneiro Drinks | Delivery de Bebidas",
  description: "Bebidas geladas, combos e promoções com pedido rápido pelo WhatsApp ou 99.",
  icons: {
    icon: [{ url: "/carneiro-drinks-logo.webp", type: "image/svg+xml" }],
    shortcut: [{ url: "/carneiro-drinks-logo.webp", type: "image/svg+xml" }],
    apple: [{ url: "/carneiro-drinks-logo.webp", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/carneiro-drinks-logo.webp" type="image/svg+xml" />
        <link rel="shortcut icon" href="/carneiro-drinks-logo.webp" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
