module.exports = (io, newsAggregator) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Handle real-time search requests
    socket.on('search', async (data) => {
      try {
        const { keyword, options = {} } = data;
        
        if (!keyword || typeof keyword !== 'string' || keyword.trim().length === 0) {
          socket.emit('search_error', {
            error: 'Invalid keyword',
            message: 'Please provide a valid keyword to search for'
          });
          return;
        }

        console.log(`🔍 Socket: Processing search for "${keyword}" from ${socket.id}`);

        // Emit processing start
        socket.emit('search_started', {
          keyword,
          requestId: `socket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        });

        // Process the search
        const result = await newsAggregator.processKeyword(keyword.trim(), options);

        // Emit successful result
        socket.emit('search_completed', {
          success: true,
          data: result,
          message: `Successfully processed ${result.articles.length} articles for "${keyword}"`
        });

      } catch (error) {
        console.error('❌ Socket search error:', error);
        socket.emit('search_error', {
          error: 'Processing failed',
          message: error.message || 'An error occurred while processing the request'
        });
      }
    });

    // Handle status requests
    socket.on('get_status', async (data) => {
      try {
        const { requestId } = data;
        const status = await newsAggregator.getProcessingStatus(requestId);
        
        socket.emit('status_update', {
          success: true,
          data: status
        });
      } catch (error) {
        console.error('❌ Socket status error:', error);
        socket.emit('status_error', {
          error: 'Status check failed',
          message: error.message
        });
      }
    });

    // Handle cache operations
    socket.on('get_cache_stats', () => {
      try {
        const stats = newsAggregator.getCacheStats();
        
        socket.emit('cache_stats', {
          success: true,
          data: stats
        });
      } catch (error) {
        console.error('❌ Socket cache stats error:', error);
        socket.emit('cache_error', {
          error: 'Cache stats failed',
          message: error.message
        });
      }
    });

    socket.on('clear_cache', async () => {
      try {
        await newsAggregator.clearCache();
        
        socket.emit('cache_cleared', {
          success: true,
          message: 'Cache cleared successfully'
        });
      } catch (error) {
        console.error('❌ Socket clear cache error:', error);
        socket.emit('cache_error', {
          error: 'Cache clear failed',
          message: error.message
        });
      }
    });

    // Handle health checks
    socket.on('health_check', async () => {
      try {
        const healthStatus = await newsAggregator.healthCheck();
        
        socket.emit('health_status', {
          success: true,
          data: healthStatus
        });
      } catch (error) {
        console.error('❌ Socket health check error:', error);
        socket.emit('health_error', {
          error: 'Health check failed',
          message: error.message
        });
      }
    });

    // Handle trending topics request
    socket.on('get_trending', () => {
      try {
        // Mock trending topics - could be enhanced with real data
        const trendingTopics = [
          { keyword: 'Artificial Intelligence', count: 45, trend: 'up' },
          { keyword: 'Climate Change', count: 38, trend: 'up' },
          { keyword: 'Space Exploration', count: 32, trend: 'stable' },
          { keyword: 'Renewable Energy', count: 28, trend: 'up' },
          { keyword: 'Cybersecurity', count: 25, trend: 'down' }
        ];

        socket.emit('trending_topics', {
          success: true,
          data: trendingTopics
        });
      } catch (error) {
        console.error('❌ Socket trending topics error:', error);
        socket.emit('trending_error', {
          error: 'Trending topics failed',
          message: error.message
        });
      }
    });

    // Handle recent searches request
    socket.on('get_recent', () => {
      try {
        // Mock recent searches - could be enhanced with real data
        const recentSearches = [
          { keyword: 'AI', timestamp: new Date().toISOString(), articleCount: 15 },
          { keyword: 'Climate Change', timestamp: new Date(Date.now() - 3600000).toISOString(), articleCount: 12 },
          { keyword: 'Technology', timestamp: new Date(Date.now() - 7200000).toISOString(), articleCount: 18 }
        ];

        socket.emit('recent_searches', {
          success: true,
          data: recentSearches
        });
      } catch (error) {
        console.error('❌ Socket recent searches error:', error);
        socket.emit('recent_error', {
          error: 'Recent searches failed',
          message: error.message
        });
      }
    });

    // Handle ping/pong for connection monitoring
    socket.on('ping', () => {
      socket.emit('pong', {
        timestamp: new Date().toISOString(),
        socketId: socket.id
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id}, reason: ${reason}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error);
    });
  });

  // Broadcast system-wide events
  const broadcastSystemEvent = (event, data) => {
    io.emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  };

  // Example: Broadcast when cache is cleared
  newsAggregator.onCacheCleared = () => {
    broadcastSystemEvent('system_cache_cleared', {
      message: 'System cache has been cleared'
    });
  };

  // Example: Broadcast system health updates
  setInterval(async () => {
    try {
      const healthStatus = await newsAggregator.healthCheck();
      if (healthStatus.status === 'unhealthy') {
        broadcastSystemEvent('system_health_warning', {
          message: 'System health check failed',
          details: healthStatus
        });
      }
    } catch (error) {
      console.error('❌ System health check error:', error);
    }
  }, 5 * 60 * 1000); // Check every 5 minutes

  return {
    broadcastSystemEvent
  };
}; 