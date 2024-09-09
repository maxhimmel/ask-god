import { Message } from "@prisma/client";
import { db } from "~/server/db";
import { BaseAppDB } from "~/server/iAppDB";

class AppDB extends BaseAppDB {
    async getDeity({ id }: { id: string }) {
        return await this.db.deity.findUniqueOrThrow({ where: { id } });
    }
    async getDeities() {
        return await this.db.deity.findMany();
    }

    async createMessage({ content, senderName, senderId, isDeity, chatRoomId }: {
        content: string;
        senderName: string;
        senderId: string;
        isDeity: boolean;
        chatRoomId: string;
    }
    ) {
        return await this.db.message.create({
            data: {
                content,
                senderName,
                senderId,
                isDeity,
                chatRoomId,
            },
        });
    }

    async updateMessage({ id, content }: { id: string; content: string; }): Promise<Message> {
        return await this.db.message.update({
            where: { id },
            data: { content }
        });
    }

    async getChatRoom({ userId, includeMessages }: { userId: string; includeMessages?: boolean }) {
        let chatRoom = await this.db.chatRoom.findFirst({
            where: { userId },
            include: { messages: includeMessages }
        });

        if (!chatRoom) {
            chatRoom = await this.db.chatRoom.create({
                data: { userId },
                include: { messages: true }
            });
        }

        return chatRoom;
    }

    async clearChat({ userId }: { userId: string }) {
        const chatRoom = await this.getChatRoom({ userId, includeMessages: false });

        await this.db.message.deleteMany({
            where: { chatRoomId: chatRoom.id }
        });
    }
}

export const appDB = new AppDB({ db });