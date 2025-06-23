const CrawlerAgent = require('./agents/CrawlerAgent');
const SummarizerAgent = require('./agents/SummarizerAgent');
const SentimentAgent = require('./agents/SentimentAgent');
const PresenterAgent = require('./agents/PresenterAgent');

class NewsAggregator {
  constructor() {
    this.crawlerAgent = new CrawlerAgent();
    this.summarizerAgent = new SummarizerAgent();
    this.sentimentAgent = new SentimentAgent();
    this.presenterAgent = new PresenterAgent();
    
    this.cache = new Map();
    this.processingQueue = new Map();
  }

  async processKeyword(keyword, options = {}) {
    const requestId = this.generateRequestId();
    const cacheKey = `${keyword.toLowerCase()}_${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 30 * 60 * 1000) { // 30 minutes cache
        return cached.data;
      }
    }

    // Check if already processing
    if (this.processingQueue.has(cacheKey)) {
      return this.processingQueue.get(cacheKey);
    }

    const processingPromise = this.executeProcessingPipeline(keyword, options, requestId);
    this.processingQueue.set(cacheKey, processingPromise);

    try {
      const result = await processingPromise;
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      return result;
    } finally {
      this.processingQueue.delete(cacheKey);
    }
  }

  async executeProcessingPipeline(keyword, options, requestId) {
    console.log(`🔄 Starting processing pipeline for keyword: "${keyword}"`);
    
    try {
      // Step 1: Crawler Agent - Fetch news articles
      console.log(`📰 Crawler Agent: Fetching news for "${keyword}"`);
      const articles = await this.crawlerAgent.fetchNews(keyword, options);
      
      if (!articles || articles.length === 0) {
        throw new Error('No articles found for the given keyword');
      }

      console.log(`✅ Crawler Agent: Found ${articles.length} articles`);

      // Step 2: Summarizer Agent - Summarize each article
      console.log(`📝 Summarizer Agent: Processing ${articles.length} articles`);
      const summarizedArticles = await this.summarizerAgent.summarizeArticles(articles, requestId);

      // Step 3: Sentiment Agent - Analyze sentiment
      console.log(`😊 Sentiment Agent: Analyzing sentiment for ${summarizedArticles.length} articles`);
      const articlesWithSentiment = await this.sentimentAgent.analyzeSentiment(summarizedArticles, requestId);

      // Step 4: Presenter Agent - Format and present results
      console.log(`🎨 Presenter Agent: Formatting results`);
      const presentation = await this.presenterAgent.formatResults(articlesWithSentiment, keyword, requestId);

      console.log(`✅ Processing pipeline completed for "${keyword}"`);
      
      return {
        keyword,
        requestId,
        timestamp: new Date().toISOString(),
        summary: presentation.summary,
        articles: presentation.articles,
        statistics: presentation.statistics,
        sentiment: presentation.sentiment
      };

    } catch (error) {
      console.error(`❌ Error in processing pipeline for "${keyword}":`, error);
      throw error;
    }
  }

  async getProcessingStatus(requestId) {
    // This could be enhanced with Redis for distributed systems
    return {
      requestId,
      status: 'completed', // Simplified for now
      timestamp: new Date().toISOString()
    };
  }

  async clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      queueSize: this.processingQueue.size,
      keys: Array.from(this.cache.keys())
    };
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Health check method
  async healthCheck() {
    const checks = {
      crawlerAgent: await this.crawlerAgent.healthCheck(),
      summarizerAgent: await this.summarizerAgent.healthCheck(),
      sentimentAgent: await this.sentimentAgent.healthCheck(),
      presenterAgent: await this.presenterAgent.healthCheck()
    };

    const allHealthy = Object.values(checks).every(check => check.status === 'healthy');
    
    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      agents: checks
    };
  }
}

module.exports = NewsAggregator; 