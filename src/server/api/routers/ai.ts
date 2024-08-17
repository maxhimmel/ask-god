import { google } from "@ai-sdk/google";
import { generateText, streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
            // const stream = createStreamableValue("");

            // (async () => {
            //     const { textStream } = await streamText({
            //         model: google("models/gemini-1.5-flash-latest"),
            //         system: `You are ${input.hp}.`,
            //         prompt: input.question,
            //     });

            //     for await (const delta of textStream) {
            //         console.log({ delta });
            //         stream.update(delta);
            //     }

            //     stream.done();
            // })();

            // yield { output: stream.value };
        }),
});