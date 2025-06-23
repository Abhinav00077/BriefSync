# BriefSync - Smart News Aggregator & Summarizer

AI-powered smart news aggregator and summarizer using LangChain, MCP server architecture, and Ollama to deliver real-time topic-based digests from multiple sources.

## 🚀 Features

- **Crawler Agent** – Fetches news via multiple APIs (NewsAPI, Guardian, NYT)
- **Summarizer Agent** – AI-powered article summarization using LangChain & Ollama
- **Sentiment Agent** – Advanced sentiment analysis with NLP and AI
- **Presenter Agent** – Beautiful UI rendering with statistics and insights
- **Real-time Processing** – Socket.IO for live updates
- **Modern UI** – React with Tailwind CSS and Framer Motion
- **MCP Architecture** – Scalable server architecture with agent-based processing

## 🏗️ Architecture

```
BriefSync/
├── server/                 # Backend MCP Server
│   ├── services/
│   │   ├── agents/         # Four MCP Agents
│   │   │   ├── CrawlerAgent.js
│   │   │   ├── SummarizerAgent.js
│   │   │   ├── SentimentAgent.js
│   │   │   └── PresenterAgent.js
│   │   └── NewsAggregator.js
│   ├── routes/             # API Routes
│   ├── socket/             # Socket.IO Handlers
│   └── index.js            # Main Server
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Page Components
│   │   └── services/       # API Services
│   └── public/
└── package.json
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Ollama (optional, for local LLM)
- News API key (optional, for real news data)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd BriefSync

# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration

Copy the environment template and configure your API keys:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
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
```

### 3. Setup Ollama (Optional)

If you want to use local LLM processing:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama2

# Start Ollama service
ollama serve
```

### 4. Start the Application

#### Development Mode (Recommended)

```bash
# Start both server and client
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend client on http://localhost:3000

#### Production Mode

```bash
# Build the client
npm run build

# Start production server
npm start
```

## 🎯 Usage

### 1. Search for News

1. Navigate to the homepage
2. Enter a keyword (e.g., "AI", "Climate Change", "Technology")
3. Click "Search News" or press Enter
4. Wait for the AI agents to process the request

### 2. View Results

The system will display:
- **Comprehensive Summary** - AI-generated overview of all articles
- **Article List** - Individual articles with summaries and sentiment
- **Statistics** - Source distribution, sentiment trends, and insights
- **Sentiment Analysis** - Emotional tone analysis for each article

### 3. Real-time Updates

The application uses Socket.IO for real-time communication:
- Live processing status updates
- Real-time search results
- System health monitoring

## 🔧 API Endpoints

### News Search
- `POST /api/news/search` - Search for news by keyword
- `GET /api/news/status/:requestId` - Get processing status
- `GET /api/news/cache/stats` - Get cache statistics
- `DELETE /api/news/cache` - Clear cache

### Health & System
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system health
- `GET /api/health/system` - System information

### Socket.IO Events
- `search` - Initiate news search
- `search_completed` - Search results ready
- `search_error` - Search error occurred
- `health_check` - System health status

## 🤖 MCP Agents

### 1. Crawler Agent
- Fetches news from multiple sources
- Supports NewsAPI, Guardian, and NYT
- Handles rate limiting and error recovery
- Removes duplicates and sorts by date

### 2. Summarizer Agent
- Uses LangChain with OpenAI or Ollama
- Processes articles in batches
- Generates comprehensive summaries
- Handles content truncation and formatting

### 3. Sentiment Agent
- Combines AI and NLP analysis
- Uses AFINN lexicon and custom keywords
- Provides confidence scores and indicators
- Supports fallback analysis

### 4. Presenter Agent
- Formats results for UI consumption
- Calculates statistics and trends
- Generates insights and recommendations
- Handles data visualization preparation

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Mode** - Automatic theme detection
- **Smooth Animations** - Framer Motion for delightful interactions
- **Real-time Updates** - Live status and progress indicators
- **Interactive Charts** - Recharts for data visualization
- **Toast Notifications** - User feedback and error handling

## 🔒 Security Features

- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Sanitizes user inputs
- **CORS Protection** - Secure cross-origin requests
- **Helmet.js** - Security headers
- **Environment Variables** - Secure configuration management

## 🚀 Deployment

### Docker Deployment

```bash
# Build the application
docker build -t briefsync .

# Run the container
docker run -p 3001:3001 -e NODE_ENV=production briefsync
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
NEWS_API_KEY=your_production_api_key
OPENAI_API_KEY=your_production_openai_key
RATE_LIMIT_MAX_REQUESTS=50
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) - LLM framework
- [Ollama](https://ollama.ai/) - Local LLM runner
- [NewsAPI](https://newsapi.org/) - News data provider
- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: contact@briefsync.com
- Documentation: [docs.briefsync.com](https://docs.briefsync.com)

---

**Built with ❤️ by the BriefSync Team**
