import { ChatComponent } from "~/app/chat/chatComponent";
import { api, HydrateClient } from "~/trpc/server";

export default async function Chat() {
  void api.ai.getDeities.prefetch();
  void api.chat.getChatRoom.prefetch();

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
