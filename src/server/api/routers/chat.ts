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
});
