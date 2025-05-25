// src/api/recommendations.js

import express from 'express';
import { FoodRecommendationService } from '../services/FoodRecommendationService.js';

const router = express.Router();
const foodService = new FoodRecommendationService();

// Initialize service on startup
foodService.initialize().catch(console.error);

// Middleware untuk error handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware untuk validasi request
const validateRecommendationRequest = (req, res, next) => {
    const { input } = req.body;
    
    if (!input || typeof input !== 'string' || input.trim().length < 5) {
        return res.status(400).json({
            success: false,
            error: 'Input harus berupa string minimal 5 karakter'
        });
    }
    
    next();
};

// POST /api/recommendations - Get food recommendations
router.post('/', validateRecommendationRequest, asyncHandler(async (req, res) => {
    const { input, options = {} } = req.body;
    
    try {
        const recommendations = await foodService.getRecommendations(input, options);
        
        res.json({
            success: true,
            data: recommendations,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}));

// GET /api/recommendations/mood/:mood - Get recommendations by mood
router.get('/mood/:mood', asyncHandler(async (req, res) => {
    const { mood } = req.params;
    const options = {
        limit: parseInt(req.query.limit) || 5,
        filters: {}
    };

    // Parse filters from query params
    if (req.query.category) options.filters.category = req.query.category;
    if (req.query.difficulty) options.filters.difficulty = req.query.difficulty;
    if (req.query.maxPrepTime) options.filters.maxPrepTime = parseInt(req.query.maxPrepTime);
    if (req.query.priceRange) options.filters.priceRange = req.query.priceRange;

    try {
        const recommendations = await foodService.getRecommendationsByMood(mood, options);
        
        res.json({
            success: true,
            data: recommendations,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}));

// POST /api/recommendations/batch - Batch recommendations
router.post('/batch', asyncHandler(async (req, res) => {
    const { inputs, options = {} } = req.body;
    
    if (!Array.isArray(inputs) || inputs.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'Inputs harus berupa array dengan minimal 1 item'
        });
    }

    if (inputs.length > 10) {
        return res.status(400).json({
            success: false,
            error: 'Maksimal 10 inputs per batch'
        });
    }

    try {
        const results = await foodService.getBatchRecommendations(inputs, options);
        
        res.json({
            success: true,
            data: results,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}));

// GET /api/recommendations/food/:id - Get food details
router.get('/food/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
        const food = await foodService.getFoodDetails(id);
        
        res.json({
            success: true,
            data: food,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}));

// GET /api/recommendations/search - Search foods
router.get('/search', asyncHandler(async (req, res) => {
    const { q: query, limit, category, difficulty, priceRange, maxPrepTime } = req.query;
    
    if (!query || query.trim().length < 2) {
        return res.status(400).json({
            success: false,
            error: 'Query minimal 2 karakter'
        });
    }

    const options = {
        limit: limit ? parseInt(limit) : undefined,
        filters: {}
    };

    if (category) options.filters.category = category;
    if (difficulty) options.filters.difficulty = difficulty;
    if (priceRange) options.filters.priceRange = priceRange;
    if (maxPrepTime) options.filters.maxPrepTime = parseInt(maxPrepTime);

    try {
        const results = await foodService.searchFoods(query, options);
        
        res.json({
            success: true,
            data: results,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}));

// GET /api/recommendations/options - Get available options
router.get('/options', asyncHandler(async (req, res) => {
    try {
        const options = await foodService.getAvailableOptions();
        
        res.json({
            success: true,
            data: options,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}));

// GET /api/recommendations/analytics - Get service analytics
router.get('/analytics', asyncHandler(async (req, res) => {
    try {
        const analytics = await foodService.getAnalytics();
        
        res.json({
            success: true,
            data: analytics,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}));

// POST /api/recommendations/reload - Reload data
router.post('/reload', asyncHandler(async (req, res) => {
    try {
        const result = await foodService.reloadData();
        
        res.json({
            success: true,
            message: 'Data berhasil di-reload',
            data: result,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}));

// GET /api/recommendations/health - Health check
router.get('/health', asyncHandler(async (req, res) => {
    try {
        const health = await foodService.healthCheck();
        const statusCode = health.status === 'healthy' ? 200 : 503;
        
        res.status(statusCode).json({
            success: health.status === 'healthy',
            data: health,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(503).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}));

// Error handling middleware
router.use((error, req, res, next) => {
    console.error('API Error:', error);
    
    res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

export default router;