import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
    getChatRoom: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            return await ctx.db.getChatRoom({
                userId,
                includeMessages: true
            });
        }),

    clearChat: protectedProcedure
        .mutation(async ({ ctx }) => {
            const userId = ctx.session.user.id;

            await ctx.db.clearChat({ userId });
        }),
});
