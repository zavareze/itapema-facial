import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Reconhecimento Facial",
  description: "Revolution Serviços (51) 99992-6208",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Suspense fallback={<div>Carregando...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
