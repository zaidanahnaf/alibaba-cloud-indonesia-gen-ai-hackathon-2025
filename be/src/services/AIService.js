// src/services/AIService.js

import OpenAI from "openai";
import { DEFAULT_CONFIG } from '../utils/constants.js';

export class AIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.DASHSCOPE_API_KEY,
            baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
        });
    }

    // AI-based mood detection
    async detectMood(userInput) {
        try {
            const moodPrompt = this.buildMoodPrompt();
            
            const completion = await this.openai.chat.completions.create({
                model: DEFAULT_CONFIG.MODEL,
                messages: [
                    { "role": "system", "content": moodPrompt },
                    { "role": "user", "content": userInput }
                ],
                max_tokens: 10,
                temperature: 0.3
            });

            const detectedMood = completion.choices[0]?.message?.content?.trim().toLowerCase();
            
            // Validasi mood yang terdeteksi
            const validMoods = ['senang', 'sedih', 'stress', 'bosan'];
            if (validMoods.includes(detectedMood)) {
                return detectedMood;
            }
            
            throw new Error("Invalid mood detected by AI");
            
        } catch (error) {
            console.log("AI mood detection failed:", error.message);
            throw error;
        }
    }

    // Generate personalized reasons
    async generatePersonalizedReasons(userInput, foods, detectedMood) {
        try {
            const reasonPrompt = this.buildReasonPrompt(userInput, foods, detectedMood);

            const completion = await this.openai.chat.completions.create({
                model: DEFAULT_CONFIG.MODEL,
                messages: [
                    { "role": "system", "content": reasonPrompt },
                    { "role": "user", "content": userInput }
                ],
                max_tokens: DEFAULT_CONFIG.MAX_TOKENS,
                temperature: DEFAULT_CONFIG.TEMPERATURE
            });

            const response = completion.choices[0]?.message?.content;
            const parsed = JSON.parse(response);
            
            return parsed.reasons || foods.map(f => f.reason);
            
        } catch (error) {
            console.log("AI reason generation failed:", error.message);
            throw error;
        }
    }

    // Build mood detection prompt
    buildMoodPrompt() {
        return `Analisis mood/emosi dari text berikut dan pilih SATU dari kategori ini: [senang, sedih, stress, bosan]

Jawab hanya dengan satu kata mood saja, contoh: stress`;
    }

    // Build reason generation prompt
    buildReasonPrompt(userInput, foods, detectedMood) {
        return `Berikan alasan personal mengapa makanan ini cocok untuk situasi pengguna.

Situasi pengguna: "${userInput}"
Mood terdeteksi: ${detectedMood}

Makanan yang direkomendasikan:
${foods.map(f => `- ${f.name}: ${f.description}`).join('\n')}

Buat alasan yang personal dan empathetic untuk setiap makanan. Format JSON:
{
  "reasons": [
    "Alasan personal untuk makanan 1",
    "Alasan personal untuk makanan 2"
  ]
}`;
    }

    // Health check untuk AI service
    async healthCheck() {
        try {
            const completion = await this.openai.chat.completions.create({
                model: DEFAULT_CONFIG.MODEL,
                messages: [{ "role": "user", "content": "test" }],
                max_tokens: 5
            });
            
            return {
                status: 'healthy',
                model: DEFAULT_CONFIG.MODEL,
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
}