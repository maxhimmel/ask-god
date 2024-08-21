"use client";

import type { Message } from "@prisma/client";
import { useState } from "react";
import { api } from "~/trpc/react";

export interface Props {
  lastMessageId?: string | null;
  className?: string;
}

export function ChatHistory({ lastMessageId, className }: Props) {
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());

  api.ai.onMessageAdded.useSubscription(
    { lastEventId: lastMessageId },
    {
      onData: ({ data }) => {
        let newData = data;

        if (messages.has(data.batchId)) {
          const existing = messages.get(data.batchId)!;
          newData = { ...existing };
          newData.content += data.content;
          newData.createdAt = data.createdAt;
        }

        setMessages((prev) => {
          const updated = new Map(prev);
          updated.set(data.batchId, newData);
          return updated;
        });
      },
    },
  );

  return (
    <div
      className={`flex h-[calc(100vh*0.75)] w-full flex-col-reverse overflow-y-auto rounded-md border-4 border-base-200 p-4 ${className}`}
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
      className={`flex [&:not(:first-child)]:mb-4 ${
        message.isDeity ? "justify-start" : "justify-end"
      }`}
    >
      <pre className="text-wrap font-sans">
        <strong className="text-lg">{message.senderName}:</strong>{" "}
        {message.content}
      </pre>
    </div>
  );
}
