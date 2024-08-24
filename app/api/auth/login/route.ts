import { generateAccessToken } from "@/app/api/auth/lib/jwt";
import { PrismaClient } from "@prisma/client";
import { hashPassword, passwordExtension } from "@/prisma/extensions/password";
import { NextApiRequest } from "next";

const db = new PrismaClient().$extends(passwordExtension);

export async function POST(request: NextApiRequest) {
    // @ts-ignore
    const data = await request.json()
    const email = data?.email;
    const password = data?.password;

    if (!email || !password) {
        return Response.json({
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
        return Response.json({
            error: {
                message: 'Unauthorized: Email does not exist',
            }
        }, { status: 401 });
    }

    const passwordsMatch = user.verifyPassword(password);

    if (!passwordsMatch) {
        return Response.json({
            error: {
                message: 'Unauthorized: Invalid password',
            }
        }, { status: 401 });
    }
    else {
        const token = generateAccessToken(user.id);
        const response = Response.json({
            accesstoken: token,
        }, { status: 200, headers: { 'set-cookie': `accesstoken=${token}; Path=/; SameSite=Strict;` } });
        return response;
    }
}