
import Image from "next/image";
import React from "react";
import { Subscribe } from "../components/subscribe";

export default function Home() {
  return (
    <div className="bg-gradient-to-tr from-red-500 to-purple-400 relative h-screen w-screen">
      <div className="absolute inset-0 flex flex-col justify-center items-center w-5/6 max-w-lg mx-auto text-center">
        <div className="space-y-8">
          <h1 className="font-extrabold text-white text-3xl sm:text-4xl md:text-5xl md:leading-tight">
            Разработка WEB приложений
          </h1>
          <p className="font-semibold text-primary text-2xl sm:text-3xl md:text-4xl md:leading-tight">
            BarbarisStudio
          </p>
          <p className="font-secondary text-palette-light text-base md:text-lg lg:text-xl">
            Свяжитесь с нами, и давайте вместе создадим что-то удивительное!
          </p>
          <Subscribe />
        </div>
      </div>
    </div>
  );
}
