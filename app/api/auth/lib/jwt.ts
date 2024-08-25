import { Secret, sign, verify, VerifyErrors } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import { parseServerError } from "@/app/api/lib/helpers";
import { PrismaClient } from "@prisma/client";
import errors from '@/app/api/lib/error/codes'

const DEBUG = ((process.env.NODE_ENV ?? '') === 'development');
const DEFAULT_IP = "::::";
const db = new PrismaClient()


/**
 * Generates an access token for the given user ID with an optional duration.
 * @param {number} userId - The ID of the user for whom the token is generated.
 * @param {string} [duration='1h'] - The duration of the token validity (default is 1 hour).
 * @returns {string} The generated access token.
 */
export const generateAccessToken = (userId: number, duration: string = '1h') => {
    return sign(
        { 'sub': userId },
        process.env.JWT_SECRET as Secret,
        { expiresIn: duration }
    )
}

/**
 * Generates a refresh token for the given user and request.
 * @param {User} user - The user object for whom the token is generated.
 * @param {NextRequest} request - The request object containing information like IP address.
 * @returns {string} A refresh token signed with the JWT secret and containing user ID and IP address.
 */
export const generateRefreshToken = async (user: User, request: NextRequest) => {
    const ip = await getIP(request);
    return sign(
        { 'sub': user.id, 'ip': ip },
        process.env.JWT_SECRET as Secret,
        { expiresIn: '7d' }
    )
}

/**
 * Retrieves the expiry time of a refresh token.
 * @param {string} refreshToken - The refresh token to decode and extract expiry time from.
 * @returns {Promise<number | null>} A Promise that resolves to the expiry time of the refresh token, or null if an error occurs.
 */
export const getRefreshTokenExpiry = async (refreshToken: string): Promise<number | null> => {
    // @ts-ignore
    const decodedToken = await decodeToken(refreshToken) as { error: any, payload };
    if (!decodedToken.error) return decodedToken.payload?.exp;
    else return null;
}

/**
 * Retrieves the refresh token from the request object.
 * @param {NextRequest} request - The NextRequest object containing the request details.
 * @returns {Promise<string | null>} The refresh token extracted from the request or null if not found.
 */
export const getRefreshToken = async (request: NextRequest) => {
    try {
        const body = await request.json() as { refreshtoken: string } | null;
        if (!body?.refreshtoken) { throw new Error('No refresh token provided') }
        else {
            return body?.refreshtoken
        }
    } catch (err: Error | any) {
        if (DEBUG) {
            console.error("Caught Error: " + err.message);
        }
        return await request.cookies.get('refreshtoken')?.value ?? null;
    }
}

/**
 * Authenticates a request by validating the access token and checking if the user exists.
 * @param {NextRequest} request - The request object containing necessary information.
 * @returns {Promise<Object>} A promise that resolves to the validation result or an error object.
 */
export const AuthenticateRequest = async (request: NextRequest) => {
    const accessToken = await getAccessToken(request) ?? '';
    const validation = await validateAccessToken(accessToken);
    const userExists = await checkUserExistence(validation.userId as number);

    if (userExists.error) return userExists

    if (!userExists) return {
        userId: validation.userId,
        error: errors.auth.UserDoesNotExist
    }

    return validation;
}

/**
 * Authorize the refresh token provided in the request by checking (token validity, request's ip and token creator's ip match and user existence)
 * @param {NextRequest} request - The request object containing the refresh token.
 * @returns {Promise} A promise that resolves to the validation result of the refresh token.
 */
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
        const userExists = await checkUserExistence(validation.userId as number)
        if (userExists.error) return userExists

        if (!userExists) return {
            userId: validation.userId,
            error: errors.auth.UserDoesNotExist
        }
    }

    return validation;
}

/**
 * Retrieves the access token from the request object.
 * @param {NextRequest} request - The Next.js request object.
 * @returns {Promise<string | null>} The access token if found, otherwise null.
 */
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

/**
 * Asynchronously retrieves the IP address from the NextRequest object.
 * @param {NextRequest} request - The NextRequest object containing the request information.
 * @returns {Promise<string>} A promise that resolves to the IP address or a default IP if not found.
 */
const getIP = async (request: NextRequest) => {
    return await request.ip || await request.headers.get('x-forwarded-for') || await request.headers.get('x-real-ip') || DEFAULT_IP;
}

/**
 * Decodes a JWT token using the provided secret key.
 * @param {string} token - The JWT token to decode.
 * @returns {Promise<{ error: Error | null, payload: any }>} A promise that resolves to an object containing the error (if any) and the decoded payload.
 */
const decodeToken = async (token: string) => {
    return await verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
        return {
            error: err ?? null,
            payload: decoded
        }
    });
}

/**
 * Validates the access token by decoding it and checking for errors.
 * @param {string} accessToken - The access token to validate.
 * @returns {Promise<{ userId: number | null, expiresAt: number | null, error: Object | boolean }>} 
 * An object containing the user ID, expiration time, and error status of the access token.
 */
const validateAccessToken = async (accessToken: string): Promise<{ userId: number | null, expiresAt: number | null, error: Object | boolean }> => {
    // @ts-ignore
    const decodedToken = await decodeToken(refreshToken) as { error: any, payload };
    if (!decodedToken.error) return {
        userId: decodedToken.payload?.sub,
        expiresAt: decodedToken.payload?.exp,
        error: false
    }

    else return parseJWTError(decodedToken.error)

}

/**
 * Validates a refresh token by decoding it and extracting relevant information.
 * @param {string} refreshToken - The refresh token to validate.
 * @returns A Promise that resolves to an object containing userId, ip, expiresAt, and error status.
 */
const validateRefreshToken = async (refreshToken: string): Promise<{ userId: number | null, ip: string | null, expiresAt: number | null, error: Object | boolean }> => {
    // @ts-ignore
    const decodedToken = await decodeToken(refreshToken) as { error: any, payload };
    if (!decodedToken.error) return {
        userId: decodedToken.payload?.sub,
        ip: decodedToken.payload?.ip,
        expiresAt: decodedToken.payload?.exp,
        error: false
    }

    else return parseJWTError(decodedToken.error);
}

/**
 * Parses a JWT specific error and returns the corresponding authentication error.
 * @param {VerifyErrors | any} payload - The payload containing the JWT error information.
 * @returns An object containing userId, expiresAt, ip, and the corresponding authentication error.
 */
const parseJWTError = (payload: VerifyErrors | any) => {
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

/**
 * Revokes a refresh token by adding it's signature to db record
 * @param {string} refreshToken - The refresh token to revoke.
 * @returns {Promise<{ error: any }>} A promise that resolves with an error object if an error occurs.
 */
export const revokeRefreshToken = async (refreshToken: string): Promise<{ error: any }> => {
    try {
        // @ts-ignore
        const decodedToken = await decodeToken(refreshToken) as { error: any, payload }; const signature = refreshToken.split('.')[2];

        if (!decodedToken.error) {
            const userID = decodedToken.payload?.sub;
            const userExists = await checkUserExistence(userID)

            if (userExists.error) return userExists
            if (!userExists) return {
                error: errors.auth.UserDoesNotExist
            }

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
            console.log(decodedToken.payload)
            return parseJWTError(decodedToken.error);
        }
    } catch (err: Error | any) {
        if (DEBUG) {
            console.error("Caught Error: " + err.message);
        }
        return parseServerError(err);
    }
}

/**
 * Checks if a refresh token is revoked by querying the database for the token's signature.
 * @param {string} refreshToken - The refresh token to check for revocation.
 * @returns {Promise<boolean | Object>} A promise that resolves to a boolean indicating if the refresh token is revoked or an error object.
 */
export const isRefreshTokenRevoked = async (refreshToken: string): Promise<boolean | Object> => {
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

/**
 * Checks if a user with the given userId exists in the database.
 * @param {number} userId - The id of the user to check existence for.
 * @returns {Promise<{ error: any, exist?: boolean }>} A promise that resolves to an object
 * containing an error (if any) and a boolean indicating if the user exists.
 */
export const checkUserExistence = async (userId: number): Promise<{ error: any, exist?: boolean }> => {
    try {
        const user = await db.user.findUnique({
            where: {
                id: userId
            }
        })
        return { exist: user ? true : false, error: null };
    } catch (err: Error | any) {
        if (DEBUG) {
            console.error("Caught Error: " + err.message);
        }
        return parseServerError(err)
    }
}