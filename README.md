# 🤖 AI-Powered Technical Interviewer

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="C++" />
</div>

<br/>

A rigorous, full-stack mock interview platform designed to simulate high-stakes FAANG technical screens. Instead of grinding algorithmic problems in a vacuum, this platform stress-tests candidates in real-time, enforcing C++ best practices, communication skills, and time management, while providing brutally honest, structured evaluations.

---

## ✨ Features

- **🗣️ Interactive AI Interviewer**: Powered by Google Gemini. The AI acts as a strict senior engineer, probing you on edge cases, time/space complexity, and optimal data structures as you write code.
- **💻 Integrated Code Sandbox**: A Monaco-powered C++ editor seamlessly integrated into the UI.
- **⚡ Local Code Execution**: Compile and execute C++ code instantly via a custom backend sandbox using `child_process`.
- **🧪 AI Test Case Evaluator**: Click "Run Tests" to have the AI instantly trace your code against hidden test cases and output a LeetCode-style pass/fail UI.
- **📊 Structured Evaluation Dashboard**: At the end of the interview, the AI generates a structured JSON report. The UI renders your final decision (Strong Hire, Hire, No Hire), numerical scores for Problem Solving, Code Quality, and Communication, and bulleted lists of Key Strengths and Areas to Improve.
- **⏳ Time Pressure**: A strict 45-minute countdown timer enforces contest-level time management.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide React, Monaco Editor
- **Backend**: Next.js Route Handlers, Vercel AI SDK
- **Execution Engine**: Local C++ (`g++`) execution via Node.js `child_process`
- **AI Models**: Google `gemini-2.5-flash` for both streaming chat and structured data evaluation

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- `g++` compiler installed and available on your system path
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/naitik-agarwal/ai_interviewer.git
   cd ai_interviewer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:** Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

| Path | Description |
|------|-------------|
| `app/page.tsx` | Main dashboard UI containing the chat, editor, and console components |
| `app/api/chat/route.ts` | Streaming backend for the AI interviewer conversations |
| `app/api/execute/route.ts` | Backend sandbox for raw C++ compilation and standard execution |
| `app/api/run-tests/route.ts` | Evaluates candidate code against hidden problem test cases using AI |
| `app/api/evaluate/route.ts` | Generates the final structured evaluation report |
| `lib/problems.ts` | Local database of technical problems and their hidden test cases |

## 🔮 Future Roadmap (Phase 2)
- [ ] Transition from local `child_process` execution to a scalable, sandboxed remote execution environment (e.g., Docker/Piston).
- [ ] Add support for multiple programming languages (Python, Java, Go).
- [ ] Implement audio transcription (speech-to-text) for a true voice-based interview experience.

---
<div align="center">
  Built with ❤️ by Naitik Agarwal
</div>
