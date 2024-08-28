import { Secret, verify, VerifyErrors } from "jsonwebtoken";
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
export const decodeToken = async (token: string) : Promise<{ sub: number, exp: number, ip?:string }> => {
    // @ts-ignore
    return await verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
        if (err) throw parseJWTError(err)
        return decoded;
    });
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
 * @returns A Promise that resolves to an object containing the user ID, expiration time,
 * and error status.
 */
export const validateAccessToken = async (accessToken: string): Promise<AccessTokenDetails> => {
    const decodedToken = await decodeToken(accessToken);
    return {
        userId: decodedToken?.sub,
        expiresAt: decodedToken?.exp,
    }
}

/**
 * Validates a refresh token by decoding it and extracting relevant information.
 * @param {string} refreshToken - The refresh token to validate.
 * @returns {Promise<RefreshTokenDetails>} An object containing the decoded information from the refresh token.
 */
export const validateRefreshToken = async (refreshToken: string): Promise<RefreshTokenDetails> => {
    const decodedToken = await decodeToken(refreshToken);
    return {
        userId: decodedToken?.sub,
        ip: decodedToken?.ip,
        expiresAt: decodedToken?.exp,
    }
}

/**
 * Parses a JWT error and returns the corresponding error object.
 * @param {VerifyErrors | any} error - The JWT verification error object.
 * @returns {ExpiredTokenError | MissingTokenError | InvalidTokenError | TokenError} - The corresponding error object based on the JWT error.
 */
export const parseJWTError = (error: VerifyErrors | any) => {
    if (error.name === 'TokenExpiredError') return new ExpiredTokenError
    else if (error.name === 'JsonWebTokenError') {
        if (error.message === 'jwt must be provided') return new MissingTokenError
        else return new InvalidTokenError
    }
    return new TokenError
}
