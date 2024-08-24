import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from "@/app/api/auth/lib/jwt";
import { PrismaClient } from "@prisma/client";
import { passwordExtension } from "@/prisma/extensions/password";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient().$extends(passwordExtension);

export async function POST(request: NextRequest) {
    // @ts-ignore
    const data = await request.json()
    const email = data?.email;
    const password = data?.password;

    if (!email || !password) {
        return NextResponse.json({
            error: {
                message: 'Invalid request: Please provide a valid email and password',
            }
        }, { status: 400 });
    }

    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return NextResponse.json({
            error: {
                message: 'Unauthorized: Email does not exist',
            }
        }, { status: 401 });
    }

    const passwordsMatch = user.verifyPassword(password);

    if (!passwordsMatch) {
        return NextResponse.json({
            error: {
                message: 'Unauthorized: Invalid password',
            }
        }, { status: 401 });
    }
    else {
        const accessToken = generateAccessToken(user.id);
        const refreshToken = await generateRefreshToken(user, request);
        const refreshTokenExpiry = await getRefreshTokenExpiry(refreshToken) as number * 1000;
        const response = NextResponse.json({
            accesstoken: accessToken,
            refreshtoken: refreshToken,
        }, { status: 200 })

        response.cookies.set('accesstoken', accessToken, { httpOnly: false, path: '/', sameSite: 'strict', });
        response.cookies.set('refreshtoken', refreshToken, { httpOnly: true, path: '/', sameSite: 'strict', expires: refreshTokenExpiry as number });;

        return response;
    }
}