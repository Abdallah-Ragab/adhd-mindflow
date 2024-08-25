import { PrismaClient } from "@prisma/client";
import { passwordExtension } from "@/prisma/extensions/password";
import { NextResponse, NextRequest } from "next/server";
import { parseServerError } from "@/app/api/lib/error";
import { AuthenticateRequest } from "@/app/api/lib/auth";

const DEBUG = (process.env.NODE_ENV ?? "") === 'development';
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
  } catch (err: Error | any) {
    if (DEBUG) {
      console.error("Caught Error: " + err.message);
  }
    return NextResponse.json({
      ...parseServerError(err)
    }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
};