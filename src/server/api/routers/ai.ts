import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const aiRouter = createTRPCRouter({
    ask: publicProcedure
        .input(z.object({ hp: z.string(), question: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { text } = await generateText({
                model: google("models/gemini-1.5-flash-latest"),
                prompt: input.question,
                system: `You are ${input.hp}.`
            });

            return {
                answer: text,
            };
        }),
    getAnswer: publicProcedure
        .input(z.object({ hp: z.string(), question: z.string() }))
        .query(async ({ input }) => {
            const { text } = await generateText({
                model: google("models/gemini-1.5-flash-latest"),
                prompt: input.question,
                system: `You are ${input.hp}.`
            });

            return {
                answer: text,
            };
        }),
});