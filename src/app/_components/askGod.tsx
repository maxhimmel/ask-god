"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

const deities = ["Jesus", "Buddha", "Krishna", "Allah"];

export function AskGod() {
  const [answer, setAnswer] = useState<string | undefined>(undefined);

  const createAnswer = api.ai.ask.useMutation();

  return (
    <div>
      <form
        className="flex flex-col gap-2"
        onSubmit={async (form) => {
          form.preventDefault();

          const formData = new FormData(form.target as HTMLFormElement);
          const deity = formData.get("deity") as string;
          const question = formData.get("question") as string;

          const response = await createAnswer.mutateAsync({
            hp: deity,
            question,
          });

          setAnswer(response.answer);
        }}
      >
        <select
          name="deity"
          defaultValue={""}
          className="select select-bordered"
          required
        >
          <option disabled value={""}>
            Pick a deity:
          </option>

          {deities.map((deity) => (
            <option key={deity} value={deity}>
              {deity}
            </option>
          ))}
        </select>

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

      <div className="">{answer}</div>
    </div>
  );
}
