import { ChatComponent } from "~/app/_components/chatComponent";
import { prefetchChat } from "~/app/chat/chatController";
import { HydrateClient } from "~/trpc/server";

export default async function Chat() {
  prefetchChat();

  return (
    <HydrateClient>
      <main className="hero">
        <div className="hero-content flex w-screen flex-col">
          <ChatComponent />
        </div>
      </main>
    </HydrateClient>
  );
}
