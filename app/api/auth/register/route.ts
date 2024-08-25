import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { parseServerError } from "../../lib/error";
import { passwordExtension } from "@/prisma/extensions/password";
import { ApiError } from "next/dist/server/api-utils";

const db = new PrismaClient().$extends(passwordExtension);
const DEBUG = (process.env.NODE_ENV ?? "") === 'development';

// TODO: Add validation for email, password, and name
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { email: string, password: string, name: string };
        if (!body.email || !body.password || !body.name) {
            throw new ApiError(400, 'Invalid request: Please provide a valid email, password and name');
        }
        else
        {
            const user = await db.user.create({
                data: {
                    email: body.email,
                    password: body.password,
                    name: body.name
                }
            });
            return NextResponse.json({
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    }
                }
            }, { status: 201 });
        }
    } catch (err: any) {
        // TODO: rewrite error handling using ApiError 
        if (DEBUG) {
            console.error(`Caught ${typeof err} @${__filename}: ` + err.message);
        }
        if (err instanceof ApiError) {
            return NextResponse.json({
                error: {
                    message: err.message,
                }
            }, { status: err.statusCode });
        }
        return NextResponse.json({
            ...parseServerError(err)
        }, { status: 500 });
    }
    finally {
        await db.$disconnect();
    }
}