import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { extractRefreshToken } from "@/app/api/lib/request";
import { revokeRefreshToken } from "@/app/api/lib/auth";
import { handleApiException } from "@/app/api/lib/error";
import { MissingTokenError } from "../../lib/jwt/errors";

const db = new PrismaClient();

export async function GET(request: NextRequest) {
    return await logout(request)
}
export async function POST(request: NextRequest) {
    return await logout(request)
}

async function logout(request: NextRequest) {
    try {
        const refreshToken = await extractRefreshToken(request);
        if (!refreshToken) throw new MissingTokenError;

        const response = NextResponse.json({
            message: 'Successfully Logged out',
        }, { status: 200 });

        await revokeRefreshToken(refreshToken);

        response.cookies.set('accesstoken', '', { httpOnly: false, sameSite: 'strict' });
        response.cookies.set('refreshtoken', '', { httpOnly: true, sameSite: 'strict' });

        return response;
    } catch (err: Error | any) {
        handleApiException(err);
    }
    finally {
        await db.$disconnect();
    }
}