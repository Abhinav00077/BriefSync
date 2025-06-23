const { ChatOllama } = require('@langchain/community/chat_models/ollama');

class SummarizerAgent {
  constructor() {
    this.llm = null;
    this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'mistral';
    this.initializeLLM();
    console.log('📝 Summarizer Agent: Initialized with Ollama or extractive summarization fallback');
  }

  initializeLLM() {
    try {
      if (this.ollamaBaseUrl) {
        this.llm = new ChatOllama({
          baseUrl: this.ollamaBaseUrl,
          model: this.ollamaModel,
          temperature: 0.3
        });
        console.log(`📝 Summarizer Agent: Using Ollama (${this.ollamaModel}) for summarization`);
      } else {
        this.llm = null;
        console.warn('⚠️ Summarizer Agent: No LLM configured, using extractive summarization');
      }
    } catch (error) {
      console.error('❌ Summarizer Agent: Failed to initialize LLM:', error);
      this.llm = null;
    }
  }

  async summarizeArticles(articles, requestId) {
    console.log(`📝 Summarizer Agent: Starting summarization of ${articles.length} articles`);
    const summarizedArticles = [];
    for (const article of articles) {
      try {
        const summary = await this.summarizeSingleArticle(article, requestId);
        summarizedArticles.push({
          ...article,
          summary,
          summarizedAt: new Date().toISOString(),
          requestId
        });
      } catch (error) {
        console.warn(`⚠️ Failed to summarize article "${article.title}":`, error.message);
        summarizedArticles.push({
          ...article,
          summary: this.generateFallbackSummary(article),
          summarizedAt: new Date().toISOString(),
          requestId,
          summaryError: error.message
        });
      }
    }
    return summarizedArticles;
  }

  async summarizeSingleArticle(article, requestId) {
    if (this.llm) {
      try {
        const prompt = `Summarize the following news article in 2-4 sentences.\n\nTitle: ${article.title}\nContent: ${article.content || article.description || ''}`;
        const result = await this.llm.invoke(prompt);
        return result.content.trim();
      } catch (e) {
        console.warn('Ollama summarization failed, falling back to extractive:', e.message);
        return this.extractiveSummarization(article.title, article.content || article.description || '');
      }
    } else {
      return this.extractiveSummarization(article.title, article.content || article.description || '');
    }
  }

  extractiveSummarization(title, content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length === 0) {
      return `Article about ${title}. No detailed content available.`;
    }
    const summarySentences = sentences.slice(0, Math.min(3, sentences.length));
    let summary = summarySentences.join('. ').trim();
    if (!summary.endsWith('.')) {
      summary += '.';
    }
    return summary;
  }

  generateFallbackSummary(article) {
    const title = article.title || 'Unknown title';
    const source = article.source || 'Unknown source';
    const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Unknown date';
    return `Article from ${source} published on ${date} about ${title}. This article discusses developments and news related to the topic.`;
  }

  async createComprehensiveSummary(articles, keyword, requestId) {
    // You can implement a similar LLM-based summary for batch if needed
    const sources = [...new Set(articles.map(a => a.source))];
    const timePeriod = this.calculateTimePeriod(articles);
    const summary = `Analysis of ${articles.length} articles about "${keyword}" from ${sources.length} sources over ${timePeriod}. ` +
                   `The coverage spans various perspectives and developments, providing a comprehensive view of current discussions and trends. ` +
                   `Key themes include ${this.extractKeyThemes(articles).slice(0, 3).join(', ')}.`;
    return {
      comprehensiveSummary: summary,
      keyword,
      requestId,
      timestamp: new Date().toISOString()
    };
  }

  calculateTimePeriod(articles) {
    if (articles.length === 0) return 'Unknown period';
    const dates = articles.map(a => new Date(a.publishedAt)).sort();
    const earliest = dates[0];
    const latest = dates[dates.length - 1];
    const diffTime = Math.abs(latest - earliest);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Same day';
    if (diffDays === 1) return '1 day';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    return `${Math.ceil(diffDays / 30)} months`;
  }

  extractKeyThemes(articles) {
    const themes = new Set();
    articles.forEach(article => {
      const text = `${article.title} ${article.content || article.description || ''}`.toLowerCase();
      const themeKeywords = ['technology', 'politics', 'business', 'health', 'science', 'environment', 'economy', 'society'];
      themeKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          themes.add(keyword);
        }
      });
    });
    return Array.from(themes);
  }

  async healthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      method: this.llm ? 'ollama' : 'extractive_summarization'
    };
  }
}

module.exports = SummarizerAgent; 