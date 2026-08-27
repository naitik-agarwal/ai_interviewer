import { createGoogleGenerativeAI } from '@ai-sdk/google';

export function getRandomGoogleProvider() {
  // Explicitly check for up to 10 keys to avoid Next.js / Vercel process.env bundling quirks
  const potentialKeys = [
    process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
  ];

  const validKeys = potentialKeys.filter(Boolean) as string[];
    
  if (validKeys.length === 0) {
    throw new Error("No Gemini API keys found in environment variables. Please add GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY_1, etc.");
  }
  
  // Randomly select one key
  const randomKey = validKeys[Math.floor(Math.random() * validKeys.length)];
  
  // Return a configured Google provider using the selected key
  return createGoogleGenerativeAI({ apiKey: randomKey });
}

