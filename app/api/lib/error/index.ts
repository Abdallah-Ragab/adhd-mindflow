import { VerifyErrors } from "jsonwebtoken";
import errorDetails from "./details"
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

const DEBUG = (process.env.NODE_ENV ?? "") === 'development';

/**
 * Parses a JWT error and returns the corresponding json error response.
 * @param {VerifyErrors | any} error - The error object to parse.
 * @returns An object containing the parsed error.
 */
export const parseJWTError = (error: VerifyErrors | any) => {
    let errorObject = errorDetails.auth.GenericError;
    if (error.name === 'TokenExpiredError') {
        errorObject = errorDetails.auth.ExpiredToken
    }
    else if (error.name === 'JsonWebTokenError') {
        if (error.message === 'jwt must be provided') {
            errorObject = errorDetails.auth.MissingToken
        }
        else {
            errorObject = errorDetails.auth.InvalidToken
        }
    }
    return {
        error: errorObject
    }
}

/**
 * Parses a server error and returns an object with an error message.
 * If in DEBUG mode, includes error details in the response.
 * @param {Error | any} err - The error object to parse.
 * @returns An object containing the error message and optional details.
 */
export const parseServerError = (err: Error | any) => {
    return {
        error: {
            message: 'Internal server error',
            ...(DEBUG ? { details: `${err.prototype?.name ? err.prototype.name + ': ' : ''}${err.message}` } : {}),
        }
    }
}

export const errorResponse = (err: Error) => {
    const details = `${err.constructor.name} @${err.stack?.split('\n')[1]?.trim()?.match(/\((.*):(\d+):(\d+)\)/)?.[1]}: ` + err.message
    if (DEBUG) {
        (err instanceof ApiError ? console.warn : console.error)(`Caught ${details}`);
    }
    if (err instanceof ApiError) {
        return NextResponse.json({
            error: {
                message: err.message,
                details: DEBUG ? details : undefined
            }
        }, { status: err.statusCode });
    }
    else {
        return NextResponse.json({
            error: {
                message: 'Internal Server Error',
                details: DEBUG ? details : undefined
            }
        }, { status: 500 });
    }
}