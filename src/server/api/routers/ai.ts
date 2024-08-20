import { google } from "@ai-sdk/google";
import { Message } from "@prisma/client";
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
                    senderName: ctx.session.user.name as string,
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
                        // TODO: Add an ID to connect these packets being sent
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
                // TODO: Get messages since the last event ID and yield them ...
                console.log("lastEventId", opts.input.lastEventId);
            }

            for await (const [data] of on(eventEmitter, "message")) {
                const message = data as Message;
                yield tracked(message.id, message);
            }
        })
});
