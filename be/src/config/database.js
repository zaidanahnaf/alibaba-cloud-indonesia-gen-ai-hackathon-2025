// src/config/database.js

import fs from 'fs/promises';
import path from 'path';

export class DatabaseManager {
    constructor(dataPath = './data/foods.json') {
        this.dataPath = dataPath;
        this.foodData = null;
        this.moodFoodCache = {};
        this.lastLoadTime = null;
    }

    // Load data makanan dari file JSON
    async loadFoodData() {
        try {
            const fileContent = await fs.readFile(this.dataPath, 'utf8');
            this.foodData = JSON.parse(fileContent);
            this.lastLoadTime = new Date();
            
            // Validate data structure
            this.validateDataStructure();
            
            // Build cache berdasarkan mood
            this.buildMoodCache();
            
            console.log(`Loaded ${this.foodData.foods.length} foods from ${this.dataPath}`);
            return this.foodData;
            
        } catch (error) {
            console.error("Failed to load food data:", error);
            throw new Error(`Cannot load food data from ${this.dataPath}: ${error.message}`);
        }
    }

    // Validasi struktur data
    validateDataStructure() {
        if (!this.foodData) {
            throw new Error("Food data is null");
        }
        
        if (!Array.isArray(this.foodData.foods)) {
            throw new Error("Invalid data structure: foods should be an array");
        }

        // Validasi setiap food item
        this.foodData.foods.forEach((food, index) => {
            const requiredFields = ['id', 'name', 'mood', 'category', 'description'];
            requiredFields.forEach(field => {
                if (!food[field]) {
                    throw new Error(`Missing required field '${field}' in food item ${index}`);
                }
            });
        });
    }

    // Build cache makanan berdasarkan mood untuk performa
    buildMoodCache() {
        this.moodFoodCache = {};
        
        this.foodData.foods.forEach(food => {
            if (!this.moodFoodCache[food.mood]) {
                this.moodFoodCache[food.mood] = [];
            }
            this.moodFoodCache[food.mood].push(food);
        });

        console.log("Mood cache built:", Object.keys(this.moodFoodCache).map(mood => ({
            mood,
            count: this.moodFoodCache[mood].length
        })));
    }

    // Get foods by mood dengan filtering dan sorting
    getFoodsByMood(mood, limit = 5, filters = {}) {
        if (!this.moodFoodCache[mood]) {
            return [];
        }

        let foods = [...this.moodFoodCache[mood]];

        // Apply filters
        foods = this.applyFilters(foods, filters);

        // Shuffle untuk variasi
        foods = this.shuffleArray(foods);
        
        return foods.slice(0, limit);
    }

    // Apply various filters
    applyFilters(foods, filters) {
        let filteredFoods = foods;

        if (filters.category) {
            filteredFoods = filteredFoods.filter(f => f.category === filters.category);
        }
        
        if (filters.difficulty) {
            filteredFoods = filteredFoods.filter(f => f.difficulty === filters.difficulty);
        }
        
        if (filters.maxPrepTime) {
            filteredFoods = filteredFoods.filter(f => f.prep_time <= filters.maxPrepTime);
        }
        
        if (filters.priceRange) {
            filteredFoods = filteredFoods.filter(f => f.price_range === filters.priceRange);
        }

        if (filters.tags && filters.tags.length > 0) {
            filteredFoods = filteredFoods.filter(f => 
                filters.tags.some(tag => f.tags?.includes(tag))
            );
        }

        return filteredFoods;
    }

    // Shuffle array for randomization
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Get food by ID
    getFoodById(id) {
        if (!this.foodData) return null;
        return this.foodData.foods.find(food => food.id === id);
    }

    // Get all available categories
    getCategories() {
        if (!this.foodData) return [];
        return [...new Set(this.foodData.foods.map(f => f.category))];
    }

    // Get all available moods
    getAvailableMoods() {
        return Object.keys(this.moodFoodCache);
    }

    // Reload data (untuk hot reload tanpa restart server)
    async reloadData() {
        await this.loadFoodData();
        return {
            status: 'reloaded',
            timestamp: this.lastLoadTime,
            total_foods: this.foodData.foods.length,
            available_moods: this.getAvailableMoods()
        };
    }

    // Get database analytics/stats
    getAnalytics() {
        if (!this.foodData) return null;

        const analytics = {
            total_foods: this.foodData.foods.length,
            categories: this.getCategories(),
            available_moods: this.getAvailableMoods(),
            mood_distribution: {},
            category_distribution: {},
            average_prep_time: 0,
            difficulty_distribution: {},
            price_range_distribution: {},
            cache_status: Object.keys(this.moodFoodCache).map(mood => ({
                mood,
                count: this.moodFoodCache[mood].length
            })),
            last_loaded: this.lastLoadTime,
            data_version: this.foodData.metadata?.version || '1.0'
        };

        // Calculate distributions
        this.foodData.foods.forEach(food => {
            // Mood distribution
            analytics.mood_distribution[food.mood] = 
                (analytics.mood_distribution[food.mood] || 0) + 1;
            
            // Category distribution
            analytics.category_distribution[food.category] = 
                (analytics.category_distribution[food.category] || 0) + 1;
            
            // Difficulty distribution
            if (food.difficulty) {
                analytics.difficulty_distribution[food.difficulty] = 
                    (analytics.difficulty_distribution[food.difficulty] || 0) + 1;
            }
            
            // Price range distribution
            if (food.price_range) {
                analytics.price_range_distribution[food.price_range] = 
                    (analytics.price_range_distribution[food.price_range] || 0) + 1;
            }
        });

        // Calculate average prep time
        const prepTimes = this.foodData.foods
            .filter(f => f.prep_time)
            .map(f => f.prep_time);
        
        if (prepTimes.length > 0) {
            analytics.average_prep_time = prepTimes.reduce((sum, time) => sum + time, 0) / prepTimes.length;
        }

        return analytics;
    }

    // Check if data is loaded
    isDataLoaded() {
        return this.foodData !== null;
    }

    // Get data status
    getDataStatus() {
        return {
            loaded: this.isDataLoaded(),
            last_load_time: this.lastLoadTime,
            total_foods: this.foodData?.foods?.length || 0,
            cache_ready: Object.keys(this.moodFoodCache).length > 0
        };
    }
}