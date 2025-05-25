import { v4 } from 'uuid';
import { NextFunction, Request, Response } from "express";
import { errorRes, successRes } from "../utils/response";
import bcrypt from 'bcrypt'
import prisma from '../utils/prisma.config';

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> =>{
    try{
        const { email, password, username } = req.body
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!isValidEmail(email)) {
            errorRes(res, 400, "Format email tidak valid");
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            errorRes(res, 409, 'Email sudah terdaftar');
            return;
        }

        const data = await prisma.user.create({
            data:{
                email,
                username,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                password: true,
                username: true
            }
        })

        successRes(res, 200, { data }, "  successful");
    } catch (e: any) {
        console.error("Error in :", e);
        errorRes(res, 500, "Error ", e.message);
    }
}

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!isValidEmail(email)) {
        errorRes(res, 400, "Format email tidak valid");
        return;
        }

        const data = await prisma.user.findUnique({
        where: { email },
        });

        if (!data) {
        errorRes(res, 404, "Pengguna tidak ditemukan");
        return;
        }

        const isPasswordValid = await bcrypt.compare(password, data.password);
        if (!isPasswordValid) {
        errorRes(res, 401, "Kata sandi salah");
        return;
        }

        successRes(res, 200, data, "Login berhasil");
    } catch (e: any) {
        console.error("Error in loginUser:", e);
        errorRes(res, 500, "Terjadi kesalahan pada server", e.message);
    }
};

export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;

        const data = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            username: true,
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

export const getUserByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email } = req.params;

        if (!isValidEmail(email)) {
        errorRes(res, 400, "Format email tidak valid");
        return;
        }

        const data = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            username: true,
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
