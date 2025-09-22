const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const RealMultiInstanceManager = require('./real-multi-instance');

console.log('🚀 Enhanced Roblox Multi-Instance Manager - Standalone Edition');
console.log('=============================================================');
console.log('Based on comprehensive research of 19+ multi-instance projects');
console.log('✨ Enhanced Features:');
console.log('   📊 Real-time FPS monitoring and unlocking');
console.log('   💾 Intelligent RAM management and optimization');  
console.log('   🎯 Performance statistics and resource tracking');
console.log('   🔧 Advanced process lifecycle management');
console.log('Key techniques: MultiBloxy, UWP cloning, Registry mods, FPS unlocking');
console.log('');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the real multi-instance manager
const manager = new RealMultiInstanceManager();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    platform: process.platform,
    multiInstanceReady: manager.robloxPath || manager.uwpPath ? true : false,
    robloxPath: manager.robloxPath,
    uwpPath: manager.uwpPath
  });
});

app.get('/api/roblox/real-processes', async (req, res) => {
  try {
    await manager.updateInstanceStatus();
    const instances = manager.getInstances();
    res.json(instances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/roblox/launch-real-instance', async (req, res) => {
  try {
    const options = req.body;
    const instance = await manager.launchInstance(options);
    res.json(instance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/roblox/real-instances/:instanceId/stop', async (req, res) => {
  try {
    const { instanceId } = req.params;
    const result = await manager.stopInstance(instanceId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/roblox/real-instances/:instanceId', (req, res) => {
  try {
    const { instanceId } = req.params;
    const instance = manager.getInstanceById(instanceId);
    
    if (!instance) {
      return res.status(404).json({ error: 'Instance not found' });
    }
    
    res.json(instance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enhanced API endpoints for FPS and performance monitoring
app.get('/api/performance/stats', (req, res) => {
  try {
    const stats = manager.performanceMonitor ? manager.performanceMonitor.instances : new Map();
    const formattedStats = {};
    
    for (const [instanceId, performance] of stats) {
      formattedStats[instanceId] = performance;
    }
    
    res.json({
      instanceCount: manager.instances.size,
      totalSystemRAM: manager.getTotalSystemRAM ? manager.getTotalSystemRAM() : 0,
      usedSystemRAM: manager.getUsedRAM ? manager.getUsedRAM() : 0,
      fpsSettings: manager.fpsSettings,
      ramSettings: manager.ramSettings,
      instances: formattedStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/performance/instance/:instanceId', async (req, res) => {
  try {
    const { instanceId } = req.params;
    const performance = await manager.getInstancePerformance(instanceId);
    
    if (!performance) {
      return res.status(404).json({ error: 'Instance performance data not found' });
    }
    
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/performance/settings', (req, res) => {
  try {
    const { fpsSettings, ramSettings } = req.body;
    
    if (fpsSettings) {
      manager.fpsSettings = { ...manager.fpsSettings, ...fpsSettings };
      console.log('✅ FPS settings updated:', manager.fpsSettings);
    }
    
    if (ramSettings) {
      manager.ramSettings = { ...manager.ramSettings, ...ramSettings };
      console.log('✅ RAM settings updated:', manager.ramSettings);
    }
    
    res.json({
      success: true,
      fpsSettings: manager.fpsSettings,
      ramSettings: manager.ramSettings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/performance/optimize/:instanceId', async (req, res) => {
  try {
    const { instanceId } = req.params;
    
    if (manager.optimizeInstanceMemory) {
      await manager.optimizeInstanceMemory(instanceId);
      res.json({ success: true, message: `Instance ${instanceId} optimized` });
    } else {
      res.status(501).json({ error: 'Memory optimization not available' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/performance/optimize-all', async (req, res) => {
  try {
    if (manager.optimizeAllInstances) {
      await manager.optimizeAllInstances();
      res.json({ success: true, message: 'All instances optimized' });
    } else {
      res.status(501).json({ error: 'Memory optimization not available' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the main HTML file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`🎮 Multi-Instance Manager ready`);
  console.log('');
  console.log('🔍 Detected Roblox installations:');
  console.log(`   Standard: ${manager.robloxPath || 'Not found'}`);
  console.log(`   UWP:      ${manager.uwpPath || 'Not found'}`);
  console.log('');
  console.log('✨ Ready to launch multiple Roblox instances!');
  console.log('   Access the dashboard at the URL above');
  
  // Auto-open browser
  setTimeout(() => {
    const os = require('os');
    const platform = os.platform();
    let command;
    
    if (platform === 'win32') {
      command = 'start';
    } else if (platform === 'darwin') {
      command = 'open';
    } else {
      command = 'xdg-open';
    }
    
    try {
      spawn(command, [`http://localhost:${PORT}`], { shell: true, detached: true });
    } catch (error) {
      console.log('Could not auto-open browser. Please open manually.');
    }
  }, 1000);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  
  try {
    await manager.cleanup();
    server.close(() => {
      console.log('✅ Server stopped gracefully');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  await manager.cleanup();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});