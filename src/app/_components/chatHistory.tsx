"use client";

import { api } from "~/trpc/react";

export interface Props {
  className?: string;
  children: React.ReactNode;
}

export function ChatHistory({ children, className }: Props) {
  api.ai.onMessageAdded.useSubscription(undefined, {
    onData: (tracked) => {
      console.log(tracked);
    },
  });

  return (
    <div
      className={`h-[calc(100vh*0.75)] w-full overflow-y-auto rounded-md border-2 border-base-200 p-4 ${className}`}
    >
      {children}
    </div>
  );
}
