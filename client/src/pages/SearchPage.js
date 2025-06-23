import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Calendar,
  Globe,
  TrendingUp,
  Settings,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';

const SearchPage = () => {
  const [keyword, setKeyword] = useState('');
  const [options, setOptions] = useState({
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: 20,
    fromDate: '',
    toDate: ''
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast.error('Please enter a keyword to search');
      return;
    }
    navigate(`/results/${encodeURIComponent(keyword.trim())}`, { 
      state: { options } 
    });
  };

  const quickSearches = [
    'Artificial Intelligence',
    'Climate Change',
    'Space Exploration',
    'Renewable Energy',
    'Cybersecurity',
    'Quantum Computing',
    'Electric Vehicles',
    'Blockchain'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
            Smart News Search
          </h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Enter a keyword and let our AI agents fetch, summarize, and analyze news from multiple sources.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card mb-8"
        >
          <form onSubmit={handleSearch}>
            {/* Main Search Input */}
            <div className="mb-6">
              <label htmlFor="keyword" className="block text-sm font-medium text-secondary-700 mb-2">
                Search Keyword
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  id="keyword"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter a keyword (e.g., 'AI', 'Climate Change', 'Technology')"
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                <span>Advanced Options</span>
                <motion.div
                  animate={{ rotate: isAdvancedOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </button>
            </div>

            {/* Advanced Options */}
            <motion.div
              initial={false}
              animate={{ height: isAdvancedOpen ? 'auto' : 0, opacity: isAdvancedOpen ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-secondary-50 rounded-lg">
                {/* Language */}
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-secondary-700 mb-2">
                    Language
                  </label>
                  <select
                    id="language"
                    value={options.language}
                    onChange={(e) => setOptions({ ...options, language: e.target.value })}
                    className="input-field"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium text-secondary-700 mb-2">
                    Sort By
                  </label>
                  <select
                    id="sortBy"
                    value={options.sortBy}
                    onChange={(e) => setOptions({ ...options, sortBy: e.target.value })}
                    className="input-field"
                  >
                    <option value="publishedAt">Published Date</option>
                    <option value="relevancy">Relevancy</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>

                {/* Page Size */}
                <div>
                  <label htmlFor="pageSize" className="block text-sm font-medium text-secondary-700 mb-2">
                    Number of Articles
                  </label>
                  <select
                    id="pageSize"
                    value={options.pageSize}
                    onChange={(e) => setOptions({ ...options, pageSize: parseInt(e.target.value) })}
                    className="input-field"
                  >
                    <option value={10}>10 articles</option>
                    <option value={20}>20 articles</option>
                    <option value={30}>30 articles</option>
                    <option value={50}>50 articles</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label htmlFor="fromDate" className="block text-sm font-medium text-secondary-700 mb-2">
                    From Date (Optional)
                  </label>
                  <input
                    id="fromDate"
                    type="date"
                    value={options.fromDate}
                    onChange={(e) => setOptions({ ...options, fromDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </motion.div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
            >
              <Search className="w-5 h-5" />
              <span>Search News</span>
            </button>
          </form>
        </motion.div>

        {/* Quick Searches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Popular Searches
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickSearches.map((search) => (
              <button
                key={search}
                onClick={() => {
                  setKeyword(search);
                  navigate(`/results/${encodeURIComponent(search)}`);
                }}
                className="px-3 py-2 text-sm bg-secondary-100 hover:bg-primary-100 text-secondary-700 hover:text-primary-700 rounded-lg transition-colors duration-200"
              >
                {search}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">Multi-Source</h3>
            <p className="text-secondary-600 text-sm">
              Fetch news from NewsAPI, Guardian, and New York Times
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">AI Analysis</h3>
            <p className="text-secondary-600 text-sm">
              Intelligent summarization and sentiment analysis
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">Real-time</h3>
            <p className="text-secondary-600 text-sm">
              Live processing updates and instant results
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage; 