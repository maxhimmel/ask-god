"use client";

import type { Message } from "@prisma/client";
import { useState } from "react";
import { api } from "~/trpc/react";

export interface Props {
  className?: string;
}

export function ChatHistory({ className }: Props) {
  const [lastMessageId] = api.chat.getLastMessageId.useSuspenseQuery();
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());

  api.ai.onMessageAdded.useSubscription(
    { lastEventId: lastMessageId },
    {
      onStarted: () => {
        console.log("onStarted");
      },
      onData: ({ data }) => {
        setMessages((prev) => {
          let newData = data;
          const updatedMessages = new Map(prev);

          if (updatedMessages.has(newData.batchId)) {
            const existing = updatedMessages.get(newData.batchId)!;
            newData = { ...existing };
            newData.content += data.content;
            newData.createdAt = data.createdAt;
          }

          updatedMessages.set(newData.batchId, newData);
          return updatedMessages;
        });
      },
    },
  );

  return (
    <div
      className={`input input-bordered flex h-[calc(100vh*0.75)] w-full flex-col-reverse overflow-y-auto rounded-md p-4 ${className}`}
    >
      {Array.from(messages.values())
        .reverse()
        .map((message) => (
          <MessageComponent key={message.batchId} message={message} />
        ))}
    </div>
  );
}

function MessageComponent({ message }: { message: Message }) {
  return (
    <div
      className={`flex w-4/5 flex-col [&:not(:first-child)]:mb-4 ${
        message.isDeity
          ? "mr-auto justify-start text-start"
          : "ml-auto justify-end text-end"
      }`}
    >
      <p className="text-lg font-thin">{message.senderName}</p>
      <pre className="text-wrap font-sans">{message.content}</pre>
    </div>
  );
}
