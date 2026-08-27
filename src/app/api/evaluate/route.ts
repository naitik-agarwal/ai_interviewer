import { generateObject } from "ai";
import { getRandomGoogleProvider } from "@/lib/gemini";
import { z } from "zod";

export const maxDuration = 60;

const EVALUATOR_PROMPT = `You are a strict FAANG Hiring Committee reviewing a candidate's complete technical interview transcript.
Analyze the entire conversation between the Interviewer and the Candidate, including the submitted code states.

Be brutally honest and actionable. Keep your summary and bullet points extremely concise. Do not write lengthy paragraphs.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Flatten the messages array into a single readable string
    const transcriptText = messages
      .map((msg: any) => {
        let textContent = msg.content || "";
        if (!textContent && msg.parts) {
          textContent = msg.parts.map((p: any) => p.text).join("");
        }
        return `${msg.role.toUpperCase()}: ${textContent}`;
      })
      .join("\n\n-------------------\n\n");

    const customGoogle = getRandomGoogleProvider();

    const { object } = await generateObject({
      model: customGoogle("gemini-3.6-flash"),
      system: EVALUATOR_PROMPT,
      prompt: `Here is the full interview transcript and code history to evaluate:\n\n${transcriptText}`,
      schema: z.object({
        decision: z.enum(["Strong Hire", "Hire", "Leaning Hire", "Leaning No Hire", "No Hire"]),
        scores: z.object({
          problemSolving: z.number().min(1).max(5),
          codeQuality: z.number().min(1).max(5),
          communication: z.number().min(1).max(5),
        }),
        feedback: z.object({
          strengths: z.array(z.string()),
          improvements: z.array(z.string()),
        }),
        summary: z.string()
      })
    });

    return Response.json({ report: object });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to evaluate" }, { status: 500 });
  }
}