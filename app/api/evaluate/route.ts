import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 60;

const EVALUATOR_PROMPT = `You are a strict FAANG Hiring Committee reviewing a candidate's complete technical interview transcript.
Analyze the entire conversation between the Interviewer and the Candidate, including the submitted C++ code states.

Generate a highly structured Markdown evaluation report. Be brutally honest and actionable.
DO NOT write a conversational introduction or conclusion. Output ONLY the Markdown report using this exact structure:

# Interview Evaluation Report

## Final Decision
[State clearly: Strong Hire, Hire, Leaning Hire, Leaning No Hire, or No Hire]

## 1. Problem Solving & Algorithm (Score: X/5)
[Evaluate their time/space complexity choices, optimization steps, and responsiveness to hints.]

## 2. Code Quality & Correctness (Score: X/5)
[Evaluate the code written. Highlight missing return statements, unhandled edge cases, or syntax flaws.]

## 3. Communication (Score: X/5)
[Evaluate how well they explained their thought process and handled engineering pushback.]

## Key Strengths
* [Point 1]
* [Point 2]

## Areas for Improvement (Actionable)
* [Specific concept or habit to practice]
* [Specific concept or habit to practice]
`;

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

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: EVALUATOR_PROMPT,
      prompt: `Here is the full interview transcript and code history to evaluate:\n\n${transcriptText}`,
    });

    return Response.json({ report: text });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to evaluate" }, { status: 500 });
  }
}