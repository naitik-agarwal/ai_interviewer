import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, stdin = "" } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Call the public Piston API for secure, remote execution
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: "c++",
        version: "*",
        files: [
          {
            name: "main.cpp",
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
