import { useRef, useTransition } from "react";
import { useChatContext } from "~/app/contexts/chatContext";
import { api } from "~/trpc/react";

export function useDeities() {
    const [deities] = api.ai.getDeities.useSuspenseQuery();
    return deities;
}

export function useChatRoom() {
    const [chatRoom] = api.chat.getChatRoom.useSuspenseQuery();
    return chatRoom;
}

export function useChatForm() {
    const questionRef = useRef<HTMLInputElement>(null);
    const askGod = api.ai.askGod.useMutation();
    const { setMessages, setIsCommunicating } = useChatContext();

    return {
        questionRef,
        askGod,
        setMessages,
        setIsCommunicating,
    };
}

export function useClearChat() {
    const clearChat = api.chat.clearChat.useMutation();
    const [isPending, startClearing] = useTransition();
    const { setMessages } = useChatContext();

    return {
        clearChat: async () => {
            startClearing(async () => {
                await clearChat.mutateAsync();
                setMessages(new Map());
            });
        },
        isPending,
    };
}