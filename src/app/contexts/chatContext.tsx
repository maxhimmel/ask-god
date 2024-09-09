"use client";

import type { Message } from "@prisma/client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export interface IChatContext {
  messages: Map<string, Message>;
  setMessages: Dispatch<SetStateAction<Map<string, Message>>>;
}

export const ChatContext = createContext<IChatContext | null>(null);

export function ChatContextProvider({
  children,
  messageHistory,
}: {
  children: React.ReactNode;
  messageHistory: Map<string, Message>;
}) {
  const [messages, setMessages] = useState(messageHistory);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
};
