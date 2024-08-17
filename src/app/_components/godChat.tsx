"use client";

import { readStreamableValue } from "ai/rsc";
import { useState } from "react";
import { generate } from "~/app/chat/actions";
import { api } from "~/trpc/react";

export function GodChat() {
  const [prompt, setPrompt] = useState<string>("");
  const [generation, setGeneration] = useState<string>("");

  const createChat = api.ai.streamChat.useMutation();

  return (
    <div>
      <textarea
        className="textarea textarea-bordered"
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      ></textarea>

      <button
        className="btn btn-primary btn-lg"
        onClick={async () => {
          const chatIterator = await createChat.mutateAsync({
            hp: "Buddha",
            question: prompt,
          }); //generate(prompt);

          for await (const { output } of chatIterator) {
            console.log({ output });
            setGeneration(
              (currentGeneration) => `${currentGeneration}${output}`,
            );
          }
          // for await (const delta of readStreamableValue(output)) {
          //   setGeneration(
          //     (currentGeneration) => `${currentGeneration}${delta}`,
          //   );
          // }
        }}
      >
        Chat
      </button>

      <div>
        <pre className="font-sans">{generation}</pre>
      </div>
    </div>
  );
}
