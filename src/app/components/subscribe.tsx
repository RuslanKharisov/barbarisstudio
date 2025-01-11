"use client";

import { useState } from "react";
import React from "react";

function Subscribe() {
  const [email, setEmail] = useState("");
  const [clicked, setClicked] = useState(false);

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log("🚀 ~ handleSubmit ~ e:", email);
  }

  return (
    <form
      className="font-secondary flex flex-shrink w-full px-2 max-w-lg mx-auto justify-center"
      onSubmit={handleSubmit}
    >
      <input
        className="border border-r-0 border-secondary rounded-l-lg w-2/3
              px-3
              focus:outline-none focus:ring-1 focus:ring-palette-primary"
        type="email"
        required
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={() => handleSubmit}
        type="submit"
        className="py-3 px-4 bg-primary hover:bg-palette-dark text-white text-sm sm:text-base font-semibold rounded-r-lg border border-transparent 
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-palette-primary hover:bg-primary/75 duration-300"
      >
        Отправить
      </button>
    </form>
  );
}

export { Subscribe };
