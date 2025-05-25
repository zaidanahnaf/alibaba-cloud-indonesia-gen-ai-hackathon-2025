// app.js - Main application file

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recommendationRoutes from './src/api/recommendations.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Routes
app.use('/api/recommendations', recommendationRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Food Recommendation API',
        version: '2.0.0',
        endpoints: {
            'POST /api/recommendations': 'Get food recommendations based on input',
            'GET /api/recommendations/mood/:mood': 'Get recommendations by specific mood',
            'POST /api/recommendations/batch': 'Batch recommendations',
            'GET /api/recommendations/food/:id': 'Get food details by ID',
            'GET /api/recommendations/search': 'Search foods',
            'GET /api/recommendations/options': 'Get available filter options',
            'GET /api/recommendations/analytics': 'Get service analytics',
            'POST /api/recommendations/reload': 'Reload food data',
            'GET /api/recommendations/health': 'Health check'
        },
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global Error:', error);
    
    res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Food Recommendation API running on port ${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}`);
});

export default app;

// ===========================================
// usage-examples.js - How to use the service
// ===========================================

import { FoodRecommendationService } from './src/services/FoodRecommendationService.js';

async function demonstrateUsage() {
    const service = new FoodRecommendationService('./data/foods.json');
    
    try {
        // Initialize service
        console.log('🔄 Initializing service...');
        await service.initialize();
        console.log('✅ Service initialized\n');

        // Example 1: Basic recommendation
        console.log('=== Example 1: Basic Recommendation ===');
        const basic = await service.getRecommendations(
            "Hari ini deadline menumpuk, stress banget di kantor"
        );
        console.log(`Detected Mood: ${basic.mood} (${basic.mood_confidence})`);
        console.log(`Strategy: ${basic.mood_detection_strategy}`);
        console.log(`Recommendations: ${basic.recommendations.length}\n`);

        // Example 2: With filters and personalization
        console.log('=== Example 2: Advanced Options ===');
        const advanced = await service.getRecommendations(
            "Sedih banget hari ini, butuh comfort food",
            {
                limit: 3,
                personalizeReasons: true,
                filters: {
                    category: 'makanan_utama',
                    maxPrepTime: 30
                }
            }
        );
        
        advanced.recommendations.forEach((rec, i) => {
            console.log(`${i+1}. ${rec.name}`);
            console.log(`   Category: ${rec.category}`);
            console.log(`   Prep Time: ${rec.prep_time} minutes`);
            console.log(`   Reason: ${rec.reason}\n`);
        });

        // Example 3: Get by specific mood
        console.log('=== Example 3: By Specific Mood ===');
        const byMood = await service.getRecommendationsByMood('bosan', {
            limit: 2,
            filters: { difficulty: 'mudah' }
        });
        console.log(`Foods for 'bosan' mood: ${byMood.recommendations.length}`);
        byMood.recommendations.forEach(rec => {
            console.log(`- ${rec.name} (${rec.difficulty})`);
        });
        console.log();

        // Example 4: Search functionality
        console.log('=== Example 4: Search Foods ===');
        const searchResults = await service.searchFoods('nasi', { limit: 3 });
        console.log(`Search results for 'nasi': ${searchResults.total_matches}`);
        searchResults.foods.forEach(food => {
            console.log(`- ${food.name}: ${food.description}`);
        });
        console.log();

        // Example 5: Batch processing
        console.log('=== Example 5: Batch Processing ===');
        const batchInputs = [
            "Capek banget hari ini",
            "Lagi senang-senangnya nih",
            "Bosan makan yang itu-itu terus"
        ];
        
        const batchResults = await service.getBatchRecommendations(batchInputs, {
            limit: 2
        });
        
        console.log(`Batch processing: ${batchResults.successful}/${batchResults.total} successful`);
        batchResults.results.forEach((result, i) => {
            if (result.success) {
                console.log(`${i+1}. "${result.input}" → ${result.mood} (${result.recommendations.length} foods)`);
            }
        });
        console.log();

        // Example 6: Get available options
        console.log('=== Example 6: Available Options ===');
        const options = await service.getAvailableOptions();
        console.log('Available moods:', options.moods);
        console.log('Available categories:', options.categories);
        console.log('Available difficulties:', options.difficulties);
        console.log();

        // Example 7: Analytics
        console.log('=== Example 7: Service Analytics ===');
        const analytics = await service.getAnalytics();
        console.log(`Total foods: ${analytics.total_foods}`);
        console.log(`Mood distribution:`, analytics.mood_distribution);
        console.log(`Service health:`, analytics.service_health.database.loaded ? '✅ Healthy' : '❌ Unhealthy');
        console.log();

        // Example 8: Health check
        console.log('=== Example 8: Health Check ===');
        const health = await service.healthCheck();
        console.log(`Overall status: ${health.status}`);
        console.log('Component checks:', health.checks);

    } catch (error) {
        console.error('❌ Error during demonstration:', error.message);
    }
}

// Example API usage with curl commands
function showCurlExamples() {
    console.log('\n=== cURL Examples ===\n');
    
    const examples = [
        {
            description: 'Basic recommendation',
            curl: `curl -X POST http://localhost:3000/api/recommendations \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Stress banget hari ini, deadline menumpuk"}'`
        },
        {
            description: 'Recommendation with options',
            curl: `curl -X POST http://localhost:3000/api/recommendations \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": "Sedih banget hari ini", 
    "options": {
      "limit": 3,
      "personalizeReasons": true,
      "filters": {"category": "makanan_utama"}
    }
  }'`
        },
        {
            description: 'Get by mood',
            curl: `curl "http://localhost:3000/api/recommendations/mood/senang?limit=3&category=snack"`
        },
        {
            description: 'Search foods',
            curl: `curl "http://localhost:3000/api/recommendations/search?q=nasi&limit=5"`
        },
        {
            description: 'Health check',
            curl: `curl http://localhost:3000/api/recommendations/health`
        },
        {
            description: 'Get analytics',
            curl: `curl http://localhost:3000/api/recommendations/analytics`
        }
    ];

    examples.forEach((example, i) => {
        console.log(`${i+1}. ${example.description}:`);
        console.log(example.curl);
        console.log();
    });
}

// Run demonstration
if (import.meta.url === `file://${process.argv[1]}`) {
    demonstrateUsage()
        .then(() => {
            showCurlExamples();
            console.log('✅ Demonstration completed successfully!');
        })
        .catch(console.error);
}