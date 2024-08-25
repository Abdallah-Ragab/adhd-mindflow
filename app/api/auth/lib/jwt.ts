import { Secret, sign, verify, VerifyErrors } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import { parseServerError } from "@/app/api/lib/helpers";
import { PrismaClient } from "@prisma/client";
import errors from '@/app/api/lib/error/codes'

const DEBUG = ((process.env.NODE_ENV ?? '') === 'development');
const DEFAULT_IP = "::::";
const db = new PrismaClient()


export const generateAccessToken = (userId: number, duration: string = '1h') => {
    return sign(
        { 'sub': userId },
        process.env.JWT_SECRET as Secret,
        { expiresIn: duration }
    )
}

export const generateRefreshToken = async (user: User, request: NextRequest) => {
    const ip = await getIP(request);
    return sign(
        { 'sub': user.id, 'ip': ip },
        process.env.JWT_SECRET as Secret,
        { expiresIn: '7d' }
    )
}

export const getRefreshTokenExpiry = async (refreshToken: string): Promise<number | null> => {
    // @ts-ignore
    const [payload, ok] = await getPayload(refreshToken);

    if (ok) {
        return payload.exp;
    }
    else {
        return null;
    }
}

const getAccessToken = async (request: NextRequest) => {
    try {
        const authorizationHeader = request.headers.get('Authorization');
        if (authorizationHeader) {
            const accessToken = authorizationHeader.split(' ')[1];
            return accessToken;
        } else {
            const cookie = await request.cookies.get('accesstoken');
            return cookie?.value ?? null;
        }
    } catch (err: Error | any) {
        if (DEBUG) {
            console.error("Caught Error: " + err.message);
        }
        // Handle error when body is empty or not in JSON format
        return null;
    }
}

export const getRefreshToken = async (request: NextRequest) => {
    try {
        const body = await request.json() as { refreshtoken: string } | null;
        if (!body?.refreshtoken) { throw new Error('No refresh token provided') }
        else {
            return body?.refreshtoken
        }
    } catch (err: Error | any ) {
        if (DEBUG) {
            console.error("Caught Error: " + err.message);
        }
        return await request.cookies.get('refreshtoken')?.value ?? null;
    }
}

const getIP = async (request: NextRequest) => {
    return await request.ip || await request.headers.get('x-forwarded-for') || await request.headers.get('x-real-ip') || DEFAULT_IP;
}

const getPayload = async (token: string) => {
    return await verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
        return err ? [err, false] : [decoded, true];
    });
}

export const AuthenticateRequest = async (request: NextRequest) => {
    const accessToken = await getAccessToken(request) ?? '';
    const validation = await validateAccessToken(accessToken);
    const userExists = await isUserActive(validation.userId as number);

    if (!validation.error && !userExists) {
        return {
            userId: validation.userId,
            error: errors.auth.UserDoesNotExist
        }
    }
    return validation;
}

export const AuthorizeRefreshToken = async (request: NextRequest) => {
    const refreshToken = await getRefreshToken(request) ?? '';
    const validation = await validateRefreshToken(refreshToken);
    if (!validation.error) {
        if (validation.ip && validation.ip !== DEFAULT_IP) {
            const IPMatch = (await getIP(request)) === validation.ip;
            if (IPMatch) {
                return validation;
            }
            else {
                return {
                    userId: null,
                    ip: null,
                    expiresAt: null,
                    error: errors.auth.Unauthorized
                }
            }
        }
        if (!isUserActive(validation.userId as number)) {
            return {
                userId: validation.userId,
                error: errors.auth.UserDoesNotExist
            }
        }
    }

    return validation;
}

async function validateAccessToken(accessToken: string): Promise<{ userId: number | null, expiresAt: number | null, error: Object | boolean }> {
    // @ts-ignore
    const [payload, ok] = await getPayload(accessToken);

    if (ok) {
        return {
            userId: payload?.sub,
            expiresAt: payload?.exp,
            error: false
        }
    }
    else {
        return parseJWTError(payload)
    }
}

async function validateRefreshToken(refreshToken: string): Promise<{ userId: number | null, ip: string | null, expiresAt: number | null, error: Object | boolean }> {
    // @ts-ignore
    const [payload, ok] = await getPayload(refreshToken);

    if (ok) {
        return {
            userId: payload?.sub,
            ip: payload?.ip,
            expiresAt: payload?.exp,
            error: false
        }
    }
    else {
        return parseJWTError(payload);
    }
}

const parseJWTError = function (payload: VerifyErrors | any) {
    let authError = errors.auth.GenericError;
    if (payload.name === 'TokenExpiredError') {
        authError = errors.auth.ExpiredToken
    }
    else if (payload.name === 'JsonWebTokenError') {
        if (payload.message === 'jwt must be provided') {
            authError = errors.auth.MissingToken
        }
        else {
            authError = errors.auth.InvalidToken
        }
    }
    return {
        userId: null,
        expiresAt: null,
        ip: null,
        error: authError
    }
}

export async function revokeRefreshToken(refreshToken: string): Promise<{ error: any }> {
    try {
        // @ts-ignore
        const [payload, ok] = await getPayload(refreshToken);
        const signature = refreshToken.split('.')[2];

        if (ok) {
            const userID = payload.sub;
            const alreadyProvoked = await db.revokedToken.findUnique({
                where: {
                    signature: signature,
                    userId: userID
                }
            })
            if (!alreadyProvoked) {
                await db.revokedToken.create({
                    data: {
                        signature: signature,
                        userId: userID
                    }
                });
            }
            return {
                error: false
            };
        } else {
            console.log(payload)
            return parseJWTError(payload);
        }
    } catch (err: Error | any) {
        if (DEBUG) {
            console.error("Caught Error: " + err.message);
        }
        return parseServerError(err);
    }
}

export async function isRefreshTokenRevoked(refreshToken: string): Promise<boolean | Object> {
    try {
        const signature = refreshToken.split('.')[2];
        const revoked = await db.revokedToken.findFirst({
            where: {
                signature: signature
            }
        })
        return revoked ? true : false;
    } catch (err: Error | any) {
        if (DEBUG) {
            console.error("Caught Error: " + err.message);
        }
        return parseServerError(err)
    }
}

export async function isUserActive(userId: number): Promise<boolean | Object> {
    try {
        const revoked = await db.revokedToken.findFirst({
            where: {
                userId: userId
            }
        })
        return revoked ? true : false;
    } catch (err: Error | any) {
        if (DEBUG) {
            console.error("Caught Error: " + err.message);
        }
        return parseServerError(err)
    }
}