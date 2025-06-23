const express = require('express');

module.exports = (newsAggregator) => {
  const router = express.Router();

  // Basic health check
  router.get('/', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'BriefSync News Aggregator',
      version: '1.0.0'
    });
  });

  // Detailed health check with all agents
  router.get('/detailed', async (req, res) => {
    try {
      const healthStatus = await newsAggregator.healthCheck();
      
      res.json({
        success: true,
        data: healthStatus
      });
    } catch (error) {
      console.error('❌ Health Check Error:', error);
      res.status(500).json({
        error: 'Health check failed',
        message: error.message
      });
    }
  });

  // System information
  router.get('/system', (req, res) => {
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: systemInfo
    });
  });

  // API endpoints status
  router.get('/endpoints', (req, res) => {
    const endpoints = [
      { path: '/api/news/search', method: 'POST', description: 'Search news by keyword' },
      { path: '/api/news/status/:requestId', method: 'GET', description: 'Get processing status' },
      { path: '/api/news/cache/stats', method: 'GET', description: 'Get cache statistics' },
      { path: '/api/news/cache', method: 'DELETE', description: 'Clear cache' },
      { path: '/api/news/recent', method: 'GET', description: 'Get recent searches' },
      { path: '/api/news/trending', method: 'GET', description: 'Get trending topics' },
      { path: '/api/health', method: 'GET', description: 'Basic health check' },
      { path: '/api/health/detailed', method: 'GET', description: 'Detailed health check' },
      { path: '/api/health/system', method: 'GET', description: 'System information' }
    ];

    res.json({
      success: true,
      data: endpoints
    });
  });

  return router;
}; 