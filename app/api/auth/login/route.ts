import { PrismaClient } from "@prisma/client";
import { passwordExtension } from "@/prisma/extensions/password";
import { NextRequest, NextResponse } from "next/server";
import { parseServerError } from "@/app/api/lib/error";
import { generateAccessToken, generateRefreshToken } from "@/app/api/lib/auth";
import { getTokenExp } from "@/app/api/lib/jwt";

const db = new PrismaClient().$extends(passwordExtension);
const DEBUG = (process.env.NODE_ENV ?? "") === 'development';

export async function POST(request: NextRequest) {
    try {
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
            const accessToken = generateAccessToken(user.id, "10s");
            const refreshToken = await generateRefreshToken(user, request);
            const refreshTokenExpiry = await getTokenExp(refreshToken) as number * 1000;
            const response = NextResponse.json({
                accesstoken: accessToken,
                refreshtoken: refreshToken,
            }, { status: 200 })
            // TODO: Limit refresh token to /api/auth/token route
            response.cookies.set('accesstoken', accessToken, { httpOnly: false, path: '/', sameSite: 'strict', });
            response.cookies.set('refreshtoken', refreshToken, { httpOnly: true,  sameSite: 'strict', expires: refreshTokenExpiry as number });;

            return response;
        }
    } catch (err: Error | any) {
        if (DEBUG) {
            console.error("Caught Error: " + err.message);
        }
        return NextResponse.json({
            ...parseServerError(err)
        }, { status: 500 });
    }
    finally {
        await db.$disconnect();
    }
}