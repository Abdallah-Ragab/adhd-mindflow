import { NextRequest, NextResponse } from "next/server";
import { AuthorizeRefreshToken, generateAccessToken } from "@/app/api/auth/lib/jwt";

export async function POST(request: NextRequest) {
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
        const newAccessToken = generateAccessToken(refreshTokenAuthorization?.userId as number);
        const response = NextResponse.json({
            accesstoken: newAccessToken,
        }, { status: 200 });
        response.cookies.set('accesstoken', newAccessToken, { httpOnly: false, path: '/', sameSite: 'strict', });
        return response;

    }
}