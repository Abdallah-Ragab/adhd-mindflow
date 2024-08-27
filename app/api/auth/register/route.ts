import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { handleApiException } from "../../lib/error";
import { passwordExtension } from "@/prisma/extensions/password";
import { ApiError } from "next/dist/server/api-utils";
import { existsExtension } from "@/prisma/extensions/exists";
import { registerSchema } from "./schema";
import { ValidationException } from "../../lib/error";
import { EmailExistsError } from "../../lib/auth/errors";

const db = new PrismaClient().$extends(passwordExtension).$extends(existsExtension);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { email: string, password: string, name: string };
        const validation = registerSchema.safeParse(body)

        if (!validation.success) {
            const issues: { [key: string]: string[] } = {}
            validation.error.issues.forEach(issue => {
                const field = issue.path[0]
                const message = issue.message

                if (issues[field]) {
                    issues[field].push(message)
                } else {
                    issues[field] = [message]
                }
            })
            throw new ValidationException(issues);
        }

        if (await db.user.exists({ email: body.email })) {
            throw new EmailExistsError
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

    } catch (err: Error | any) {
        return handleApiException(err);
    }
    finally {
        await db.$disconnect();
    }
}

