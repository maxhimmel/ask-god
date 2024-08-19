"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { DeityPicker } from "~/app/_components/deityPicker";
import { ChatHistory } from "~/app/_components/chatHistory";

export function AskGod() {
  const [answer, setAnswer] = useState<string | undefined>(undefined);

  const createAnswer = api.ai.getAnswer.useMutation();

  return (
    <div>
      <form
        className="flex flex-col gap-2"
        action={async (form) => {
          const deity = form.get("deity") as string;
          const question = form.get("question") as string;

          const response = await createAnswer.mutateAsync({
            hp: deity,
            question,
          });

          setAnswer(response.answer);
        }}
      >
        <DeityPicker />

        <textarea
          name="question"
          className="textarea textarea-bordered"
          placeholder="What's on your mind?"
          required
        ></textarea>

        <button type="submit" className="btn btn-lg">
          Ask God
        </button>
      </form>

      <ChatHistory>{answer}</ChatHistory>
    </div>
  );
}
