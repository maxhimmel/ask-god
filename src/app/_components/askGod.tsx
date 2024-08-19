"use client";

import { api } from "~/trpc/react";
import { useRef, useState } from "react";
import { DeityPicker } from "~/app/_components/deityPicker";
import { ChatHistory } from "~/app/_components/chatHistory";

export function AskGod() {
  const formRef = useRef<HTMLFormElement>(null);
  const [answer, setAnswer] = useState<string | undefined>(undefined);

  const createAnswer = api.ai.getAnswer.useMutation();

  return (
    <div>
      <form
        ref={formRef}
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
          disabled={createAnswer.isPending}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              formRef.current?.requestSubmit();
              e.preventDefault();
            }
          }}
        ></textarea>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={createAnswer.isPending}
        >
          Ask God
        </button>
      </form>

      <ChatHistory>{answer}</ChatHistory>
    </div>
  );
}
