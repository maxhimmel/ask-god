"use client";

import type { Message } from "@prisma/client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface IChatContext {
  messages: Map<string, Message>;
  setMessages: Dispatch<SetStateAction<Map<string, Message>>>;

  isCommunicating: boolean;
  setIsCommunicating: Dispatch<SetStateAction<boolean>>;
}

const chatContext = createContext<IChatContext | null>(null);

function ChatContextProvider({
  children,
  messageHistory,
}: {
  children: React.ReactNode;
  messageHistory: Map<string, Message>;
}) {
  const [messages, setMessages] = useState(messageHistory);
  const [isCommunicating, setIsCommunicating] = useState(false);

  return (
    <chatContext.Provider
      value={{
        messages,
        setMessages,
        isCommunicating,
        setIsCommunicating,
      }}
    >
      {children}
    </chatContext.Provider>
  );
}

const useChatContext = () => {
  const context = useContext(chatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
};

export type { IChatContext };
export { ChatContextProvider, useChatContext };
