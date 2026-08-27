# AI-Powered Technical Interviewer

A rigorous, full-stack mock interview platform designed to simulate high-stakes FAANG technical screens. Instead of grinding algorithmic problems in a vacuum, this platform stress-tests candidates in real-time, enforcing C++ best practices, communication skills, and time management, while providing brutally honest, structured evaluations.

## Features

- **Interactive AI Interviewer**: Powered by Google Gemini (via Vercel AI SDK). The AI acts as a strict senior engineer, probing you on edge cases, time/space complexity, and optimal data structures as you write code.
- **Integrated Code Sandbox**: A Monaco-powered C++ editor seamlessly integrated into the UI.
- **Local Code Execution**: Compile and execute C++ code instantly via a custom backend sandbox using `child_process`.
- **AI Test Case Evaluator**: Click "Run Tests" to have the AI instantly trace your code against hidden test cases and output a LeetCode-style pass/fail UI.
- **Structured Evaluation Dashboard**: At the end of the interview, the AI generates a structured JSON report. The UI renders your final decision (Strong Hire, Hire, No Hire), numerical scores for Problem Solving, Code Quality, and Communication, and bulleted lists of Key Strengths and Areas to Improve.
- **Time Pressure**: A strict 45-minute countdown timer enforces contest-level time management.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide React (Icons), Monaco Editor.
- **Backend**: Next.js Route Handlers, Vercel AI SDK (`ai` and `@ai-sdk/google`).
- **Execution Engine**: Local C++ (`g++`) execution via Node.js `child_process`.
- **AI Models**: Google `gemini-2.5-flash` for both streaming chat and structured data evaluation (`generateObject`).

## Getting Started

### Prerequisites
- Node.js (v18+)
- `g++` compiler installed and available on your system path (for code execution).
- A Gemini API Key from Google AI Studio.

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ai_interviewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/page.tsx`: Main dashboard UI containing the chat, editor, and console components.
- `app/api/chat/route.ts`: Streaming backend for the AI interviewer conversations.
- `app/api/execute/route.ts`: Backend sandbox for raw C++ compilation and standard execution.
- `app/api/run-tests/route.ts`: Evaluates candidate code against hidden problem test cases using AI.
- `app/api/evaluate/route.ts`: Generates the final structured evaluation report.
- `lib/problems.ts`: Local database of technical problems and their hidden test cases.

## Future Roadmap (Phase 2)
- Transition from local `child_process` execution to a scalable, sandboxed execution environment (e.g., Docker/Piston).
- Add support for multiple programming languages (Python, Java, Go).
- Implement audio transcription (speech-to-text) for a true voice-based interview experience.
