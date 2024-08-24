import { Secret, sign, verify, VerifyErrors } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { NextRequest } from 'next/server';

const DEFAULT_IP = "::::";

const AuthErrors = {
    InvalidToken: {
        message: "Invalid access token provided",
        code: "t1"
    },
    ExpiredToken: {
        message: "Provided access token has expired",
        code: "t2"
    },
    MissingToken: {
        message: "No access token provided",
        code: "t3"
    },
    GenericError: {
        message: "An error occurred while authenticating the request",
        code: "t4"
    },
    Unauthorized: {
        message: "Unauthorized access",
        code: "t5"
    },
}

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
    } catch (error) {
        // Handle error when body is empty or not in JSON format
        return null;
    }
}

const getRefreshToken = async (request: NextRequest) => {
    try {
        const body = await request.json() as { refreshtoken: string } | null;
        return body?.refreshtoken ?? await request.cookies.get('refreshtoken')?.value ?? null;
    } catch (error) {
        // Handle error when body is empty or not in JSON format
        return null;
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
    return await validateAccessToken(accessToken);
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
                    error: AuthErrors.Unauthorized
                }
            }
        }

    }
}

async function validateAccessToken(accessToken: string): Promise<{ userId: number | null, expiresAt: number | null, error: Object | boolean }> {
    // @ts-ignore
    const [validation, ok] = await getPayload(accessToken);

    if (ok) {
        return {
            userId: validation?.sub,
            expiresAt: validation?.exp,
            error: false
        }
    }
    else {
        let authData = AuthErrors.GenericError;
        if (validation.name === 'TokenExpiredError') {
            authData = AuthErrors.ExpiredToken
        }
        else if (validation.name === 'JsonWebTokenError') {
            if (validation.message === 'jwt must be provided') {
                authData = AuthErrors.MissingToken
            }
            else {
                authData = AuthErrors.InvalidToken
            }
        }
        return {
            userId: null,
            expiresAt: null,
            error: authData
        }
    }
}

async function validateRefreshToken(refreshToken: string): Promise<{ userId: number | null, ip: string | null, expiresAt: number | null, error: Object | boolean }> {
    // @ts-ignore
    const [validation, ok] = await getPayload(refreshToken);

    if (ok) {
        return {
            userId: validation?.sub,
            ip: validation?.ip,
            expiresAt: validation?.exp,
            error: false
        }
    }
    else {
        let authError = AuthErrors.GenericError;
        if (validation.name === 'TokenExpiredError') {
            authError = AuthErrors.ExpiredToken
        }
        else if (validation.name === 'JsonWebTokenError') {
            if (validation.message === 'jwt must be provided') {
                authError = AuthErrors.MissingToken
            }
            else {
                authError = AuthErrors.InvalidToken
            }
        }
        return {
            userId: null,
            expiresAt: null,
            ip: null,
            error: authError
        }
    }
}