import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { handleApiException } from "../../lib/error";
import { passwordExtension } from "@/prisma/extensions/password";
import { existsExtension } from "@/prisma/extensions/exists";
import { schema, type } from "./schema";
import { ValidationException } from "../../lib/error";
import { RegisterEmailExistsError } from "../../lib/auth/errors";
import { parseValidationIssues } from "../../lib/validation";

const db = new PrismaClient().$extends(passwordExtension).$extends(existsExtension);


export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as { email: string, password: string, name: string };
        const validation = schema.safeParse(body)
        if (!validation.success) {
            throw new ValidationException(parseValidationIssues(validation));
        }

        if (await db.user.exists({ email: body.email })) {
            throw new RegisterEmailExistsError
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

