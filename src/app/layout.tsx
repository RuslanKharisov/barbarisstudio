import React, { ReactNode } from 'react';
import type { Metadata } from "next"
import "./styles/globals.css";
import { Geist, Geist_Mono } from "next/font/google";

interface RootLayoutProps {
  children: ReactNode; // Указываем тип для children
}

export const metadata: Metadata = {
  title: "Разработка WEB приложений",
  description:
    "Заказать разработку WEB приложения любой сложности на базе NEXT JS",
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
