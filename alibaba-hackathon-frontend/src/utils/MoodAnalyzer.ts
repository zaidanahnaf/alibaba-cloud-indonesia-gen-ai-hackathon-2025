import type { MoodResult } from "./Modals";

// utils/moodAnalyzer.ts
export const getMoodAnalysis = (input: string): MoodResult => {
    const lowerInput = input.toLowerCase();
    
    const moodPatterns = [
      {
        keywords: ['sedih', 'down', 'galau', 'patah hati'],
        mood: 'Sedih',
        recommendation: 'Es Krim Coklat & Brownies',
        reason: 'Makanan manis dapat meningkatkan produksi serotonin yang membuat mood lebih baik'
      },
      {
        keywords: ['senang', 'happy', 'gembira', 'bahagia'],
        mood: 'Senang',
        recommendation: 'Pizza & Minuman Soda',
        reason: 'Saat senang, makanan yang fun dan bisa dibagi cocok untuk merayakan kebahagiaan'
      },
      {
        keywords: ['stress', 'capek', 'lelah', 'penat'],
        mood: 'Stress',
        recommendation: 'Teh Hangat & Cookies',
        reason: 'Teh hangat memiliki efek menenangkan dan cookies memberikan comfort food yang dibutuhkan'
      },
      {
        keywords: ['bosan', 'jenuh', 'monoton'],
        mood: 'Bosan',
        recommendation: 'Makanan Pedas & Keripik',
        reason: 'Makanan dengan rasa kuat dapat memberikan stimulasi sensori yang menghilangkan kebosanan'
      }
    ];
  
    const matchedPattern = moodPatterns.find(pattern =>
      pattern.keywords.some(keyword => lowerInput.includes(keyword))
    );
  
    return matchedPattern || {
      mood: 'Netral',
      recommendation: 'Smoothie Bowl & Granola',
      reason: 'Makanan sehat dan segar cocok untuk menjaga keseimbangan mood harian'
    };
  };
  