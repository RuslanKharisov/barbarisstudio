// src/app/components/request-form.tsx
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
} from "@react-input/mask";
// Путь к вашему экшену, возможно, отличается
import { sendMessageToTg } from "../shared/actions/sendMessageToTg";
import { Textarea } from "@/shared/ui/textarea";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"; // Убедитесь, что импортируете только useGoogleReCaptcha здесь
import { toast } from "sonner";

const phoneValidation = /^(?:\+7|8)?\s?\(?[1-9]\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/;

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Укажите имя" }).max(30),
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
    messageText: z.string().max(300, { message: "Не более 300 знаков" }),
    // Убираем обязательность из схемы, проверим в onSubmit
    recaptchaToken: z
      .string()
      .min(1, { message: "Ошибка проверки безопасности." }),
  })
  .refine((data) => data.email || data.phone, {
    message: "Одно из полей [email, phone] обязательно",
    path: ["email"],
  });

export function RequestForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const options = {
    mask: "+7 (___) ___-__-__",
    replacement: { _: /[0-9]/ },
  };

  const {
    register,
    handleSubmit, // Оставляем, но используем в обёрнутой функции
    getValues, // Добавляем getValues
    trigger, // Добавляем trigger
    reset,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      messageText: "",
      recaptchaToken: "", // Устанавливаем пустое значение по умолчанию
    },
  });

  const onSubmitWrapped = async (data: z.infer<typeof formSchema>) => {
    // Этот код НЕ должен сработать, если recaptchaToken не заполнен в data до вызова,
    // но если handleSubmit обходит валидацию, это может быть точкой входа.
    // Однако, мы не используем handleSubmit напрямую для вызова этой функции.
    console.log(
      "onSubmitWrapped вызван с данными (до получения токена):",
      data
    );
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Предотвращаем стандартное поведение

    if (!executeRecaptcha) {
      setError("recaptchaToken", {
        message: "Ошибка загрузки проверки безопасности.",
      });
      console.error("executeRecaptcha не доступен");
      return;
    }

    try {
      // 1. Выполняем reCAPTCHA
      console.log("Выполняем executeRecaptcha...");
      const recaptchaToken = await executeRecaptcha("submit_form");
      console.log("Получен токен reCAPTCHA:", recaptchaToken);

      if (!recaptchaToken) {
        setError("recaptchaToken", {
          message: "Ошибка проверки безопасности.",
        });
        console.error("Токен reCAPTCHA не получен");
        return;
      }

      // 2. Получаем текущие значения формы
      const currentFormData = getValues();
      console.log(
        "Текущие данные формы (до добавления токена):",
        currentFormData
      );

      // 3. Создаём обновлённые данные с токеном
      const formDataWithToken = {
        ...currentFormData,
        recaptchaToken,
      };
      console.log("Данные формы с токеном:", formDataWithToken);

      // 4. Явно вызываем валидацию для всех полей, включая recaptchaToken
      console.log("Выполняем валидацию формы с токеном...");
      const isFormValid = await trigger(); // Возвращает true/false

      console.log(
        "Результат валидации (после добавления токена):",
        isFormValid
      );
      console.log("Текущие ошибки после валидации:", errors);

      if (!isFormValid) {
        console.log("Форма не прошла валидацию после добавления токена.");
        // setError может быть уже вызван react-hook-form для других полей
        // Ошибка recaptchaToken будет в errors.recaptchaToken, если токен пуст или невалиден
        return;
      }

      // 5. Если валидация успешна, отправляем данные
      console.log("Отправляем данные на сервер...");
      const res = await sendMessageToTg(formDataWithToken);
      if (res.success) {
        toast.success("Заявка успешно отправлена!");
        reset();
      } else {
        toast.error("Ошибка при отправке: " + res.error);
      }
    } catch (error) {
      console.error("Ошибка выполнения reCAPTCHA или отправки:", error);
      setError("recaptchaToken", { message: "Ошибка проверки безопасности." });
      toast.error("Произошла ошибка при отправке.");
    }
  };

  return (
    <form
      className="font-primary w-full md:px-14 max-w-lg mx-auto"
      onSubmit={handleFormSubmit} // Используем нашу обёрнутую функцию
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
          {...register("email")}
          // type="email"
          autoComplete="email"
        />

        <div className="w-full rounded-lg px-3 py-1">
          <span className="text-secondary">или</span>
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
        <Textarea
          {...register("messageText", {
            maxLength: 300,
            validate: (value) =>
              value.split(/[.!?]/).filter((s) => s.trim() !== "").length <= 2 ||
              "Не более 2 предложений",
          })}
          placeholder="Напишите короткое сообщение ( до 2 предложений )"
          className="w-full rounded-lg px-3 py-3 focus:outline-none focus:ring-1 focus:ring-palette-primary placeholder:font-light "
        />
        {errors.messageText && (
          <p className="text-secondary">{errors.messageText.message}</p>
        )}
        {/* Отображение ошибки recaptchaToken, если она есть */}
        {errors.recaptchaToken && (
          <p className="text-destructive text-sm mt-1">
            {errors.recaptchaToken.message}
          </p>
        )}
      </div>

      <input
        type="submit"
        value="Отправить"
        className="w-full py-3 px-4 bg-primary hover:bg-palette-dark text-white text-sm sm:text-base font-semibold rounded-lg border border-transparent 
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-palette-primary hover:bg-primary/75 duration-300 pointer cursor-pointer"
      />
    </form>
  );
}
