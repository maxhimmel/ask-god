"use client";

import { useRef, useTransition } from "react";
import { ChatHistory } from "~/app/_components/chatHistory";
import { DeityPicker } from "~/app/_components/deityPicker";
import {
  ChatContextProvider,
  useChatContext,
} from "~/app/contexts/chatContext";
import { api } from "~/trpc/react";

export function ChatComponent() {
  const [chatRoom] = api.chat.getChatRoom.useSuspenseQuery();

  return (
    <ChatContextProvider
      messageHistory={new Map(chatRoom.messages.map((msg) => [msg.id, msg]))}
    >
      <ChatHistory className="mx-auto" />
      <ChatForm />
      <ClearChatButton />
    </ChatContextProvider>
  );
}

function ChatForm() {
  const questionRef = useRef<HTMLInputElement>(null);
  const askGod = api.ai.askGod.useMutation();
  const { setMessages } = useChatContext();

  return (
    <form
      className="join join-vertical flex w-full sm:join-horizontal"
      onSubmit={async (formEvent) => {
        formEvent.preventDefault();

        const formData = new FormData(formEvent.currentTarget);
        const deityId = formData.get("deity") as string;
        const question = formData.get("question") as string;

        if (questionRef.current) {
          questionRef.current.value = "";
        }

        for await (const message of await askGod.mutateAsync({
          deityId,
          question,
        })) {
          setMessages((prevMessages) => {
            const newMessages = new Map(prevMessages);
            newMessages.set(message.id, message);
            return newMessages;
          });
        }
      }}
    >
      <DeityPicker className="join-item" />
      <input
        ref={questionRef}
        name="question"
        type="text"
        className="input join-item input-bordered flex w-full"
        placeholder="Ask a question..."
      />
      <button type="submit" className="btn btn-primary join-item">
        Send
      </button>
    </form>
  );
}

function ClearChatButton() {
  const clearChat = api.chat.clearChat.useMutation();
  const [isPending, startClearing] = useTransition();
  const { setMessages } = useChatContext();

  return (
    <form
      onSubmit={async (formEvent) => {
        formEvent.preventDefault();

        startClearing(async () => {
          await clearChat.mutateAsync();
          setMessages(new Map());
        });
      }}
    >
      <button type="submit" className="btn btn-error" disabled={isPending}>
        {isPending ? (
          <span className="loading loading-spinner" />
        ) : (
          "Clear Chat"
        )}
      </button>
    </form>
  );
}
