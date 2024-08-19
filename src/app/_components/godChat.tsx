"use client";

import { useState } from "react";
import { ChatHistory } from "~/app/_components/chatHistory";
import { DeityPicker } from "~/app/_components/deityPicker";
import { api } from "~/trpc/react";

export function GodChat() {
  const [generation, setGeneration] = useState<string>("");

  const createChat = api.ai.streamChat.useMutation();

  return (
    <div>
      <form
        className="flex flex-col gap-2"
        action={async (form) => {
          const deity = form.get("deity") as string;
          const prompt = form.get("question") as string;

          const chatIterator = await createChat.mutateAsync({
            hp: deity,
            question: prompt,
          });

          for await (const { output } of chatIterator) {
            setGeneration(
              (currentGeneration) => `${currentGeneration}${output}`,
            );
          }
        }}
      >
        <DeityPicker />

        <textarea
          name="question"
          className="textarea textarea-bordered"
          placeholder="What's on your mind?"
        ></textarea>

        <button type="submit" className="btn btn-primary btn-lg">
          Chat
        </button>
      </form>

      <ChatHistory>{generation}</ChatHistory>
    </div>
  );
}
