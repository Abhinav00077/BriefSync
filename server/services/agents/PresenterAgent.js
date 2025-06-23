const { ChatOllama } = require('@langchain/community/chat_models/ollama');
const { PromptTemplate } = require('@langchain/core/prompts');
const { LLMChain } = require('langchain/chains');

class PresenterAgent {
  constructor() {
    this.llm = null;
    this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'mistral';
    this.initializeLLM();
    this.summaryTemplate = PromptTemplate.fromTemplate(`
You are an expert news analyst and presenter. Create a comprehensive summary of the following news articles about "{keyword}".

Articles analyzed: {articleCount}
Time period: {timePeriod}

Please provide:
1. A compelling executive summary (2-3 sentences)
2. Key themes and patterns across the articles
3. Notable developments or trends
4. Potential implications or significance
5. A brief conclusion

Make it engaging and informative for a general audience.

Summary:
`);
  }

  initializeLLM() {
    try {
      if (this.ollamaBaseUrl) {
        this.llm = new ChatOllama({
          baseUrl: this.ollamaBaseUrl,
          model: this.ollamaModel,
          temperature: 0.3
        });
        console.log(`🎨 Presenter Agent: Using Ollama (${this.ollamaModel}) for presentation formatting`);
      } else {
        this.llm = null;
        console.warn('⚠️ Presenter Agent: No LLM configured, using template-based formatting');
      }
    } catch (error) {
      console.error('❌ Presenter Agent: Failed to initialize LLM:', error);
      this.llm = null;
    }
  }

  async formatResults(articles, keyword, requestId) {
    console.log(`🎨 Presenter Agent: Formatting results for "${keyword}" with ${articles.length} articles`);
    try {
      const summary = await this.generateComprehensiveSummary(articles, keyword, requestId);
      const statistics = this.calculateStatistics(articles);
      const sentiment = this.analyzeSentimentTrends(articles);
      const formattedArticles = this.formatArticles(articles);
      const insights = this.generateInsights(articles, statistics, sentiment);
      console.log(`✅ Presenter Agent: Successfully formatted results`);
      return {
        summary,
        articles: formattedArticles,
        statistics,
        sentiment,
        insights,
        metadata: {
          keyword,
          requestId,
          timestamp: new Date().toISOString(),
          articleCount: articles.length,
          processingTime: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Presenter Agent: Error formatting results:', error);
      throw new Error(`Presentation formatting failed: ${error.message}`);
    }
  }

  async generateComprehensiveSummary(articles, keyword, requestId) {
    if (!this.llm) {
      return this.generateTemplateSummary(articles, keyword);
    }
    try {
      const chain = new LLMChain({
        llm: this.llm,
        prompt: this.summaryTemplate
      });
      const timePeriod = this.calculateTimePeriod(articles);
      const result = await chain.call({
        keyword,
        articleCount: articles.length,
        timePeriod
      });
      return {
        text: result.text.trim(),
        generatedAt: new Date().toISOString(),
        method: 'ollama'
      };
    } catch (error) {
      console.warn('⚠️ Ollama summary generation failed, using template:', error.message);
      return this.generateTemplateSummary(articles, keyword);
    }
  }

  generateTemplateSummary(articles, keyword) {
    const sources = [...new Set(articles.map(a => a.source))];
    const timePeriod = this.calculateTimePeriod(articles);
    
    const summary = `Analysis of ${articles.length} articles about "${keyword}" from ${sources.length} sources over ${timePeriod}. ` +
                   `The coverage spans various perspectives and developments, providing a comprehensive view of current discussions and trends. ` +
                   `Key themes include ${this.extractKeyThemes(articles).slice(0, 3).join(', ')}.`;

    return {
      text: summary,
      generatedAt: new Date().toISOString(),
      method: 'template'
    };
  }

  calculateStatistics(articles) {
    const stats = {
      totalArticles: articles.length,
      sources: {},
      sentimentDistribution: {
        positive: 0,
        negative: 0,
        neutral: 0,
        mixed: 0
      },
      averageSentimentScore: 0,
      dateRange: {
        earliest: null,
        latest: null
      },
      topSources: [],
      topAuthors: []
    };

    let totalSentimentScore = 0;
    const authors = {};

    articles.forEach(article => {
      // Source statistics
      const source = article.source || 'Unknown';
      stats.sources[source] = (stats.sources[source] || 0) + 1;

      // Sentiment statistics
      if (article.sentiment) {
        const sentiment = article.sentiment.sentiment || 'neutral';
        stats.sentimentDistribution[sentiment]++;
        totalSentimentScore += article.sentiment.score || 50;
      }

      // Date range
      const pubDate = new Date(article.publishedAt);
      if (!stats.dateRange.earliest || pubDate < new Date(stats.dateRange.earliest)) {
        stats.dateRange.earliest = article.publishedAt;
      }
      if (!stats.dateRange.latest || pubDate > new Date(stats.dateRange.latest)) {
        stats.dateRange.latest = article.publishedAt;
      }

      // Author statistics
      if (article.author) {
        authors[article.author] = (authors[article.author] || 0) + 1;
      }
    });

    // Calculate averages and top lists
    stats.averageSentimentScore = Math.round(totalSentimentScore / articles.length);
    
    stats.topSources = Object.entries(stats.sources)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }));

    stats.topAuthors = Object.entries(authors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([author, count]) => ({ author, count }));

    return stats;
  }

  analyzeSentimentTrends(articles) {
    const sentimentTrends = {
      overall: {
        dominant: 'neutral',
        averageScore: 0,
        distribution: { positive: 0, negative: 0, neutral: 0, mixed: 0 }
      },
      bySource: {},
      byDate: {},
      trends: []
    };

    let totalScore = 0;
    const sourceSentiments = {};
    const dateSentiments = {};

    articles.forEach(article => {
      if (article.sentiment) {
        const score = article.sentiment.score || 50;
        const sentiment = article.sentiment.sentiment || 'neutral';
        totalScore += score;

        // By source
        const source = article.source || 'Unknown';
        if (!sourceSentiments[source]) {
          sourceSentiments[source] = { total: 0, count: 0, distribution: { positive: 0, negative: 0, neutral: 0, mixed: 0 } };
        }
        sourceSentiments[source].total += score;
        sourceSentiments[source].count++;
        sourceSentiments[source].distribution[sentiment]++;

        // By date
        const date = article.publishedAt.split('T')[0];
        if (!dateSentiments[date]) {
          dateSentiments[date] = { total: 0, count: 0 };
        }
        dateSentiments[date].total += score;
        dateSentiments[date].count++;

        sentimentTrends.overall.distribution[sentiment]++;
      }
    });

    // Calculate overall statistics
    sentimentTrends.overall.averageScore = Math.round(totalScore / articles.length);
    sentimentTrends.overall.dominant = this.getDominantSentiment(sentimentTrends.overall.distribution);

    // Calculate by source
    Object.entries(sourceSentiments).forEach(([source, data]) => {
      sentimentTrends.bySource[source] = {
        averageScore: Math.round(data.total / data.count),
        distribution: data.distribution,
        dominant: this.getDominantSentiment(data.distribution)
      };
    });

    // Calculate by date
    Object.entries(dateSentiments).forEach(([date, data]) => {
      sentimentTrends.byDate[date] = {
        averageScore: Math.round(data.total / data.count)
      };
    });

    // Generate trends
    sentimentTrends.trends = this.generateSentimentTrends(sentimentTrends.byDate);

    return sentimentTrends;
  }

  getDominantSentiment(distribution) {
    const entries = Object.entries(distribution);
    return entries.reduce((a, b) => distribution[a[0]] > distribution[b[0]] ? a : b)[0];
  }

  generateSentimentTrends(dateSentiments) {
    const sortedDates = Object.keys(dateSentiments).sort();
    const trends = [];

    if (sortedDates.length >= 2) {
      const firstScore = dateSentiments[sortedDates[0]].averageScore;
      const lastScore = dateSentiments[sortedDates[sortedDates.length - 1]].averageScore;
      
      if (lastScore > firstScore + 10) {
        trends.push('Sentiment has improved over time');
      } else if (lastScore < firstScore - 10) {
        trends.push('Sentiment has declined over time');
      } else {
        trends.push('Sentiment has remained relatively stable');
      }
    }

    return trends;
  }

  formatArticles(articles) {
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      summary: article.summary,
      url: article.url,
      source: article.source,
      author: article.author,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage,
      sentiment: article.sentiment,
      metadata: {
        sourceType: article.sourceType,
        wordCount: this.calculateWordCount(article),
        readingTime: this.calculateReadingTime(article),
        hasImage: !!article.urlToImage
      }
    }));
  }

  calculateWordCount(article) {
    const text = `${article.title} ${article.content || article.description || ''}`;
    return text.split(/\s+/).length;
  }

  calculateReadingTime(article) {
    const wordCount = this.calculateWordCount(article);
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  generateInsights(articles, statistics, sentiment) {
    const insights = [];

    // Sentiment insights
    if (sentiment.overall.averageScore > 70) {
      insights.push('Overall positive sentiment suggests optimistic coverage');
    } else if (sentiment.overall.averageScore < 30) {
      insights.push('Overall negative sentiment indicates concerning developments');
    }

    // Source diversity insights
    if (statistics.topSources.length > 3) {
      insights.push('Good source diversity provides balanced perspective');
    }

    // Volume insights
    if (articles.length > 15) {
      insights.push('High article volume indicates significant public interest');
    }

    // Sentiment variation insights
    const sentimentVariation = Object.values(sentiment.overall.distribution).filter(count => count > 0).length;
    if (sentimentVariation > 2) {
      insights.push('Mixed sentiment suggests complex or controversial topic');
    }

    return insights;
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
      
      // Simple theme extraction based on common news keywords
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
    const checks = {
      llm: false,
      formatting: true
    };

    try {
      if (this.llm) {
        const testChain = new LLMChain({
          llm: this.llm,
          prompt: PromptTemplate.fromTemplate('Format this: "Test article"')
        });
        await testChain.call({});
        checks.llm = true;
      }
    } catch (error) {
      console.warn('LLM health check failed:', error.message);
    }

    return {
      status: checks.formatting ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks
    };
  }
}

module.exports = PresenterAgent; 