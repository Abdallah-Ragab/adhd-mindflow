import { jwtVerify } from "jose";
import { ExpiredTokenError, InvalidTokenError, MissingTokenError, TokenError } from "./errors";

export type AccessTokenDetails = {
    userId?: number,
    expiresAt?: number,
}
export interface RefreshTokenDetails extends AccessTokenDetails {
    ip?: string,
}

/**
 * Decode a JWT token using the provided secret key.
 * @param {string} token - The JWT token to decode.
 * @returns {Promise<any>} A promise that resolves to the decoded token payload.
 */
export const decodeToken = async (token: string): Promise<{ sub: number, exp: number, ip?: string }> => {
    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        return {
            sub: typeof payload.sub === 'string' ? parseInt(payload.sub) : payload.sub,
            exp: payload.exp!,
            ip: payload.ip as string | undefined
        };
    } catch (err) {
        throw parseJoseError(err);
    }
}

/**
 * Retrieves the expiry time of a  token.
 * @param {string} refreshToken - The token to decode and extract expiry time from.
 * @returns {Promise<number | null>} A Promise that resolves to the expiry time of the token, or null if an error occurs.
 */
export const getTokenExp = async (token: string): Promise<number | null> => {
    const decodedToken = await decodeToken(token);
    return decodedToken?.exp;
}

/**
 * Validates the access token by decoding it and extracting the user ID, expiration time,
 * and error status.
 * @param {string} accessToken - The access token to validate.
 * @returns A Promise that resolves to an object containing the user ID, expiration time.
 */
export const validateAccessToken = async (accessToken: string): Promise<AccessTokenDetails> => {
    const decodedToken = await decodeToken(accessToken);
    return {
        userId: decodedToken.sub,
        expiresAt: decodedToken.exp,
    }
}

/**
 * Validates a refresh token by decoding it and extracting relevant information.
 * @param {string} refreshToken - The refresh token to validate.
 * @returns {Promise<RefreshTokenDetails>} An object containing the decoded information from the refresh token.
 */
export const validateRefreshToken = async (refreshToken: string): Promise<RefreshTokenDetails> => {
    try {
        const decodedToken = await decodeToken(refreshToken);
        return {
            userId: decodedToken?.sub,
            ip: decodedToken?.ip,
            expiresAt: decodedToken?.exp,
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Parses a JWT error and returns the corresponding error object.
 * @param {any} error - The JWT verification error object.
 * @returns {ExpiredTokenError | MissingTokenError | InvalidTokenError | TokenError} - The corresponding error object based on the JWT error.
 */
export const parseJoseError = (error: any) => {
    // Map jose error codes to existing error classes
    if (error.code === 'ERR_JWT_EXPIRED') return new ExpiredTokenError
    if (error.code === 'ERR_JWS_INVALID' || error.code === 'ERR_JWS_VERIFICATION_FAILED') {
        return new InvalidTokenError
    }
    return new TokenError
}
