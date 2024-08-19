import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const aiRouter = createTRPCRouter({
    getAnswer: publicProcedure
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

    streamChat: publicProcedure
        .input(z.object({ hp: z.string(), question: z.string() }))
        .mutation(async function* ({ input }) {
            const { textStream } = await streamText({
                model: google("models/gemini-1.5-flash-latest"),
                system: `You are ${input.hp}.`,
                prompt: input.question,
            });

            for await (const delta of textStream) {
                yield { output: delta };
            }
        }),
});
