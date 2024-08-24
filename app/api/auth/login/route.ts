import { generateAccessToken } from "@/app/api/auth/lib/jwt";
import { PrismaClient } from "@prisma/client";
import { hashPassword, passwordExtension } from "@/prisma/extensions/password";
import { NextApiRequest } from "next";
import { hash } from "crypto";

const db = new PrismaClient().$extends(passwordExtension);

export async function POST(request: NextApiRequest) {
    // @ts-ignore
    const data = await request.json()
    if (!data) {
        return Response.json({
            message: 'Invalid request',
        });
    }
    const email = data.email;
    const password = data.password;

    const user = await db.user.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        return Response.json({
            message: 'User not found',
        });
    }

    const match = user.verifyPassword(password);
    if (!match) {
        return Response.json({
            message: 'Invalid password',
            input: hashPassword(password),
            password: user.password,
        });
    }
    else {
        const token = generateAccessToken(user.id);
        const response = Response.json({
            message: 'Success',
            token,
        });
        response.headers.set('set-cookie', `accesstoken=${token}; Path=/; SameSite=Strict;`);
        return response;
    }
}