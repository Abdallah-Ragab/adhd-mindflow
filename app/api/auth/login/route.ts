import { PrismaClient } from "@prisma/client";
import { passwordExtension } from "@/prisma/extensions/password";
import { NextRequest, NextResponse } from "next/server";
import { handleApiException, ValidationException } from "@/app/api/lib/error";
import { generateAccessToken, generateRefreshToken } from "@/app/api/lib/auth";
import { getTokenExp } from "@/app/api/lib/jwt";
import { schema } from "./schema";
import { parseValidationIssues } from "../../lib/validation";
import { LoginPasswordIncorrectError, LoginUserDoesNotExistError } from "../../lib/auth/errors";
import { existsExtension } from "@/prisma/extensions/exists";
import { InvalidJsonError } from "../../lib/validation/errors";
import type { User } from "@prisma/client";

const db = new PrismaClient().$extends(passwordExtension).$extends(existsExtension);
const DEBUG = (process.env.NODE_ENV ?? "") === 'development';

export async function POST(request: NextRequest) {
    try {
        let data
        try {
            data = await request.json()
        }
        catch (SyntaxError) {
            throw new InvalidJsonError
        }
        const validation = schema.safeParse(data);

        if (!validation.success) {
            throw new ValidationException(parseValidationIssues(validation));
        }
        // @ts-ignore
        const user: User & { verifyPassword: Function } = await db.user.existsOrNull({ email: validation.data.email });
        if (!user) throw new LoginUserDoesNotExistError

        const passwordsMatch = user.verifyPassword(validation.data.password);

        if (!passwordsMatch) throw new LoginPasswordIncorrectError

        const accessToken = generateAccessToken(user.id, "10s");
        const refreshToken = await generateRefreshToken(user, request);
        const refreshTokenExpiry = await getTokenExp(refreshToken) as number * 1000;

        const response = NextResponse.json({
            accesstoken: accessToken,
            refreshtoken: refreshToken,
        }, { status: 200 })

        // TODO: Limit refresh token to /api/auth/token route
        response.cookies.set('accesstoken', accessToken, { httpOnly: false, path: '/', sameSite: 'strict', });
        response.cookies.set('refreshtoken', refreshToken, { httpOnly: true, sameSite: 'strict', expires: refreshTokenExpiry as number });;

        return response;

    } catch (err: Error | any) {
        return handleApiException(err);
    }
    finally {
        await db.$disconnect();
    }
}
