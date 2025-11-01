export interface FormData {
  name: string;
  email?: string;
  phone?: string;
}

export const sendMessageToTg = async (
  data: FormData
): Promise<{ success?: string; error?: string }> => {
  try {
    const res = await fetch("/api/send-tg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error: any) {
    return { error: error.message || "Ошибка запроса" };
  }
};

