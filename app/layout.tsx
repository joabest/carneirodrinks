import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";

const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-caveat" });

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
    <html lang="pt-BR" className={caveat.variable}>
      <head>
        <link rel="icon" href="/carneiro-drinks-logo.webp" type="image/svg+xml" />
        <link rel="shortcut icon" href="/carneiro-drinks-logo.webp" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
