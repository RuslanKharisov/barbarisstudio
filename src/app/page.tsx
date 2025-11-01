import Image from "next/image";
import React from "react";
import { Video } from "../components/ui/video";
import { RequestForm } from "../components/request-form";

export default function Home() {
  return (
    <div className="bg-gradient-to-tr from-red-500 to-purple-400 relative h-screen w-screen">
      <div className="absolute inset-0 flex flex-col justify-center items-center w-5/6 max-w-lg mx-auto text-center z-10">
        <div className="space-y-8">
          <h1 className="font-extrabold text-white text-3xl sm:text-4xl md:text-5xl md:leading-tight">
            Разработка WEB приложений
          </h1>
          <p className="font-semibold text-primary text-2xl sm:text-3xl md:text-4xl md:leading-tight hover:scale-105 duration-700 [text-shadow:_0_1px_0_rgb(255_255_255_/_30%)]">
            BarbarisStudio
          </p>
          <p className="text-secondary text-base md:text-lg lg:text-xl">
            Свяжитесь с нами, и давайте обсудим вашу задачу!
          </p>
          <RequestForm />
        </div>
      </div>
      <Video className=" absolute top-0 left-0 w-full h-full object-cover opacity-30" />
    </div>
  );
}
