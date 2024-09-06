import { ChatHistory } from "~/app/_components/chatHistory";
import { DeityPicker } from "~/app/_components/deityPicker";
import { askGod, clearChat, getMessages } from "~/server/api/actions";
import { api, HydrateClient } from "~/trpc/server";

export default async function Chat() {
  void api.ai.getDeities.prefetch();

  const messages = await getMessages();
  messages.reverse();

  return (
    <HydrateClient>
      <main className="hero">
        <div className="hero-content flex w-screen flex-col">
          <ChatHistory className="mx-auto" messages={messages} />

          <form
            className="join join-vertical flex w-full sm:join-horizontal"
            action={async (formData) => {
              "use server";

              const deityId = formData.get("deity") as string;
              const question = formData.get("question") as string;

              await askGod({ deityId, question });
            }}
          >
            <DeityPicker className="join-item" />
            <input
              name="question"
              type="text"
              className="input join-item input-bordered flex w-full"
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

              await clearChat();
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
