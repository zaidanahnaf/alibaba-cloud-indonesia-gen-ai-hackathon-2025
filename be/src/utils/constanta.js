// src/utils/constants.js

export const VALID_MOODS = ['senang', 'sedih', 'stress', 'bosan'];

export const MOOD_KEYWORDS = {
    stress: ['stress', 'tegang', 'deadline', 'kerja', 'tugas', 'tekanan', 'capek', 'lelah', 'overtime'],
    sedih: ['sedih', 'kecewa', 'putus', 'galau', 'down', 'hancur', 'patah hati', 'nangis'],
    bosan: ['bosan', 'jenuh', 'monoton', 'gitu-gitu aja', 'pengen yang beda', 'gabut', 'males'],
    senang: ['senang', 'bahagia', 'gembira', 'excited', 'antusias', 'happy', 'seru', 'asik']
};

export const CONTEXT_KEYWORDS = {
    stress: ['atasan', 'boss', 'meeting', 'laporan', 'ujian', 'macet', 'telat', 'lembur'],
    sedih: ['mantan', 'ditolak', 'gagal', 'hujan', 'sendiri', 'sepi'],
    bosan: ['libur', 'weekend', 'dirumah', 'netflix', 'tidur', 'kosong'],
    senang: ['liburan', 'gajian', 'ultah', 'lulus', 'hadiah', 'menang', 'berhasil']
};

export const MOOD_PRIORITY = ['stress', 'sedih', 'bosan', 'senang'];

export const KEYWORD_WEIGHTS = {
    DIRECT: 2,
    CONTEXTUAL: 1
};

export const NEGATIVE_WORDS = ['tidak', 'nggak', 'gak', 'susah', 'sulit', 'masalah', 'ribet'];
export const POSITIVE_WORDS = ['bagus', 'keren', 'mantap', 'oke', 'baik', 'sip'];

export const DEFAULT_CONFIG = {
    LIMIT: 5,
    MIN_INPUT_LENGTH: 5,
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7,
    MODEL: "qwen-max"
};