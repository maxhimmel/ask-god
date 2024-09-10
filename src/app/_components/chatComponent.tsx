"use client";

import { ChatHistory } from "~/app/_components/chatHistory";
import { DeityPicker } from "~/app/_components/deityPicker";
import { ChatContextProvider } from "~/app/contexts/chatContext";
import { useChatForm, useChatRoom, useClearChat } from "~/app/hooks/chatHooks";

export function ChatComponent() {
  const chatRoom = useChatRoom();

  return (
    <ChatContextProvider
      messageHistory={new Map(chatRoom.messages?.map((msg) => [msg.id, msg]))}
    >
      <ChatHistory className="mx-auto" />
      <ChatForm />
      <ClearChatButton />
    </ChatContextProvider>
  );
}

function ChatForm() {
  const { questionRef, askGod, setMessages, setIsCommunicating } =
    useChatForm();

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

        setIsCommunicating(true);

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

        setIsCommunicating(false);
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
  const { clearChat, isPending } = useClearChat();

  return (
    <form
      onSubmit={async (formEvent) => {
        formEvent.preventDefault();

        await clearChat();
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
