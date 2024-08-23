import { revalidatePath } from "next/cache";
import { ChatHistory } from "~/app/_components/chatHistory";
import { DeityPicker } from "~/app/_components/deityPicker";
import { api, HydrateClient } from "~/trpc/server";

export default async function Chat() {
  void api.ai.getDeities.prefetch();
  const lastMessageId = await api.chat.getLastMessageId();

  return (
    <HydrateClient>
      <main className="hero">
        <div className="hero-content flex w-screen flex-col">
          <ChatHistory className="mx-auto" lastMessageId={lastMessageId} />

          <form
            className="join flex w-full flex-row"
            action={async (formData) => {
              "use server";

              const deityId = formData.get("deity") as string;
              const question = formData.get("question") as string;

              await api.ai.askGod({ deityId, question });
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
              Send
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
