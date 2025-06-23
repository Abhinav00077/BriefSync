const express = require('express');

module.exports = (newsAggregator) => {
  const router = express.Router();

  // Search news by keyword
  router.post('/search', async (req, res) => {
    try {
      const { keyword, options = {} } = req.body;

      if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
        return res.status(400).json({
          error: 'Invalid keyword',
          message: 'Please provide a valid keyword to search for'
        });
      }

      console.log(`🔍 API: Processing search request for keyword: "${keyword}"`);

      const result = await newsAggregator.processKeyword(keyword.trim(), options);

      res.json({
        success: true,
        data: result,
        message: `Successfully processed ${result.articles.length} articles for "${keyword}"`
      });

    } catch (error) {
      console.error('❌ API Error:', error);
      res.status(500).json({
        error: 'Processing failed',
        message: error.message || 'An error occurred while processing the request'
      });
    }
  });

  // Get processing status
  router.get('/status/:requestId', async (req, res) => {
    try {
      const { requestId } = req.params;
      const status = await newsAggregator.getProcessingStatus(requestId);
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('❌ Status API Error:', error);
      res.status(500).json({
        error: 'Status check failed',
        message: error.message
      });
    }
  });

  // Get cache statistics
  router.get('/cache/stats', (req, res) => {
    try {
      const stats = newsAggregator.getCacheStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Cache Stats API Error:', error);
      res.status(500).json({
        error: 'Cache stats failed',
        message: error.message
      });
    }
  });

  // Clear cache
  router.delete('/cache', async (req, res) => {
    try {
      await newsAggregator.clearCache();
      
      res.json({
        success: true,
        message: 'Cache cleared successfully'
      });
    } catch (error) {
      console.error('❌ Clear Cache API Error:', error);
      res.status(500).json({
        error: 'Cache clear failed',
        message: error.message
      });
    }
  });

  // Get recent searches (mock data for now)
  router.get('/recent', (req, res) => {
    try {
      // This could be enhanced with a database to store actual recent searches
      const recentSearches = [
        { keyword: 'AI', timestamp: new Date().toISOString(), articleCount: 15 },
        { keyword: 'Climate Change', timestamp: new Date(Date.now() - 3600000).toISOString(), articleCount: 12 },
        { keyword: 'Technology', timestamp: new Date(Date.now() - 7200000).toISOString(), articleCount: 18 }
      ];

      res.json({
        success: true,
        data: recentSearches
      });
    } catch (error) {
      console.error('❌ Recent Searches API Error:', error);
      res.status(500).json({
        error: 'Recent searches failed',
        message: error.message
      });
    }
  });

  // Get trending topics (mock data for now)
  router.get('/trending', (req, res) => {
    try {
      const trendingTopics = [
        { keyword: 'Artificial Intelligence', count: 45, trend: 'up' },
        { keyword: 'Climate Change', count: 38, trend: 'up' },
        { keyword: 'Space Exploration', count: 32, trend: 'stable' },
        { keyword: 'Renewable Energy', count: 28, trend: 'up' },
        { keyword: 'Cybersecurity', count: 25, trend: 'down' }
      ];

      res.json({
        success: true,
        data: trendingTopics
      });
    } catch (error) {
      console.error('❌ Trending Topics API Error:', error);
      res.status(500).json({
        error: 'Trending topics failed',
        message: error.message
      });
    }
  });

  return router;
}; 