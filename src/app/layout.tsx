import React, { ReactNode } from 'react';
import type { Metadata } from "next"
import { Poppins } from "next/font/google";
import "./styles/globals.css";

interface RootLayoutProps {
  children: ReactNode; // Указываем тип для children
}

export const metadata: Metadata = {
  title: "Разработка WEB приложений",
  description:
    "Заказать разработку WEB приложения любой сложности на базе NEXT JS",
}

const poppins = Poppins({
  style:["normal"],
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins"
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
