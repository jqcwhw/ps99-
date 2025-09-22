import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const { exec } = require('child_process');

exec('powershell.exe -Command "Get-Process"', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Output: ${stdout}`);
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


createRoot(document.getElementById("root")!).render(<App />);
