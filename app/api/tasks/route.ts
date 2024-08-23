import { PrismaClient } from "@prisma/client";
import { passwordExtension } from "@/prisma/extensions/password";

const db = new PrismaClient().$extends(passwordExtension);

export async function GET(request: Request) {
  try {
    const tasks = await db.task.findMany();
    return Response.json(tasks);
  } finally {
    await db.$disconnect();
  }
};