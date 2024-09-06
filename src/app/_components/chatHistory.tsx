"use client";

import type { Message } from "@prisma/client";

export interface Props {
  className?: string;
  messages: Message[];
}

export function ChatHistory({ className, messages }: Props) {
  return (
    <div
      className={`input input-bordered flex h-[calc(100vh*0.75)] w-full flex-col-reverse overflow-y-auto rounded-md p-4 ${className}`}
    >
      {messages?.map((message) => (
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
