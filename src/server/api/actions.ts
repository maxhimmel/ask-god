"use server";

import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";

export async function askGod({ deityId, question }: {
    deityId: string,
    question: string
}) {
    const session = await getServerAuthSession();
    if (!session) {
        throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const chatRoom = await db.chatRoom.findFirstOrThrow({
        where: { userId },
    });

    // Send user's message
    await db.message.create({
        data: {
            batchId: randomUUID(),
            content: question,
            senderName: session.user.name!,
            senderId: userId,
            isDeity: false,
            chatRoomId: chatRoom.id,
        },
    });
    revalidatePath("/chat");

    const deity = await db.deity.findUniqueOrThrow({ where: { id: deityId } });

    const { textStream } = await streamText({
        model: google("models/gemini-1.5-flash-latest"),
        system: `You are ${deity.name}.`,
        prompt: question,
    });

    const batchId = randomUUID();
    const deityMessage = await db.message.create({
        data: {
            batchId,
            content: "",
            senderName: deity.name,
            senderId: deity.id,
            isDeity: true,
            chatRoomId: chatRoom.id,
        },
    });
    let content = "";
    for await (const delta of textStream) {
        content += delta;
        await db.message.update({
            where: { id: deityMessage.id },
            data: { content },
        });
        revalidatePath("/chat");
    }
}

export async function clearChat() {
    const session = await getServerAuthSession();
    if (!session) {
        throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const chatRoom = await db.chatRoom.findFirstOrThrow({
        where: { userId }
    });

    await db.message.deleteMany({
        where: { chatRoomId: chatRoom.id }
    });

    revalidatePath("/chat");
}

export async function getMessages() {
    const session = await getServerAuthSession();
    if (!session) {
        throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const chatRoom = await db.chatRoom.findFirstOrThrow({
        where: { userId },
        include: { messages: true }
    });

    return chatRoom.messages;
}