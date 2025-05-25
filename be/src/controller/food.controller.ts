import { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma.config";
import { errorRes, successRes } from "../utils/response";

export const getFoodByMood = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { mood } = req.params;

        const moods = toTitleCase(mood)
        const data = await prisma.food.findFirst({
        where: { mood: moods },
        select: {
            id: true,
            tags: true,
            mood: true
        },
        });

        if (!data) {
        errorRes(res, 404, "Pengguna tidak ditemukan");
        return;
        }

        successRes(res, 200, data, "Data pengguna ditemukan");
    } catch (e: any) {
        console.error("Error in getUserById:", e);
        errorRes(res, 500, "Terjadi kesalahan pada server", e.message);
    }
};

export const getAllFood = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await prisma.food.findMany({
      select: {
        id: true,
        tags: true,
        mood: true,
        name: true,
        description: true,
      },
    });

    if (!data || data.length === 0) {
      errorRes(res, 404, "Data makanan tidak ditemukan");
      return;
    }

    successRes(res, 200, data, "Data makanan ditemukan");
  } catch (e: any) {
    console.error("Error in getAllFood:", e);
    errorRes(res, 500, "Terjadi kesalahan pada server", e.message);
  }
};

export const getDetailFood = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { food } = req.body;

        const foods = toTitleCase(food)
        const data = await prisma.food.findFirst({
        where: { name: foods },
        select: {
            id: true,
            tags: true,
            mood: true,
            name: true
        },
        });

        if (!data) {
        errorRes(res, 404, "Pengguna tidak ditemukan");
        return;
        }

        successRes(res, 200, data, "Data pengguna ditemukan");
    } catch (e: any) {
        console.error("Error in getUserById:", e);
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
