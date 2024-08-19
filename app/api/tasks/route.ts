import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET(request: Request) {
  console.log(request);
  try {
    const tasks = await db.task.findMany({
    });
    return Response.json(tasks);
  } finally {
    await db.$disconnect();
  }
};
