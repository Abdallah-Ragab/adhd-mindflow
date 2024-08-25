import { Secret, verify } from "jsonwebtoken";
import { parseJWTError } from "../error";

/**
 * Decodes a JWT token using the provided secret key.
 * @param {string} token - The JWT token to decode.
 * @returns {Promise<{ error: Error | null, payload: any }>} A promise that resolves to an object containing the error (if any) and the decoded payload.
 */
export const decodeToken = async (token: string) => {
    return await verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
        return {
            error: err ?? null,
            payload: decoded
        }
    });
}

/**
 * Retrieves the expiry time of a  token.
 * @param {string} refreshToken - The token to decode and extract expiry time from.
 * @returns {Promise<number | null>} A Promise that resolves to the expiry time of the token, or null if an error occurs.
 */
export const getTokenExp = async (token: string): Promise<number | null> => {
    // @ts-ignore
    const decodedToken = await decodeToken(token) as { error: any, payload };
    if (!decodedToken.error) return decodedToken.payload?.exp;
    else return null;
}

/**
 * Validates the access token by decoding it and checking for errors.
 * @param {string} accessToken - The access token to validate.
 * @returns {Promise<{ userId: number | null, expiresAt: number | null, error: Object | boolean }>} 
 * An object containing the user ID, expiration time, and error status of the access token.
 */
export const validateAccessToken = async (accessToken: string): Promise<{ userId?: number, expiresAt?: number, error: Object | boolean }> => {
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
export const validateRefreshToken = async (refreshToken: string): Promise<{ userId?: number, ip?: string, expiresAt?: number, error: Object | boolean }> => {
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
