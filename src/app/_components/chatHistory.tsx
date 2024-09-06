"use client";

import type { Message } from "@prisma/client";
import { api } from "~/trpc/react";

export interface Props {
  className?: string;
}

export function ChatHistory({ className }: Props) {
  const [lastMessageId] = api.chat.getLastMessageId.useSuspenseQuery();
  const [{ pages }] = api.chat.getMessages.useSuspenseInfiniteQuery(
    {},
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchInterval: 500,
      initialCursor: lastMessageId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div
      className={`input input-bordered flex h-[calc(100vh*0.75)] w-full flex-col-reverse overflow-y-auto rounded-md p-4 ${className}`}
    >
      {pages.map((page, i) => (
        <div key={i}>
          {page.messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
        </div>
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
