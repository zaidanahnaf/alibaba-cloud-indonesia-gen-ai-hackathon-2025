// src/services/MoodDetectionService.js

import { AIService } from './AIService.js';
import { MoodAnalyzer } from '../utils/moodAnalyzer.js';

export class MoodDetectionService {
    constructor() {
        this.aiService = new AIService();
    }

    // Main mood detection dengan multiple strategies
    async detectMood(userInput, options = {}) {
        const strategies = options.strategies || ['ai', 'keywords', 'fallback'];
        
        for (const strategy of strategies) {
            try {
                const mood = await this.executeStrategy(strategy, userInput);
                if (mood) {
                    return {
                        mood,
                        strategy,
                        confidence: this.calculateConfidence(strategy, userInput)
                    };
                }
            } catch (error) {
                console.log(`Strategy ${strategy} failed:`, error.message);
                continue;
            }
        }

        // Final fallback
        return {
            mood: 'stress',
            strategy: 'default',
            confidence: 'low'
        };
    }

    // Execute specific detection strategy
    async executeStrategy(strategy, userInput) {
        switch (strategy) {
            case 'ai':
                return await this.aiService.detectMood(userInput);
                
            case 'keywords':
                return MoodAnalyzer.analyzeKeywords(userInput);
                
            case 'fallback':
                return MoodAnalyzer.intelligentFallback(userInput);
                
            default:
                throw new Error(`Unknown strategy: ${strategy}`);
        }
    }

    // Calculate confidence level
    calculateConfidence(strategy, userInput) {
        switch (strategy) {
            case 'ai':
                return 'high';
                
            case 'keywords':
                // Check if input has clear mood indicators
                const hasStrongKeywords = this.hasStrongMoodIndicators(userInput);
                return hasStrongKeywords ? 'medium' : 'low';
                
            case 'fallback':
                return 'low';
                
            default:
                return 'unknown';
        }
    }

    // Check for strong mood indicators
    hasStrongMoodIndicators(input) {
        const strongIndicators = [
            'stress', 'sedih', 'bosan', 'senang', 'bahagia',
            'deadline', 'kerja', 'galau', 'excited'
        ];
        
        const lowerInput = input.toLowerCase();
        return strongIndicators.some(indicator => lowerInput.includes(indicator));
    }

    // Batch mood detection untuk multiple inputs
    async detectMoodBatch(inputs, options = {}) {
        const results = [];
        
        for (const input of inputs) {
            try {
                const result = await this.detectMood(input, options);
                results.push({
                    input,
                    ...result,
                    success: true
                });
            } catch (error) {
                results.push({
                    input,
                    mood: null,
                    strategy: null,
                    confidence: null,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
    }

    // Get mood detection analytics
    getMoodAnalytics(detectionResults) {
        const analytics = {
            total: detectionResults.length,
            successful: detectionResults.filter(r => r.success).length,
            failed: detectionResults.filter(r => !r.success).length,
            strategies: {},
            moods: {},
            confidence_levels: {}
        };

        detectionResults.filter(r => r.success).forEach(result => {
            // Strategy distribution
            analytics.strategies[result.strategy] = 
                (analytics.strategies[result.strategy] || 0) + 1;
            
            // Mood distribution
            analytics.moods[result.mood] = 
                (analytics.moods[result.mood] || 0) + 1;
            
            // Confidence distribution  
            analytics.confidence_levels[result.confidence] = 
                (analytics.confidence_levels[result.confidence] || 0) + 1;
        });

        return analytics;
    }

    // Service health check
    async healthCheck() {
        const aiHealth = await this.aiService.healthCheck();
        
        return {
            status: aiHealth.status === 'healthy' ? 'healthy' : 'degraded',
            ai_service: aiHealth,
            keyword_analyzer: { status: 'healthy' },
            timestamp: new Date().toISOString()
        };
    }
}