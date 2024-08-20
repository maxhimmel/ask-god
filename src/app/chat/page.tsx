import { ChatRoom, Message } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ChatHistory } from "~/app/_components/chatHistory";
import { DeityPicker } from "~/app/_components/deityPicker";
import { api, HydrateClient } from "~/trpc/server";

export default async function Chat() {
  const chatRoom = await api.chat.getChatRoom();
  const batchedMessages = convertToPrettyMessages(chatRoom);

  return (
    <HydrateClient>
      <main className="hero">
        <div className="hero-content flex w-screen flex-col">
          <ChatHistory className="mx-auto flex flex-col-reverse">
            {batchedMessages.map((message) => (
              <div
                key={message.id}
                className={`flex [&:not(:first-child)]:mb-4 ${message.isDeity ? "justify-start" : "justify-end"}`}
              >
                <pre className="text-wrap font-sans">
                  <strong className="text-lg">{message.senderName}:</strong>{" "}
                  {message.content}
                </pre>
              </div>
            ))}
          </ChatHistory>

          <form
            className="join flex w-full flex-row"
            action={async (formData) => {
              "use server";

              const deityId = formData.get("deity") as string;
              const question = formData.get("question") as string;

              await api.ai.askGod({ deityId, question });

              // TODO: Replace this with a subscription to the chat room
              revalidatePath("/chat");
            }}
          >
            <DeityPicker className="join-item" />
            <input
              name="question"
              type="text"
              className="input join-item input-bordered flex w-full flex-1 flex-grow"
              placeholder="Ask a question..."
            />
            <button type="submit" className="btn btn-primary join-item">
              Ask
            </button>
          </form>

          {/*---*/}

          <form
            action={async () => {
              "use server";

              await api.chat.clearChat();
              revalidatePath("/chat");
            }}
          >
            <button type="submit" className="btn btn-error">
              Clear Chat
            </button>
          </form>
        </div>
      </main>
    </HydrateClient>
  );
}

function convertToPrettyMessages(chatRoom: ChatRoom & { messages: Message[] }) {
  const messages = chatRoom.messages;
  messages.sort((lhs, rhs) => {
    return (
      new Date(lhs.createdAt).getTime() - new Date(rhs.createdAt).getTime()
    );
  });

  const batchedMessages = messages.reduce((acc, message) => {
    const lastMessage = acc[acc.length - 1];
    if (lastMessage && lastMessage.senderId === message.senderId) {
      lastMessage.content += message.content;
    } else {
      acc.push({ ...message });
    }
    return acc;
  }, new Array<Message>());

  batchedMessages.reverse();

  return batchedMessages;
}
