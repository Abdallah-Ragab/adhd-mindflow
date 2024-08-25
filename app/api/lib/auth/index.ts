import { Secret, sign } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import { PrismaClient } from "@prisma/client";
import errorDetails from '@/app/api/lib/error/details'
import { parseJWTError, parseServerError } from '@/app/api/lib/error'
import { extractAccessToken, extractRefreshToken, extractIPAddress } from '@/app/api/lib/request'
import { validateRefreshToken, validateAccessToken } from '@/app/api/lib/jwt'

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
    const ip = await extractIPAddress(request);
    return sign(
        { 'sub': user.id, 'ip': ip },
        process.env.JWT_SECRET as Secret,
        { expiresIn: '7d' }
    )
}

/**
 * Authenticates a request by validating the access token and checking if the user exists.
 * @param {NextRequest} request - The request object containing necessary information.
 * @returns {Promise<Object>} A promise that resolves to the validation result or an error object.
 */
export const AuthenticateRequest = async (request: NextRequest): Promise<{ error: Object | null, userId?:number }> => {
    const accessToken = await extractAccessToken(request) ?? '';
    const validation = await validateAccessToken(accessToken);
    const userExists = await checkIfUserExists(validation.userId as number);

    if (userExists.error) return userExists

    if (!userExists) return {
        userId: validation.userId,
        error: errorDetails.auth.UserDoesNotExist
    }

    return validation;
}

/**
 * Authorize the refresh token provided in the request by checking (token validity, request's ip and token creator's ip match and user existence)
 * @param {NextRequest} request - The request object containing the refresh token.
 * @returns {Promise} A promise that resolves to the validation result of the refresh token.
 */
export const AuthorizeRefreshToken = async (request: NextRequest) => {
    const refreshToken = await extractRefreshToken(request) ?? '';
    const validation = await validateRefreshToken(refreshToken);
    if (!validation.error) {
        if (validation.ip && validation.ip !== DEFAULT_IP) {
            const IPMatch = (await extractIPAddress(request)) === validation.ip;
            if (IPMatch) {
                return validation;
            }
            else {
                return {
                    error: errorDetails.auth.Unauthorized
                }
            }
        }
        const userExists = await checkIfUserExists(validation.userId as number)
        if (userExists.error) return userExists

        if (!userExists) return {
            userId: validation.userId,
            error: errorDetails.auth.UserDoesNotExist
        }
    }

    return validation;
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
            const userExists = await checkIfUserExists(userID)

            if (userExists.error) return userExists
            if (!userExists) return {
                error: errorDetails.auth.UserDoesNotExist
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
export const checkIfUserExists = async (userId: number): Promise<{ error: any, exist?: boolean }> => {
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