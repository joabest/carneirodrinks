import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carneiro Drinks | Delivery de Bebidas",
  description: "Bebidas geladas, combos e promoções com pedido rápido pelo WhatsApp ou 99.",
  icons: {
    icon: "/carneiro-drinks-logo.svg",
    shortcut: "/carneiro-drinks-logo.svg",
    apple: "/carneiro-drinks-logo.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
