import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import prisma from "../utils/prisma.config";

export const getRekomenFood = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { mood } = req.params;

        const moods = toTitleCase(mood)
        const data = await prisma.mood.findFirst({
        where: { mood: moods },
        select: {
            id: true,
            mood: true,
            history: true,
            rekomendasiMakanan: true
        },
        });

        if (!data) {
        errorRes(res, 404, "Pengguna tidak ditemukan");
        return;
        }

        successRes(res, 200, data, "Data pengguna ditemukan");
    } catch (e: any) {
        console.error("Error in getUserByEmail:", e);
        errorRes(res, 500, "Terjadi kesalahan pada server", e.message);
    }
};

const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};