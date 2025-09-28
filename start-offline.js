const { spawn } = require('child_process');
const path = require('path');

// Set environment variables to bypass network checks
process.env.EXPO_OFFLINE = 'true';
process.env.EXPO_NO_DOTENV = 'true';
process.env.EXPO_NO_TELEMETRY = 'true';

console.log('🚀 Starting Expo in offline mode...');
console.log('📱 This bypasses network connectivity issues');

const expo = spawn('npx', ['expo', 'start', '--web', '--port', '8086', '--offline'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

expo.on('error', (error) => {
  console.error('❌ Error starting Expo:', error);
});

expo.on('close', (code) => {
  console.log(`Expo process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping Expo...');
  expo.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping Expo...');
  expo.kill('SIGTERM');
  process.exit(0);
});

