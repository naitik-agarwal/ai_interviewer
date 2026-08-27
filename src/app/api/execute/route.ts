import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, stdin = "", language = "cpp" } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Map UI language to Piston language
    const pistonLangMap: Record<string, string> = {
      cpp: "c++",
      python: "python",
      javascript: "javascript"
    };

    const pistonFileMap: Record<string, string> = {
      cpp: "main.cpp",
      python: "main.py",
      javascript: "main.js"
    };

    const pistonLang = pistonLangMap[language] || "c++";
    const pistonFile = pistonFileMap[language] || "main.cpp";

    // Call the public Piston API for secure, remote execution
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: pistonLang,
        version: "*",
        files: [
          {
            name: pistonFile,
            content: code,
          },
        ],
        stdin: stdin,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Execution service is currently unavailable." },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (data.compile && data.compile.code !== 0) {
      return NextResponse.json({
        compile: { output: data.compile.output },
      });
    }

    return NextResponse.json({
      run: {
        stdout: data.run.stdout,
        stderr: data.run.stderr,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
