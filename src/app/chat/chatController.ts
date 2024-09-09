import { api } from "~/trpc/server";

export function prefetchChat() {
    void api.ai.getDeities.prefetch();
    void api.chat.getChatRoom.prefetch();
}