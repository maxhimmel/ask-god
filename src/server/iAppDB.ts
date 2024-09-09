import type { ChatRoom, Deity, Message, PrismaClient } from "@prisma/client";

type ChatRoomWithMessages = ChatRoom & { messages?: Message[] };

export interface IAppDB {
    getDeity({ id }: { id: string }): Promise<Deity>;
    getDeities(): Promise<Deity[]>;

    createMessage({ content, senderName, senderId, isDeity, chatRoomId }: {
        content: string;
        senderName: string;
        senderId: string;
        isDeity: boolean;
        chatRoomId: string;
    }): Promise<Message>;

    updateMessage({ id, content }: {
        id: string;
        content: string;
    }): Promise<Message>;

    getChatRoom({ userId, includeMessages }: {
        userId: string;
        includeMessages: boolean
    }): Promise<ChatRoomWithMessages>;

    clearChat({ userId }: { userId: string }): Promise<void>;
}

export abstract class BaseAppDB implements IAppDB {
    protected db: PrismaClient;

    constructor({ db }: { db: PrismaClient }) {
        this.db = db;
    }

    abstract getDeity({ id }: { id: string }): Promise<Deity>;
    abstract getDeities(): Promise<Deity[]>;

    abstract createMessage({ content, senderName, senderId, isDeity, chatRoomId }: {
        content: string;
        senderName: string;
        senderId: string;
        isDeity: boolean;
        chatRoomId: string;
    }): Promise<Message>;

    abstract updateMessage({ id, content }: {
        id: string;
        content: string;
    }): Promise<Message>;

    abstract getChatRoom({ userId, includeMessages }: {
        userId: string;
        includeMessages: boolean
    }): Promise<ChatRoomWithMessages>;

    abstract clearChat({ userId }: { userId: string }): Promise<void>;
}