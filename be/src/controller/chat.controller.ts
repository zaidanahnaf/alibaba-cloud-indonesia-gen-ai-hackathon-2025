import { NextFunction, Request, Response } from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { errorRes, successRes } from '../utils/response';
import prisma from '../utils/prisma.config';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
});

export const sendMessage = async (req: Request, res: Response):  Promise<void> =>  {
  const { message, creatorId, mood, recomendation, reason, } = req.body;

  if (!message) {
    errorRes(res, 400, "Message is required")
    return
  }
  if (!creatorId) {
    errorRes(res, 400, "Creator is required")
    return
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "qwen1.5-14b-chat",
        messages: [{"role":"system","content":"Kamu adalah konselor makanan yang membantu pengguna berdasarkan kondisi emosinya.\\n\\nBerikut adalah curhat pengguna:\\n\"{input}\"\\n\\nTugas kamu:\\n1. Deteksi mood/emosi pengguna.\\n2. Rekomendasikan makanan/minuman yang cocok untuk kondisi tersebut.\\n3. Jelaskan alasannya secara singkat.\\n\\nFormat output:\\nMood: ...\\nRekomendasi Makanan: ...\\nAlasan: ..."},
            {"role":"user","content":"\\nAku ngerasa kosong dan nggak punya semangat, semuanya terasa berat."},
            {"role":"assistant","content":"Mood: Stres dan lelah\\n\\nRekomendasi Makanan: Makanan yang tinggi serat dan protein seperti nasi merah dengan ayam panggang, telur rebus, dan sayuran segar. Kombinasi ini akan memberikan energi lebih baik serta membantu menjaga rasa kenyang yang lebih lama.\\n\\nAlasan: Serat dalam nasi merah akan memberikan nutrisi yang stabil dan membantu menghindari perasaan cepat lapar, sementara protein dari ayam dan telur akan meningkatkan energi dan memperbaiki suasana hati secara kimiawi. Sayuran segar juga akan memberikan vitamin dan antioksidan untuk memulihkan stamina."},
            {"role":"user","content":"What can you do next?"}],
        top_p: 0.9,
        temperature: 0.7

    });

    const reply = completion.choices[0]?.message?.content || 'No response from AI.';

    const data = {
        message,
        reply,
        creatorId,
        mood,
        recomendation,
        reason,
    }

    await prisma.chat.create({
        data,
        select: {
            creatorId : true,
            message: true,
            mood: true,
            reason: true,
            recomendation: true,
            reply: true,
        }
    })

    successRes(res, 200, data)
  } catch (error) {
    console.error('OpenAI Error:', error);
    errorRes(res, 500, "Failed to get response from AI")
  }
};

export const getChatByCreator = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { creatorId } = req.params;

        const data = await prisma.chat.findFirst({
        where: { creatorId },
        select: {
            creatorId: true,
            message: true,
            id: true,
            reply: true,
            createdAt: true
        },
        });

        if (!data) {
        errorRes(res, 404, "Chat tidak ditemukan");
        return;
        }

        successRes(res, 200, data, "Data chat ditemukan");
    } catch (e: any) {
        console.error("Error in getChatByCreator:", e);
        errorRes(res, 500, "Terjadi kesalahan pada server", e.message);
    }
};

export const getChatById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const data = await prisma.chat.findUnique({
        where: { id },
        select: {
            creatorId: true,
            message: true,
            id: true,
            reply: true,
            createdAt: true
        },
        });

        if (!data) {
        errorRes(res, 404, "Chat tidak ditemukan");
        return;
        }

        successRes(res, 200, data, "Data chat ditemukan");
    } catch (e: any) {
        console.error("Error in getChatById:", e);
        errorRes(res, 500, "Terjadi kesalahan pada server", e.message);
    }
};