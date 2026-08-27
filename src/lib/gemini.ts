import { createGoogleGenerativeAI } from '@ai-sdk/google';

export function getRandomGoogleProvider() {
  // Find all environment variables that look like GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.
  // Also include the default GOOGLE_GENERATIVE_AI_API_KEY as a fallback.
  const keys = Object.keys(process.env)
    .filter(key => key.startsWith('GEMINI_API_KEY_') || key === 'GOOGLE_GENERATIVE_AI_API_KEY')
    .map(key => process.env[key])
    .filter(Boolean) as string[];
    
  if (keys.length === 0) {
    throw new Error("No Gemini API keys found in environment variables. Please add GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY_1, etc.");
  }
  
  // Randomly select one key
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  
  // Return a configured Google provider using the selected key
  return createGoogleGenerativeAI({ apiKey: randomKey });
}
