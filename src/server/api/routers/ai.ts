import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const aiRouter = createTRPCRouter({
    getDeities: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.deity.findMany();
        }),

    getAnswer: publicProcedure
        .input(z.object({ hp: z.string(), question: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { name: hpName } = await ctx.db.deity.findUniqueOrThrow({
                where: { id: input.hp },
            });

            const { text } = await generateText({
                model: google("models/gemini-1.5-flash-latest"),
                prompt: input.question,
                system: `You are ${hpName}.`
            });

            return {
                answer: text,
            };
        }),

    streamChat: publicProcedure
        .input(z.object({ hp: z.string(), question: z.string() }))
        .mutation(async function* ({ ctx, input }) {
            const { name: hpName } = await ctx.db.deity.findUniqueOrThrow({
                where: { id: input.hp },
            });

            const { textStream } = await streamText({
                model: google("models/gemini-1.5-flash-latest"),
                system: `You are ${hpName}.`,
                prompt: input.question,
            });

            for await (const delta of textStream) {
                yield { output: delta };
            }
        }),
});
