import { PrismaClient } from "@prisma/client";
import { passwordExtension } from "@/prisma/extensions/password";
import { AuthenticateRequest, generateAccessToken, generateRefreshToken } from "../auth/lib/jwt";
import { NextResponse, NextRequest } from "next/server";

const db = new PrismaClient().$extends(passwordExtension);


export async function GET(request: NextRequest) {
  try {
    const authentication = await AuthenticateRequest(request);
    if (authentication.error) {
      return NextResponse.json({
        error: authentication.error
      }, { status: 401 })
    }
    else {
      const data = await db.task.findMany({
        where: {
          userId: authentication.userId as number,
        },
      });

      return NextResponse.json({
        data
      }, { status: 200 });

    }
  } finally {
    await db.$disconnect();
  }
};