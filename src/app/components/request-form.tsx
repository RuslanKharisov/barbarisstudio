"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import {
  formatToParts,
  generatePattern,
  InputMask,
  unformat,
  useMask,
} from "@react-input/mask";
import { sendMessageToTg } from "../actions/sendMessageToTg";

const phoneValidation = /^(?:\+7|8)?\s?\(?[1-9]\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/;

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Укажите имя" }),
    email: z
      .string()
      .email({ message: "Укажите корректный email" })
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .regex(phoneValidation, { message: "Введите корректный номер телефона" })
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.email || data.phone, {
    message: "Одно из полей [email, phone] обязательно",
    path: ["email"],
  })
  .superRefine((values, ctx) => {
    if (!values.phone && !values.email) {
      ctx.addIssue({
        message:
          "Необходимо указать либо телефон, либо адрес электронной почты.",
        code: z.ZodIssueCode.custom,
        path: ["phone"],
      });
      ctx.addIssue({
        message:
          "Необходимо указать либо телефон, либо адрес электронной почты.",
        code: z.ZodIssueCode.custom,
        path: ["email"],
      });
    }
  });

export function RequestForm() {
  const options = {
    mask: "+7 (___) ___-__-__",
    replacement: { _: /[0-9]/ },
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await sendMessageToTg(data);
    if (res.success) {
      alert("Заявка успешно отправлена!");
      reset();
    } else {
      alert("Ошибка при отправке: " + res.error);
    }
  };

  return (
    <form
      className="font-secondary w-full md:px-14 max-w-lg mx-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col justify-center items-center gap-2 mb-8">
        <input
          className={`w-full rounded-lg px-3 py-3 focus:outline-none focus:ring-1 focus:ring-palette-primary ${
            errors.name
              ? "text-destructive/80 placeholder:text-destructive/70 border-destructive placeholder:font-light placeholder:text-xs"
              : ""
          }`}
          placeholder={errors.name?.message || "Имя"}
          {...register("name", { required: true })}
        />
        <input
          className={`w-full rounded-lg px-3 py-3 focus:outline-none focus:ring-1 focus:ring-palette-primary ${
            errors.email
              ? "text-destructive/80 placeholder:text-destructive/70 border-destructive placeholder:font-light placeholder:text-xs"
              : ""
          }`}
          placeholder={errors.email?.message || "E-mail"}
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          // type="email"
          autoComplete="email"
        />

        <div className="w-full rounded-lg px-3 py-1">
          <span className="">или</span>
        </div>

        <InputMask
          {...options}
          className={`w-full rounded-lg px-3 py-3 focus:outline-none focus:ring-1 focus:ring-palette-primary ${
            errors.phone
              ? "text-destructive/80 placeholder:text-destructive/70 border-destructive placeholder:font-light placeholder:text-xs"
              : ""
          }`}
          placeholder={errors.phone?.message || "987-654-32-10"}
          {...register("phone", {
            onChange: (e) => {
              const value = e.target.value;
              const input = unformat(value, options);
              const parts = formatToParts(value, options);
              const pattern = generatePattern("full-inexact", options);
              const isValid = RegExp(pattern).test(value);
            },
          })}
        />
      </div>

      <input
        type="submit"
        className="w-full py-3 px-4 bg-primary hover:bg-palette-dark text-white text-sm sm:text-base font-semibold rounded-lg border border-transparent 
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-palette-primary hover:bg-primary/75 duration-300 "
      />
    </form>
  );
}
