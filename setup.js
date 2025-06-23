#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 BriefSync Setup Script');
console.log('========================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Install server dependencies
console.log('\n📦 Installing server dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Server dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install server dependencies');
  process.exit(1);
}

// Install client dependencies
console.log('\n📦 Installing client dependencies...');
try {
  execSync('npm install', { cwd: 'client', stdio: 'inherit' });
  console.log('✅ Client dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install client dependencies');
  process.exit(1);
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('\n📝 Creating .env file from template...');
  try {
    if (fs.existsSync('env.example')) {
      fs.copyFileSync('env.example', '.env');
      console.log('✅ .env file created from template');
      console.log('⚠️  Please edit .env file with your API keys');
    } else {
      console.log('⚠️  env.example not found, creating basic .env file...');
      const basicEnv = `# Server Configuration
PORT=3001
NODE_ENV=development

# News API Configuration (Optional)
NEWS_API_KEY=your_news_api_key_here
NEWS_API_BASE_URL=https://newsapi.org/v2

# AI/LLM Configuration
# Choose one of the following:
OPENAI_API_KEY=your_openai_api_key_here
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# Sentiment Analysis
SENTIMENT_ANALYSIS_PROVIDER=openai

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
      fs.writeFileSync('.env', basicEnv);
      console.log('✅ Basic .env file created');
    }
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
  }
} else {
  console.log('✅ .env file already exists');
}

// Create client build directory if it doesn't exist
const clientBuildDir = path.join('client', 'build');
if (!fs.existsSync(clientBuildDir)) {
  console.log('\n📁 Creating client build directory...');
  try {
    fs.mkdirSync(clientBuildDir, { recursive: true });
    console.log('✅ Client build directory created');
  } catch (error) {
    console.error('❌ Failed to create client build directory:', error.message);
  }
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Edit .env file with your API keys');
console.log('2. Run "npm run dev" to start the development server');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\n📚 For more information, see README.md');

// Optional: Check if Ollama is installed
console.log('\n🔍 Checking for Ollama installation...');
try {
  execSync('ollama --version', { stdio: 'ignore' });
  console.log('✅ Ollama is installed');
  console.log('💡 You can use local LLM processing with Ollama');
} catch (error) {
  console.log('⚠️  Ollama not found');
  console.log('💡 Install Ollama for local LLM processing: https://ollama.ai');
}

console.log('\n�� Happy coding!'); 