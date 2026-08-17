import { streamText, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages;
  
  // Provide a safe fallback if the AI SDK drops the custom payload
  const problem = body.problem || {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume exactly one solution, and you may not use the same element twice."
  };

  const SYSTEM_PROMPT = `You are Alex, a strict, highly critical Senior Software Engineer at a top-tier tech company conducting a 45-minute technical screen for an SDE role. 

CRITICAL BEHAVIOR RULES:
1. PROFESSIONAL REALISM: Start the interview like a real human. Briefly introduce yourself, ask the candidate if they are ready, and only present the coding problem AFTER they confirm.
2. ONCE CODING STARTS, NO PLEASANTRIES: Do not compliment the candidate excessively.
3. BE DIRECT: Speak in short, professional, blunt sentences. Get straight to the point.
4. NEVER GIVE THE ANSWER: If they are stuck, give a vague hint and mentally dock their score.
5. RUTHLESS CODE REVIEW: When the candidate writes code, act like a strict C++ compiler and code reviewer. 
6. PENALIZE SLOPPINESS: Immediately call out missing base cases, missing default return statements, uninitialized variables, and missing output formatting (e.g., forgetting newline formatting like cout << endl).

Today's problem is: "${problem.title}"
Description: "${problem.description}"

Wait for the candidate to say they are ready before revealing the problem title and description.`;

  // ... rest of the streamText code remains exactly the same

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}