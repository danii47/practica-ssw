import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-base",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KnowledgExchange — Intercambia habilidades, no dinero",
  description:
    "Plataforma colaborativa para intercambiar servicios y conocimientos sin barreras económicas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="h-screen w-screen flex overflow-hidden bg-canvas text-ink antialiased font-sans selection:bg-brand/15 selection:text-brand-darker">
        {children}
      </body>
    </html>
  );
}
