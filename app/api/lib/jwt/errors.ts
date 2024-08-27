import { ApiException } from "../error";

export class TokenError extends ApiException {
    message: string = 'Something went wrong with your token';
    code: string = this.code + '.token';
    statusCode: number = 401;
}

// api.auth.token.invalid
export class InvalidTokenError extends TokenError {
    message: string = 'Invalid token';
    code: string = this.code + '.invalid';
}

// api.auth.token.expired
export class ExpiredTokenError extends TokenError {
    message: string = 'Token has expired';
    code: string = this.code + '.expired';
}

// api.auth.token.missing
export class MissingTokenError extends TokenError {
    message: string = 'Token is missing';
    code: string = this.code + '.missing';
}