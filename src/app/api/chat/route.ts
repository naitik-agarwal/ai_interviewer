import { streamText, convertToModelMessages, tool, isStepCount } from "ai";
import { getRandomGoogleProvider } from "@/lib/gemini";
import { z } from "zod";


export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages;
  
  // Provide a safe fallback if the AI SDK drops the custom payload
  const problem = body.problem || {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume exactly one solution, and you may not use the same element twice."
  };

  const language = body.language || "cpp";

  // Extract the latest code state from the last user message
  let latestCode = "";
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
        const content = typeof messages[i].content === 'string' 
            ? messages[i].content 
            : messages[i].parts?.map((p: any) => p.text).join("");
        if (content && content.includes("###CODE_STATE_DO_NOT_SHOW_IN_UI###")) {
            latestCode = content.split("###CODE_STATE_DO_NOT_SHOW_IN_UI###\n")[1].split("\n\n###TIME_LEFT_MINUTES###")[0].trim();
            break;
        }
    }
  }

const SYSTEM_PROMPT = `You are Alex, a strict, highly critical Senior Software Engineer at a top-tier tech company conducting a 45-minute technical screen for an SDE role. 

CRITICAL BEHAVIOR RULES:
1. PROFESSIONAL REALISM: Start the interview like a real human. Briefly introduce yourself.
2. CONCISENESS: Never repeat yourself. Never duplicate sentences. Keep your responses extremely brief, single-spaced, and blunt.
3. BE DIRECT: Speak in short, professional sentences. Get straight to the point. Do not compliment excessively.
4. NEVER GIVE THE ANSWER: If they are stuck, give a vague hint and dock their score.
5. RUTHLESS CODE REVIEW: When the candidate writes code, act like a strict ${language} compiler and code reviewer.
6. TIME AWARENESS: The candidate's messages contain a hidden \`###TIME_LEFT_MINUTES###\` block. Only mention time if there is less than 10 minutes remaining. If there is >10 mins, do NOT mention time.
7. AUTOMATED TESTING: If the candidate says they are done, or asks to run tests, use the \`evaluate_test_cases\` tool to evaluate their code logic against the problem's hidden test cases and show the results in the UI.

Today's problem is: "${problem.title}"
Description: "${problem.description}"
Test Cases: ${JSON.stringify(problem.testCases || [])}

Wait for the candidate to say they are ready before revealing the problem.`;

  const customGoogle = getRandomGoogleProvider();

  const result = streamText({
    model: customGoogle("gemini-3.6-flash"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: isStepCount(5),
    tools: {
      evaluate_test_cases: tool({
        description: "Evaluates the candidate's code against the provided test cases. Call this to show the test results in the UI.",
        parameters: z.object({
          results: z.array(z.object({
            input: z.string(),
            expected: z.string(),
            actual: z.string(),
            passed: z.boolean()
          }))
        }),
        // @ts-ignore: ai sdk v7 type resolution issue
        execute: async (args: any) => {
          return args; // Automatically sent to the frontend for rendering
        }
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}