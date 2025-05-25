import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

export const insertManyData = async () => {
  try {
    const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    const foodData = Array.isArray(data) ? data : [data];

    const result = await prisma.food.createMany({
      data: foodData,
    });

    console.log(`Inserted ${result.count} documents`);
  } catch (error) {
    console.error("Insert failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};
