import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { handleError, parseServerError } from "../../lib/error";
import { passwordExtension } from "@/prisma/extensions/password";
import { ApiError } from "next/dist/server/api-utils";
import { existsExtension } from "@/prisma/extensions/exists";

const db = new PrismaClient().$extends(passwordExtension).$extends(existsExtension);

// TODO: Add validation for email, password, and name
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { email: string, password: string, name: string };
        if (!body.email || !body.password || !body.name) {
            throw new ApiError(400, 'Invalid request: Please provide a valid email, password, and name');
        }
        else {
            if (await db.user.exists({ email: body.email })) {
                throw new ApiError(400, 'Email already exists');
            }
            const user = await db.user.create({
                data: {
                    email: body.email,
                    password: body.password,
                    name: body.name
                }
            });
            return NextResponse.json({
                message: 'User created successfully',
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    }
                }
            }, { status: 201 });
        }
    } catch (err: Error | any) {
        // TODO: rewrite error handling using ApiError 
        return handleError(err);
    }
    finally {
        await db.$disconnect();
    }
}

