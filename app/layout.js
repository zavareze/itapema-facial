import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Thermas Clube Parque das Águas",
  description: "Compre seu Passaporte e aproveite o Melhor Parque Aquático da Região",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={inter.className + " bg-white dark:bg-slate-900"}
        suppressHydrationWarning={true}
      >
        <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>
      </body>
      <GoogleAnalytics gaId="G-CX0HDJXQY4" />
    </html>
  );
}
