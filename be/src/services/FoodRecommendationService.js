// src/services/FoodRecommendationService.js

import { DatabaseManager } from '../config/database.js';
import { MoodDetectionService } from './MoodDetectionService.js';
import { AIService } from './AIService.js';
import { DEFAULT_CONFIG } from '../utils/constants.js';

export class FoodRecommendationService {
    constructor(dataPath = './data/foods.json') {
        this.database = new DatabaseManager(dataPath);
        this.moodDetectionService = new MoodDetectionService();
        this.aiService = new AIService();
    }

    // Initialize service - load data
    async initialize() {
        await this.database.loadFoodData();
        console.log("FoodRecommendationService initialized successfully");
    }

    // Main recommendation function
    async getRecommendations(userInput, options = {}) {
        try {
            // Ensure service is initialized
            if (!this.database.isDataLoaded()) {
                await this.initialize();
            }

            // Validate input
            this.validateInput(userInput);

            // Detect mood
            const moodResult = await this.moodDetectionService.detectMood(
                userInput,
                options.moodOptions
            );

            // Get food recommendations
            const recommendedFoods = this.database.getFoodsByMood(
                moodResult.mood,
                options.limit || DEFAULT_CONFIG.LIMIT,
                options.filters || {}
            );

            if (recommendedFoods.length === 0) {
                throw new Error(`Tidak ada makanan tersedia untuk mood: ${moodResult.mood}`);
            }

            // Generate personalized reasons if requested
            const recommendations = await this.buildRecommendations(
                userInput,
                recommendedFoods,
                moodResult,
                options
            );

            // Build response
            return this.buildResponse(moodResult, recommendations, options);

        } catch (error) {
            console.error("Recommendation Error:", error);
            throw error;
        }
    }

    // Validate user input
    validateInput(userInput) {
        if (!userInput || typeof userInput !== 'string') {
            throw new Error("Input harus berupa string");
        }

        if (userInput.trim().length < DEFAULT_CONFIG.MIN_INPUT_LENGTH) {
            throw new Error("Input terlalu pendek, ceritakan lebih detail situasi Anda");
        }
    }

    // Build recommendations with optional personalization
    async buildRecommendations(userInput, foods, moodResult, options) {
        let personalizedReasons = [];

        // Generate personalized reasons if requested
        if (options.personalizeReasons) {
            try {
                personalizedReasons = await this.aiService.generatePersonalizedReasons(
                    userInput,
                    foods,
                    moodResult.mood
                );
            } catch (error) {
                console.log("Failed to generate personalized reasons, using defaults");
                personalizedReasons = foods.map(f => f.reason);
            }
        }

        // Format recommendations
        return foods.map((food, index) => ({
            id: food.id,
            name: food.name,
            description: food.description,
            reason: personalizedReasons[index] || food.reason,
            category: food.category,
            prep_time: food.prep_time,
            difficulty: food.difficulty,
            tags: food.tags,
            nutritional_benefits: food.nutritional_benefits,
            price_range: food.price_range,
            ingredients: food.ingredients
        }));
    }

    // Build final response
    buildResponse(moodResult, recommendations, options) {
        const totalAvailable = this.database.moodFoodCache[moodResult.mood]?.length || 0;

        return {
            mood: moodResult.mood,
            mood_confidence: moodResult.confidence,
            mood_detection_strategy: moodResult.strategy,
            recommendations,
            total_available: totalAvailable,
            filters_applied: options.filters || {},
            personalized: !!options.personalizeReasons,
            timestamp: new Date().toISOString(),
            data_version: this.database.foodData?.metadata?.version || '1.0'
        };
    }

    // Get recommendations by specific mood (bypass detection)
    async getRecommendationsByMood(mood, options = {}) {
        try {
            if (!this.database.isDataLoaded()) {
                await this.initialize();
            }

            const foods = this.database.getFoodsByMood(
                mood,
                options.limit || DEFAULT_CONFIG.LIMIT,
                options.filters || {}
            );

            if (foods.length === 0) {
                throw new Error(`Tidak ada makanan tersedia untuk mood: ${mood}`);
            }

            const recommendations = foods.map(food => ({
                id: food.id,
                name: food.name,
                description: food.description,
                reason: food.reason,
                category: food.category,
                prep_time: food.prep_time,
                difficulty: food.difficulty,
                tags: food.tags,
                nutritional_benefits: food.nutritional_benefits,
                price_range: food.price_range,
                ingredients: food.ingredients
            }));

            return {
                mood,
                mood_confidence: 'manual',
                mood_detection_strategy: 'manual',
                recommendations,
                total_available: this.database.moodFoodCache[mood]?.length || 0,
                filters_applied: options.filters || {},
                personalized: false,
                timestamp: new Date().toISOString(),
                data_version: this.database.foodData?.metadata?.version || '1.0'
            };

        } catch (error) {
            console.error("Mood-based recommendation error:", error);
            throw error;
        }
    }

    // Get food details by ID
    async getFoodDetails(foodId) {
        if (!this.database.isDataLoaded()) {
            await this.initialize();
        }

        const food = this.database.getFoodById(foodId);
        if (!food) {
            throw new Error(`Food with ID ${foodId} not found`);
        }

        return food;
    }

    // Get available filters/options
    async getAvailableOptions() {
        if (!this.database.isDataLoaded()) {
            await this.initialize();
        }

        return {
            moods: this.database.getAvailableMoods(),
            categories: this.database.getCategories(),
            difficulties: [...new Set(this.database.foodData.foods.map(f => f.difficulty).filter(Boolean))],
            price_ranges: [...new Set(this.database.foodData.foods.map(f => f.price_range).filter(Boolean))],
            tags: [...new Set(this.database.foodData.foods.flatMap(f => f.tags || []))]
        };
    }

    // Batch recommendations for multiple inputs
    async getBatchRecommendations(inputs, options = {}) {
        const results = [];

        for (const input of inputs) {
            try {
                const recommendation = await this.getRecommendations(input, options);
                results.push({
                    input,
                    success: true,
                    ...recommendation
                });
            } catch (error) {
                results.push({
                    input,
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        return {
            total: inputs.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results
        };
    }

    // Reload data (untuk hot reload tanpa restart server)
    async reloadData() {
        return await this.database.reloadData();
    }

    // Get service analytics/stats
    async getAnalytics() {
        if (!this.database.isDataLoaded()) {
            await this.initialize();
        }

        const dbAnalytics = this.database.getAnalytics();
        const moodServiceHealth = await this.moodDetectionService.healthCheck();
        
        return {
            ...dbAnalytics,
            service_health: {
                database: this.database.getDataStatus(),
                mood_detection: moodServiceHealth,
                ai_service: await this.aiService.healthCheck()
            },
            service_info: {
                initialized: this.database.isDataLoaded(),
                default_limit: DEFAULT_CONFIG.LIMIT,
                supported_features: [
                    'mood_detection',
                    'ai_personalization',
                    'food_filtering',
                    'batch_processing'
                ]
            }
        };
    }

    // Health check untuk seluruh service
    async healthCheck() {
        try {
            const checks = {
                database: this.database.isDataLoaded(),
                mood_service: (await this.moodDetectionService.healthCheck()).status === 'healthy',
                ai_service: (await this.aiService.healthCheck()).status === 'healthy'
            };

            const allHealthy = Object.values(checks).every(check => check);

            return {
                status: allHealthy ? 'healthy' : 'degraded',
                checks,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Search foods by name or description
    async searchFoods(query, options = {}) {
        if (!this.database.isDataLoaded()) {
            await this.initialize();
        }

        const lowercaseQuery = query.toLowerCase();
        const allFoods = this.database.foodData.foods;

        let matchingFoods = allFoods.filter(food => 
            food.name.toLowerCase().includes(lowercaseQuery) ||
            food.description.toLowerCase().includes(lowercaseQuery) ||
            (food.tags && food.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
        );

        // Apply filters if provided
        if (options.filters) {
            matchingFoods = this.database.applyFilters(matchingFoods, options.filters);
        }

        // Limit results
        if (options.limit) {
            matchingFoods = matchingFoods.slice(0, options.limit);
        }

        return {
            query,
            total_matches: matchingFoods.length,
            foods: matchingFoods,
            timestamp: new Date().toISOString()
        };
    }
}