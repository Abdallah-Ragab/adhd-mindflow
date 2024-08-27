import { ApiException } from "../error";

export class GenericTokenError extends ApiException {
    message: string = 'Something went wrong with your token';
    code: string = 'api.auth.token.generic';
    statusCode: number = 401;
}

// api.auth.token.invalid
export class InvalidTokenError extends GenericTokenError {
    message: string = 'Invalid token';
    code: string = 'api.auth.token.invalid';
}

// api.auth.token.expired
export class ExpiredTokenError extends GenericTokenError {
    message: string = 'Token has expired';
    code: string = 'api.auth.token.expired';
}

// api.auth.token.missing
export class MissingTokenError extends GenericTokenError {
    message: string = 'Token is missing';
    code: string = 'api.auth.token.missing';
}