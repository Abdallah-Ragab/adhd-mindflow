import { Secret, sign, verify, VerifyErrors } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { NextRequest } from 'next/server';

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
    }
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

export const getRefreshTokenExpiry = async (refreshToken: string) : Promise<number|null> => {
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
    return await request.headers.get('Authorization')?.split(' ')[1] ?? await request.cookies.get('accesstoken')?.value;
}

const getIP = async (request: NextRequest) => {
    return await request.ip || await request.headers.get('x-forwarded-for') || await request.headers.get('x-real-ip') || "::::";
}

const getPayload = async (token: string) => {
    return await verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
        return err ? [err, false] : [decoded, true];
    });
}

export const AuthenticateRequest = async (request: NextRequest) => {
    const accessToken = await getAccessToken(request);
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
