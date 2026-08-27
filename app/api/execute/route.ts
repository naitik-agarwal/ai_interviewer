import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";
import util from "util";

const execAsync = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const { code, stdin = "" } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Local execution fallback to replace whitelist-only Piston API
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "code-exec-"));
    const sourceFile = path.join(tmpDir, "main.cpp");
    const exeFile = path.join(tmpDir, "main.out");

    await fs.writeFile(sourceFile, code);

    // Compile
    try {
      await execAsync(`g++ ${sourceFile} -o ${exeFile}`);
    } catch (compileError: any) {
      await fs.rm(tmpDir, { recursive: true, force: true });
      return NextResponse.json({
        compile: { output: compileError.stderr || compileError.message },
      });
    }

    // Run
    let stdout = "";
    let stderr = "";
    try {
      if (stdin) {
        const inFile = path.join(tmpDir, "input.txt");
        await fs.writeFile(inFile, stdin);
        const { stdout: runOut, stderr: runErr } = await execAsync(`${exeFile} < ${inFile}`, { timeout: 3000 });
        stdout = runOut;
        stderr = runErr;
      } else {
        const { stdout: runOut, stderr: runErr } = await execAsync(`${exeFile}`, { timeout: 3000 });
        stdout = runOut;
        stderr = runErr;
      }
    } catch (runError: any) {
      stderr = runError.stderr || runError.message;
    }

    // Cleanup
    await fs.rm(tmpDir, { recursive: true, force: true });

    return NextResponse.json({
      run: { stdout, stderr },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
