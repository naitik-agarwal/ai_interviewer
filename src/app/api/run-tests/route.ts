import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { problems } from "@/lib/problems";

export const maxDuration = 30;

const EVALUATOR_PROMPT = `You are a strict C++ compiler and test case evaluator.
Given the candidate's C++ code and a list of test cases, you must mentally execute the code against each test case.
For each test case, determine the expected output and the actual output that the code would produce.
If the actual output exactly matches the expected output, mark passed as true.
Do not provide any conversational text. Return only the JSON array of results.`;

export async function POST(req: Request) {
  try {
    const { code, problemId } = await req.json();

    if (!code) {
      return Response.json({ error: "Code is required" }, { status: 400 });
    }

    const problem = problems.find(p => p.id === problemId);
    if (!problem || !problem.testCases) {
      return Response.json({ error: "Problem or test cases not found" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      system: EVALUATOR_PROMPT,
      prompt: `Problem Description: ${problem.description}\n\nCandidate Code:\n${code}\n\nTest Cases to Evaluate:\n${JSON.stringify(problem.testCases, null, 2)}`,
      schema: z.object({
        results: z.array(z.object({
          input: z.string(),
          expected: z.string(),
          actual: z.string(),
          passed: z.boolean()
        }))
      })
    });

    return Response.json({ testResults: object.results });
  } catch (error: any) {
    return Response.json({ error: error.message || "Failed to run tests" }, { status: 500 });
  }
}

