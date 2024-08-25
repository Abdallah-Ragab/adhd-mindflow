import { VerifyErrors } from "jsonwebtoken";
import errorDetails from "./details"

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