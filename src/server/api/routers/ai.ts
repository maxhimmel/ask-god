import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const aiRouter = createTRPCRouter({
    getDeities: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.deity.findMany();
        }),

    askGod: protectedProcedure
        .input(z.object({ deityId: z.string(), question: z.string() }))
        .mutation(async function* ({ ctx, input }) {
            const userId = ctx.session.user.id;

            const chatRoom = await ctx.db.chatRoom.findFirstOrThrow({
                where: { userId },
            });

            const userMessage = await ctx.db.message.create({
                data: {
                    content: input.question,
                    senderName: ctx.session.user.name!,
                    senderId: userId,
                    isDeity: false,
                    chatRoomId: chatRoom.id,
                },
            });
            yield userMessage;

            const deity = await ctx.db.deity.findUniqueOrThrow({ where: { id: input.deityId } });

            const { textStream } = await streamText({
                model: google("models/gemini-1.5-flash-latest"),
                system: `You are ${deity.name}.`,
                prompt: input.question,
            });

            const deityMessage = await ctx.db.message.create({
                data: {
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
                const updatedDeityMessage = await ctx.db.message.update({
                    where: { id: deityMessage.id },
                    data: { content },
                });
                yield updatedDeityMessage;
            }
        }),
});
