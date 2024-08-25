import { NextRequest } from 'next/server';

const DEBUG = ((process.env.NODE_ENV ?? '') === 'development');
const DEFAULT_IP = "::::";


/**
 * Retrieves the access token from the request object.
 * @param {NextRequest} request - The Next.js request object.
 * @returns {Promise<string | null>} The access token if found, otherwise null.
 */
export const extractAccessToken = async (request: NextRequest) => {
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
 * Retrieves the refresh token from the request object.
 * @param {NextRequest} request - The NextRequest object containing the request details.
 * @returns {Promise<string | null>} The refresh token extracted from the request or null if not found.
 */
export const extractRefreshToken = async (request: NextRequest) => {
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
 * Asynchronously retrieves the IP address from the NextRequest object.
 * @param {NextRequest} request - The NextRequest object containing the request information.
 * @returns {Promise<string>} A promise that resolves to the IP address or a default IP if not found.
 */
export const extractIPAddress = async (request: NextRequest) => {
    return await request.ip || await request.headers.get('x-forwarded-for') || await request.headers.get('x-real-ip') || DEFAULT_IP;
}
