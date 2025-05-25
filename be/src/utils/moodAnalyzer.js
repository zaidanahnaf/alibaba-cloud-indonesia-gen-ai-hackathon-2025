// src/utils/moodAnalyzer.js

import { 
    MOOD_KEYWORDS, 
    CONTEXT_KEYWORDS, 
    MOOD_PRIORITY, 
    KEYWORD_WEIGHTS,
    NEGATIVE_WORDS,
    POSITIVE_WORDS 
} from './constants.js';

export class MoodAnalyzer {
    
    // Analisis keyword dengan scoring system
    static analyzeKeywords(input) {
        const normalizedInput = input.toLowerCase();
        
        // Hitung score untuk direct keywords
        const directScores = this.calculateDirectScores(normalizedInput);
        
        // Hitung score untuk contextual keywords
        const contextScores = this.calculateContextScores(normalizedInput);
        
        // Total scores
        const totalScores = {};
        Object.keys(MOOD_KEYWORDS).forEach(mood => {
            totalScores[mood] = directScores[mood] + contextScores[mood];
        });

        return this.selectBestMood(totalScores);
    }

    static calculateDirectScores(input) {
        const scores = {};
        Object.keys(MOOD_KEYWORDS).forEach(mood => {
            scores[mood] = 0;
            MOOD_KEYWORDS[mood].forEach(keyword => {
                if (input.includes(keyword)) {
                    scores[mood] += KEYWORD_WEIGHTS.DIRECT;
                }
            });
        });
        return scores;
    }

    static calculateContextScores(input) {
        const scores = {};
        Object.keys(CONTEXT_KEYWORDS).forEach(mood => {
            scores[mood] = 0;
            CONTEXT_KEYWORDS[mood].forEach(keyword => {
                if (input.includes(keyword)) {
                    scores[mood] += KEYWORD_WEIGHTS.CONTEXTUAL;
                }
            });
        });
        return scores;
    }

    static selectBestMood(scores) {
        const maxScore = Math.max(...Object.values(scores));
        
        if (maxScore === 0) {
            return null; // No keywords matched
        }

        const topMoods = Object.keys(scores).filter(mood => scores[mood] === maxScore);
        
        if (topMoods.length === 1) {
            return topMoods[0];
        }

        // Tie resolution berdasarkan priority
        for (const mood of MOOD_PRIORITY) {
            if (topMoods.includes(mood)) {
                return mood;
            }
        }

        return topMoods[0]; // Fallback
    }

    // Intelligent fallback strategies
    static intelligentFallback(input) {
        // 1. Input pendek = biasanya bosan
        if (input.length < 20) {
            return 'bosan';
        }

        // 2. Analisis tone berdasarkan punctuation
        const toneAnalysis = this.analyzeTone(input);
        if (toneAnalysis) {
            return toneAnalysis;
        }

        // 3. Analisis kata negatif
        const sentimentAnalysis = this.analyzeSentiment(input);
        if (sentimentAnalysis) {
            return sentimentAnalysis;
        }

        // 4. Time-based heuristic
        const timeBasedMood = this.getTimeBasedMood();
        if (timeBasedMood) {
            return timeBasedMood;
        }

        // 5. Final fallback
        return 'stress'; // Most common mood
    }

    static analyzeTone(input) {
        const exclamationCount = (input.match(/!/g) || []).length;
        const questionCount = (input.match(/\?/g) || []).length;
        
        if (exclamationCount > 2) {
            const hasPositive = POSITIVE_WORDS.some(word => input.includes(word));
            return hasPositive ? 'senang' : 'stress';
        }

        if (questionCount > 1) {
            return 'stress'; // Banyak pertanyaan = bingung/stress
        }

        return null;
    }

    static analyzeSentiment(input) {
        const negativeCount = NEGATIVE_WORDS.filter(word => input.includes(word)).length;
        
        if (negativeCount > 1) {
            return 'stress';
        }

        return null;
    }

    static getTimeBasedMood() {
        const hour = new Date().getHours();
        
        if (hour >= 9 && hour <= 17) {
            return 'stress'; // Jam kerja
        } else if (hour >= 19 && hour <= 23) {
            return 'bosan'; // Malam
        }

        return null;
    }

    // Validasi mood
    static isValidMood(mood) {
        return MOOD_KEYWORDS.hasOwnProperty(mood);
    }
}