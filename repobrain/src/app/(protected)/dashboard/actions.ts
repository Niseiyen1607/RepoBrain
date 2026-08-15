"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = (await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
      AND "projectId" = ${projectId}
    ORDER BY similarity DESC
    LIMIT 10
  `) as {
    fileName: string;
    sourceCode: string;
    summary: string;
    similarity: number;
  }[];

  let context = "";

  for (const doc of result) {
    context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-3-flash-preview"),
      prompt: `You are an AI code assistant who answers questions about the codebase. Your target audience is a technical junior software engineer.
The user is asking a question about the codebase.

AI assistant is a brand new, powerful, human-like artificial intelligence.
The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
AI is always friendly, kind, and inspiring, and he is eager to provide his vivid and thoughtful responses to the user.

AI assistant has the big picture of the codebase.
AI assistant will consider the CONTEXT BLOCK provided below.
If the context does not contain the answer to the question, AI assistant will say "I'm sorry, but I don't know the answer to that question based on the provided codebase.".
AI assistant will not apologize for previous responses, but will admit new information was gained.
AI assistant will not invent answers that are not directly supported by the context.

START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

START QUESTION
${question}
END OF QUESTION`,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return {
    output: stream.value,
    filesReferences: result,
  };
}
