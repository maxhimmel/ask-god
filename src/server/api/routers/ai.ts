import { google } from "@ai-sdk/google";
import type { Message } from "@prisma/client";
import { tracked } from "@trpc/server";
import { streamText } from "ai";
import { randomUUID } from "crypto";
import EventEmitter, { on } from "events";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

const eventEmitter = new EventEmitter();

export const aiRouter = createTRPCRouter({
    getDeities: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.deity.findMany();
        }),

    askGod: protectedProcedure
        .input(z.object({ deityId: z.string(), question: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const chatRoom = await ctx.db.chatRoom.findFirstOrThrow({
                where: { userId },
            });

            const userMessage = await ctx.db.message.create({
                data: {
                    batchId: randomUUID(),
                    content: input.question,
                    senderName: ctx.session.user.name!,
                    senderId: userId,
                    isDeity: false,
                    chatRoomId: chatRoom.id,
                },
            });
            eventEmitter.emit<Message>("message", userMessage);

            const deity = await ctx.db.deity.findUniqueOrThrow({ where: { id: input.deityId } });

            const { textStream } = await streamText({
                model: google("models/gemini-1.5-flash-latest"),
                system: `You are ${deity.name}.`,
                prompt: input.question,
            });

            const batchId = randomUUID();
            for await (const delta of textStream) {
                const deityMessage = await ctx.db.message.create({
                    data: {
                        batchId,
                        content: delta,
                        senderName: deity.name,
                        senderId: deity.id,
                        isDeity: true,
                        chatRoomId: chatRoom.id,
                    },
                });
                eventEmitter.emit<Message>("message", deityMessage);
            }
        }),

    onMessageAdded: protectedProcedure
        .input(z.object({
            lastEventId: z.string().nullish()
        }).optional())
        .subscription(async function* (opts) {
            if (opts.input && opts.input.lastEventId) {
                const lastMessage = await opts.ctx.db.message.findFirst({
                    where: { id: opts.input.lastEventId }
                });

                if (!lastMessage) {
                    return;
                }

                const messages = await opts.ctx.db.message.findMany({
                    where: { chatRoomId: lastMessage.chatRoomId, createdAt: { lte: lastMessage.createdAt } }
                });

                for (const message of messages) {
                    yield tracked(message.id, message);
                }
            }

            for await (const [data] of on(eventEmitter, "message")) {
                const message = data as Message;
                yield tracked(message.id, message);
            }
        })
});
