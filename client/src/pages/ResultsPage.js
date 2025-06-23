import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Clock, 
  Globe, 
  TrendingUp,
  FileText,
  BarChart3,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ResultsPage = () => {
  const { keyword } = useParams();
  const location = useLocation();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call - replace with actual API call
        const response = await fetch('/api/news/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keyword: decodeURIComponent(keyword),
            options: location.state?.options || {}
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const data = await response.json();
        setResults(data.data);
        toast.success(`Found ${data.data.articles.length} articles for "${decodeURIComponent(keyword)}"`);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to fetch news results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
            Processing News for "{decodeURIComponent(keyword)}"
          </h2>
          <p className="text-secondary-600">
            Our AI agents are fetching, summarizing, and analyzing articles...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-error-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
            Error Loading Results
          </h2>
          <p className="text-secondary-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-6 h-6 text-primary-600" />
            <h1 className="text-3xl font-bold text-secondary-900">
              Results for "{decodeURIComponent(keyword)}"
            </h1>
          </div>
          <p className="text-secondary-600">
            Found {results.articles.length} articles • Processed at {new Date(results.timestamp).toLocaleString()}
          </p>
        </motion.div>

        {/* Summary */}
        {results.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-8"
          >
            <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              AI-Generated Summary
            </h2>
            <p className="text-secondary-700 leading-relaxed">
              {results.summary.text}
            </p>
          </motion.div>
        )}

        {/* Statistics */}
        {results.statistics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {results.statistics.totalArticles}
              </div>
              <div className="text-secondary-600">Total Articles</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {Object.keys(results.statistics.sources).length}
              </div>
              <div className="text-secondary-600">News Sources</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {results.statistics.averageSentimentScore}
              </div>
              <div className="text-secondary-600">Avg Sentiment</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {results.sentiment?.overall?.dominant || 'N/A'}
              </div>
              <div className="text-secondary-600">Overall Tone</div>
            </div>
          </motion.div>
        )}

        {/* Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-2" />
            Articles ({results.articles.length})
          </h2>
          
          <div className="space-y-6">
            {results.articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {article.urlToImage && (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-600 transition-colors duration-200"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <p className="text-secondary-600 mb-3">
                      {article.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {article.source}
                      </span>
                      {article.sentiment && (
                        <span className={`badge badge-${article.sentiment.sentiment === 'positive' ? 'success' : article.sentiment.sentiment === 'negative' ? 'error' : 'neutral'}`}>
                          {article.sentiment.sentiment} ({article.sentiment.score})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage; 