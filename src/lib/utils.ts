import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const { spawn } = require("child_process");

const ps = spawn("powershell.exe", ["-NoLogo", "-NoProfile", "-File", "path/to/script.ps1"]);

ps.stdout.on("data", (data) => {
  console.log(`Output: ${data}`);
});

ps.stderr.on("data", (data) => {
  console.error(`Error: ${data}`);
});

ps.on("exit", (code) => {
  console.log(`PowerShell script exited with code ${code}`);
});

const { exec } = require('child_process');

exec('powershell.exe -Command "Get-Process | ConvertTo-Json"', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  try {
    const jsonOutput = JSON.parse(stdout);
    console.log(jsonOutput);
  } catch (parseError) {
    console.error(`JSON Parse Error: ${parseError.message}`);
  }
});


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
