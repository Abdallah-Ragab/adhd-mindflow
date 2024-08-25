import { NextRequest, NextResponse } from "next/server";
import { AuthorizeRefreshToken, generateAccessToken } from "@/app/api/lib/auth";
import { parseServerError } from "@/app/api/lib/error";

const DEBUG = (process.env.NODE_ENV ?? "") === 'development';

export async function POST(request: NextRequest) {
    try {
        const refreshTokenAuthorization = await AuthorizeRefreshToken(request);
        if (!refreshTokenAuthorization) {
            // @ts-ignore
            return NextRequest.json({
                error: {
                    message: "Server error: Unable to authorize refresh token",
                }
            }, { status: 500 });
        }
        if (refreshTokenAuthorization.error) {
            return NextResponse.json({
                error: refreshTokenAuthorization.error,
            }, { status: 401 });
        }
        else {
            if (!refreshTokenAuthorization.hasOwnProperty('userId')) {
                return NextResponse.json({
                    error: {
                        message: "Server error: Unable to retrieve user ID from refresh token. try logging in again",
                    }
                }, { status: 500 });
            } else {
                const newAccessToken = generateAccessToken((refreshTokenAuthorization as {userId:number}).userId);
                const response = NextResponse.json({
                    accesstoken: newAccessToken,
                }, { status: 200 });
                response.cookies.set('accesstoken', newAccessToken, { httpOnly: false, path: '/', sameSite: 'strict', });
                return response;
            }
        }
    } catch (err: Error | any) {
        if (DEBUG) {
            console.error("Caught Error: " + err.message);
        }
        return NextResponse.json({
            ...parseServerError(err)
        }, { status: 500 });
    }
}