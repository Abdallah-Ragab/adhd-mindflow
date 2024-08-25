import { NextRequest, NextResponse } from "next/server";
import { passwordExtension } from "@/prisma/extensions/password";
import { PrismaClient } from "@prisma/client";
import { extractRefreshToken } from "@/app/api/lib/request";
import { revokeRefreshToken } from "@/app/api/lib/auth";
import { parseServerError } from "@/app/api/lib/error";

const DEBUG = (process.env.NODE_ENV ?? "") === 'development';
const db = new PrismaClient().$extends(passwordExtension);


export async function GET(request: NextRequest) {
    return await logout(request)
}
export async function POST(request: NextRequest) {
    return await logout(request)
}

async function logout (request: NextRequest) {
    try {
        let response
        const refreshToken = await extractRefreshToken(request);
        const revoked = await revokeRefreshToken(refreshToken ?? '');
        console.log(refreshToken)
        console.log(revoked)

        if (!revoked.error) {
            response = NextResponse.json({
                message: 'Successfully Logged out',
            }, { status: 200 })
        }
        else {
            response = NextResponse.json({
                error: revoked.error,
            }, { status: 400 })
        }

        response.cookies.set('accesstoken', '', { httpOnly: false, sameSite: 'strict' });
        response.cookies.set('refreshtoken', '', { httpOnly: true, sameSite: 'strict' });

        return response;
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