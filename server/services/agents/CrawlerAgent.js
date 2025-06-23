const axios = require('axios');
const cheerio = require('cheerio');

class CrawlerAgent {
  constructor() {
    this.newsApiKey = process.env.NEWS_API_KEY;
    this.guardianApiKey = process.env.GUARDIAN_API_KEY;
    this.nytApiKey = process.env.NYT_API_KEY;
    
    this.sources = [
      { name: 'NewsAPI', enabled: !!this.newsApiKey },
      { name: 'Guardian', enabled: !!this.guardianApiKey },
      { name: 'NYT', enabled: !!this.nytApiKey }
    ];
  }

  async fetchNews(keyword, options = {}) {
    const {
      language = 'en',
      sortBy = 'publishedAt',
      pageSize = 20,
      fromDate = this.getDateDaysAgo(7),
      toDate = new Date().toISOString().split('T')[0]
    } = options;

    console.log(`🔍 Crawler Agent: Searching for "${keyword}" across ${this.sources.filter(s => s.enabled).length} sources`);

    const promises = [];
    
    if (this.newsApiKey) {
      promises.push(this.fetchFromNewsAPI(keyword, { language, sortBy, pageSize, fromDate, toDate }));
    }
    
    if (this.guardianApiKey) {
      promises.push(this.fetchFromGuardian(keyword, { fromDate, toDate }));
    }
    
    if (this.nytApiKey) {
      promises.push(this.fetchFromNYT(keyword, { fromDate, toDate }));
    }

    try {
      const results = await Promise.allSettled(promises);
      const allArticles = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          allArticles.push(...result.value);
          console.log(`✅ ${this.sources[index].name}: Found ${result.value.length} articles`);
        } else {
          console.warn(`⚠️ ${this.sources[index].name}: Failed to fetch articles`);
        }
      });

      // Remove duplicates and sort by date
      const uniqueArticles = this.removeDuplicates(allArticles);
      const sortedArticles = uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      console.log(`📊 Crawler Agent: Total unique articles found: ${sortedArticles.length}`);
      
      return sortedArticles.slice(0, pageSize);
      
    } catch (error) {
      console.error('❌ Crawler Agent: Error fetching news:', error);
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  }

  async fetchFromNewsAPI(keyword, options) {
    try {
      const response = await axios.get(`${process.env.NEWS_API_BASE_URL}/everything`, {
        params: {
          q: keyword,
          apiKey: this.newsApiKey,
          language: options.language,
          sortBy: options.sortBy,
          pageSize: options.pageSize,
          from: options.fromDate,
          to: options.toDate
        },
        timeout: 10000
      });

      if (response.data.status === 'ok') {
        return response.data.articles.map(article => ({
          id: article.url,
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: article.source.name,
          author: article.author,
          publishedAt: article.publishedAt,
          urlToImage: article.urlToImage,
          sourceType: 'NewsAPI'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('NewsAPI error:', error.message);
      return [];
    }
  }

  async fetchFromGuardian(keyword, options) {
    try {
      const response = await axios.get('https://content.guardianapis.com/search', {
        params: {
          q: keyword,
          'api-key': this.guardianApiKey,
          'from-date': options.fromDate,
          'to-date': options.toDate,
          'show-fields': 'headline,trailText,bodyText,byline,thumbnail',
          'show-tags': 'contributor'
        },
        timeout: 10000
      });

      if (response.data.response && response.data.response.results) {
        return response.data.response.results.map(article => ({
          id: article.id,
          title: article.webTitle,
          description: article.fields?.trailText || '',
          content: article.fields?.bodyText || '',
          url: article.webUrl,
          source: 'The Guardian',
          author: article.fields?.byline || '',
          publishedAt: article.webPublicationDate,
          urlToImage: article.fields?.thumbnail || '',
          sourceType: 'Guardian'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Guardian API error:', error.message);
      return [];
    }
  }

  async fetchFromNYT(keyword, options) {
    try {
      const response = await axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
        params: {
          q: keyword,
          'api-key': this.nytApiKey,
          begin_date: options.fromDate.replace(/-/g, ''),
          end_date: options.toDate.replace(/-/g, ''),
          fl: 'headline,abstract,lead_paragraph,web_url,byline,multimedia,pub_date'
        },
        timeout: 10000
      });

      if (response.data.response && response.data.response.docs) {
        return response.data.response.docs.map(article => ({
          id: article._id,
          title: article.headline?.main || '',
          description: article.abstract || '',
          content: article.lead_paragraph || '',
          url: article.web_url,
          source: 'The New York Times',
          author: article.byline?.original || '',
          publishedAt: article.pub_date,
          urlToImage: article.multimedia?.[0]?.url ? `https://www.nytimes.com/${article.multimedia[0].url}` : '',
          sourceType: 'NYT'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('NYT API error:', error.message);
      return [];
    }
  }

  removeDuplicates(articles) {
    const seen = new Set();
    return articles.filter(article => {
      const key = article.url || article.id;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  async healthCheck() {
    const checks = {
      newsApi: false,
      guardian: false,
      nyt: false
    };

    try {
      if (this.newsApiKey) {
        const response = await axios.get(`${process.env.NEWS_API_BASE_URL}/top-headlines`, {
          params: { country: 'us', apiKey: this.newsApiKey },
          timeout: 5000
        });
        checks.newsApi = response.status === 200;
      }
    } catch (error) {
      console.warn('NewsAPI health check failed:', error.message);
    }

    return {
      status: Object.values(checks).some(check => check) ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks
    };
  }
}

module.exports = CrawlerAgent; 