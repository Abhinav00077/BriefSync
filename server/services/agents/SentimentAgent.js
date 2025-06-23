const { ChatOllama } = require('@langchain/community/chat_models/ollama');
const natural = require('natural');

class SentimentAgent {
  constructor() {
    this.llm = null;
    this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.ollamaModel = process.env.OLLAMA_MODEL || 'mistral';
    this.initializeLLM();
    this.initializeNLP();
  }

  initializeLLM() {
    try {
      if (this.ollamaBaseUrl) {
        this.llm = new ChatOllama({
          baseUrl: this.ollamaBaseUrl,
          model: this.ollamaModel,
          temperature: 0.1
        });
        console.log(`😊 Sentiment Agent: Using Ollama (${this.ollamaModel}) for sentiment analysis`);
      } else {
        this.llm = null;
        console.warn('⚠️ Sentiment Agent: No LLM configured, using NLP-only analysis');
      }
    } catch (error) {
      console.error('❌ Sentiment Agent: Failed to initialize LLM:', error);
      this.llm = null;
    }
  }

  initializeNLP() {
    this.tokenizer = new natural.WordTokenizer();
    // Remove natural.Afinn (not a constructor), use simple scoring
    this.newsSentimentWords = {
      positive: [
        'breakthrough', 'innovation', 'success', 'growth', 'improvement', 'recovery',
        'positive', 'optimistic', 'hopeful', 'promising', 'excellent', 'outstanding',
        'achievement', 'victory', 'win', 'gain', 'profit', 'surge', 'rise', 'boost'
      ],
      negative: [
        'crisis', 'disaster', 'failure', 'loss', 'decline', 'drop', 'fall', 'crash',
        'negative', 'pessimistic', 'worried', 'concerned', 'fear', 'anxiety',
        'problem', 'issue', 'challenge', 'threat', 'risk', 'danger', 'conflict'
      ]
    };
  }

  async analyzeSentiment(articles, requestId) {
    console.log(`😊 Sentiment Agent: Analyzing sentiment for ${articles.length} articles`);
    const articlesWithSentiment = [];
    for (const article of articles) {
      try {
        const sentiment = await this.analyzeSingleArticle(article, requestId);
        articlesWithSentiment.push({
          ...article,
          sentiment,
          sentimentAnalyzedAt: new Date().toISOString(),
          requestId
        });
      } catch (error) {
        console.warn(`⚠️ Failed to analyze sentiment for article "${article.title}":`, error.message);
        articlesWithSentiment.push({
          ...article,
          sentiment: this.fallbackSentimentAnalysis(article),
          sentimentAnalyzedAt: new Date().toISOString(),
          requestId,
          sentimentError: error.message
        });
      }
    }
    return articlesWithSentiment;
  }

  async analyzeSingleArticle(article, requestId) {
    if (this.llm) {
      try {
        return await this.ollamaSentimentAnalysis(article);
      } catch (e) {
        console.warn('Ollama sentiment analysis failed, falling back to NLP:', e.message);
        return this.nlpSentimentAnalysis(article);
      }
    } else {
      return this.nlpSentimentAnalysis(article);
    }
  }

  async ollamaSentimentAnalysis(article) {
    const prompt = `You are an expert sentiment analyst. Analyze the sentiment of the following news article and provide a detailed analysis in JSON format with keys: sentiment (positive/negative/neutral/mixed), score (0-100), confidence (high/medium/low), indicators (array), explanation (string).\n\nTitle: ${article.title}\nSummary: ${article.summary || ''}\nContent: ${article.content || article.description || ''}`;
    const result = await this.llm.invoke(prompt);
    const text = result.content.trim();
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      const sentimentData = JSON.parse(jsonString);
      return {
        method: 'ollama',
        ...sentimentData
      };
    } catch (e) {
      return {
        method: 'ollama',
        sentiment: 'neutral',
        score: 50,
        confidence: 'low',
        indicators: [],
        explanation: text
      };
    }
  }

  nlpSentimentAnalysis(article) {
    const text = `${article.title} ${article.content || article.description || ''}`.toLowerCase();
    const tokens = this.tokenizer.tokenize(text);
    let score = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    tokens.forEach(token => {
      if (this.newsSentimentWords.positive.includes(token)) {
        score += 1;
        positiveCount++;
      } else if (this.newsSentimentWords.negative.includes(token)) {
        score -= 1;
        negativeCount++;
      }
    });
    const totalRelevantTokens = positiveCount + negativeCount;
    const normalizedScore = totalRelevantTokens > 0 ? ((score / totalRelevantTokens) * 50 + 50) : 50;
    return {
      method: 'nlp',
      sentiment: this.getSentimentLabel(normalizedScore),
      score: Math.round(normalizedScore),
      confidence: 'medium',
      indicators: [],
      explanation: `NLP analysis based on ${tokens.length} tokens with custom scoring`
    };
  }

  getSentimentLabel(score) {
    if (score >= 70) return 'positive';
    if (score >= 40) return 'neutral';
    if (score >= 20) return 'mixed';
    return 'negative';
  }

  fallbackSentimentAnalysis(article) {
    const text = `${article.title} ${article.content || article.description || ''}`.toLowerCase();
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'growth'];
    const negativeWords = ['bad', 'terrible', 'negative', 'failure', 'loss', 'crisis'];
    let score = 50;
    positiveWords.forEach(word => {
      if (text.includes(word)) score += 10;
    });
    negativeWords.forEach(word => {
      if (text.includes(word)) score -= 10;
    });
    return {
      method: 'fallback',
      sentiment: this.getSentimentLabel(score),
      score: Math.max(0, Math.min(100, score)),
      confidence: 'low',
      indicators: [],
      explanation: 'Fallback keyword-based analysis'
    };
  }

  async healthCheck() {
    let nlp = false;
    try {
      const testTokens = this.tokenizer.tokenize('This is a test sentence');
      nlp = testTokens.length > 0;
    } catch (error) {}
    let ollama = false;
    if (this.llm) {
      try {
        await this.ollamaSentimentAnalysis({ title: 'Test', content: 'This is good news.' });
        ollama = true;
      } catch (e) {}
    }
    return {
      status: nlp || ollama ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: { nlp, ollama }
    };
  }
}

module.exports = SentimentAgent; 