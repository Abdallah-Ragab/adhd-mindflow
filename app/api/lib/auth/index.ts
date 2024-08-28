import { Secret, sign } from 'jsonwebtoken';
import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { extractAccessToken, extractRefreshToken, extractIPAddress } from '@/app/api/lib/request'
import { validateRefreshToken, validateAccessToken, decodeToken, AccessTokenDetails, RefreshTokenDetails } from '@/app/api/lib/jwt'
import { UnauthorizedUseOfTokenError, LoginUserDoesNotExistError, UserNotFoundError } from './errors';
import { existsExtension } from '@/prisma/extensions/exists';

const DEBUG = ((process.env.NODE_ENV ?? '') === 'development');
const DEFAULT_IP = "::::";
const db = new PrismaClient().$extends(existsExtension)


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
 * Authenticates a request by extracting the access token from the NextRequest object,
 * validating the access token, and checking if the user exists in the database.
 * @param {NextRequest} request - The NextRequest object containing the request details.
 * @returns {Promise<AccessTokenDetails>} A promise that resolves to the access token details.
 * @throws {LoginUserDoesNotExistError} If the user does not exist in the database.
 */
export const AuthenticateRequest = async (request: NextRequest): Promise<AccessTokenDetails> => {
    const accessToken = await extractAccessToken(request) ?? '';
    const accessTokenDetails = await validateAccessToken(accessToken);
    const userExists = await db.user.exists({ id: accessTokenDetails.userId as number })

    if (!userExists) throw new LoginUserDoesNotExistError

    return accessTokenDetails;
}


/**
 * Authorize the refresh token provided in the request by validating it, checking if the request IP matches the token's IP,
 * and verifying the user exists in the database.
 * @param {NextRequest} request - The request object containing the refresh token.
 * @returns {Promise<RefreshTokenDetails>} A promise that resolves to the details of the refresh token.
 * @throws {UnauthorizedUseOfTokenError} If the token is being used from an unauthorized IP address.
 * @throws {UserNotFoundError} If the user associated with the refresh token is not found in the database.
 */
export const AuthorizeRefreshToken = async (request: NextRequest): Promise<RefreshTokenDetails> => {
    const refreshToken = await extractRefreshToken(request) ?? '';
    const refreshTokenDetails = await validateRefreshToken(refreshToken);
    const requestIPAddress = await extractIPAddress(request);

    if (refreshTokenDetails.ip && refreshTokenDetails?.ip !== DEFAULT_IP && refreshTokenDetails.ip !== requestIPAddress) {
        throw new UnauthorizedUseOfTokenError
    }

    const userExists = await db.user.exists({ id: refreshTokenDetails.userId as number })
    if (!userExists) throw new UserNotFoundError

    return refreshTokenDetails;
}

/**
 * Revokes a refresh token by adding its signature to the list of revoked tokens in the database.
 * only if it is not already revoked. and belongs to a valid user. 
 * @param {string} refreshToken - The refresh token to be revoked.
 * @returns {Promise<void>} A promise that resolves once the token is revoked.
 */
export const revokeRefreshToken = async (refreshToken: string): Promise<void> => {
    const refreshTokenDetails = await validateRefreshToken(refreshToken);
    const signature = refreshToken.split('.')[2];
    const userID = refreshTokenDetails.userId as number;
    const userExists = await db.user.exists({ id: userID })

    if (!userExists) throw new UserNotFoundError
    
    const provoked = await db.revokedToken.exists({ signature: signature})

    if (!provoked) {
        await db.revokedToken.create({
            data: {
                signature: signature,
                userId: userID
            }
        });
    }
}