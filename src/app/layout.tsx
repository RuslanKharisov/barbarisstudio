import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Montserrat, Roboto_Mono } from "next/font/google";
import "./styles/globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Разработка WEB приложений",
  description:
    "Заказать разработку WEB приложения любой сложности на базе NEXT JS",
};

const montserrat = Montserrat({
  style: ["normal"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// ✅ Remove the `export` keyword here
const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body
        className={`${montserrat.className} ${roboto_mono.className} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
