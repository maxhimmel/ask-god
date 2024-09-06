import { Message } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
    getChatRoom: protectedProcedure
        .mutation(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            let chatRoom = await ctx.db.chatRoom.findFirst({
                where: { userId },
                include: { messages: true }
            });

            if (!chatRoom) {
                chatRoom = await ctx.db.chatRoom.create({
                    data: { userId },
                    include: { messages: true }
                });
            }

            return chatRoom;
        }),

    clearChat: protectedProcedure
        .mutation(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            const chatRoom = await ctx.db.chatRoom.findFirstOrThrow({
                where: { userId },
                include: { messages: true }
            });

            await ctx.db.message.deleteMany({
                where: { chatRoomId: chatRoom.id }
            });
        }),

    getLastMessageId: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            let chatRoom = await ctx.db.chatRoom.findFirst({
                where: { userId },
                include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } }
            });

            if (!chatRoom) {
                chatRoom = await ctx.db.chatRoom.create({
                    data: { userId },
                    include: { messages: true }
                });
            }

            return chatRoom.messages[0]?.id ?? null;
        }),

    getMessages: protectedProcedure
        .input(z.object({ cursor: z.string().nullish() }))
        .query(async ({ ctx }) => {
            const chatRoom = await ctx.db.chatRoom.findFirstOrThrow({
                where: { userId: ctx.session.user.id },
                include: { messages: true }
            });

            const messages = chatRoom.messages;
            const nextCursor = messages.length > 0 ? messages[messages.length - 1]?.id : null;

            return {
                messages,
                nextCursor
            }
        })
});
