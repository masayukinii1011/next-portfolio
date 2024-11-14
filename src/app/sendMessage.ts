"use server";

import type { Toast as SendMessageResponse } from "@/hooks/use-toast";
import type { z } from "zod";
import type { formSchema } from "./components/ContactForm";

const sendMessageApi = process.env.SEND_MESSAGE_API ?? "";

export async function sendMessage(
  values: z.infer<typeof formSchema>
): Promise<SendMessageResponse> {
  if (!sendMessageApi) {
    return {
      description: "メッセージ送信APIが定義されていません。",
      variant: "destructive",
    };
  }

  try {
    const res = await fetch(sendMessageApi, {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`エラー: ${res.status}`);
    }

    return {
      description: "メッセージが送信されました。",
    };
  } catch (error) {
    console.error(error);
    return {
      description: "メッセージの送信に失敗しました。もう一度お試しください。",
      variant: "destructive",
    };
  }
}
