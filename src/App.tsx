import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import Accounts from "@/pages/accounts";
import Instances from "@/pages/instances";
import UWPInstances from "@/pages/uwp-instances";
import RobloxProcesses from "@/pages/roblox-processes";
import SyncManager from "@/pages/sync-manager";
import EnhancedSystem from "@/pages/enhanced-system";
import ProvenMultiInstance from "@/pages/proven-multi-instance";
import RealLauncher from "@/pages/real-launcher";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

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



function Router() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/accounts" component={Accounts} />
          <Route path="/instances" component={Instances} />
          <Route path="/uwp-instances" component={UWPInstances} />
          <Route path="/roblox-processes" component={RobloxProcesses} />
          <Route path="/sync-manager" component={SyncManager} />
          <Route path="/enhanced-system" component={EnhancedSystem} />
          <Route path="/proven-multi-instance" component={ProvenMultiInstance} />
          <Route path="/real-launcher" component={RealLauncher} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
