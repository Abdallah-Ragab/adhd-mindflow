import { ApiException } from "@/app/api/lib/error";

/**
 * error class for authentication-related errors. Extends the base ApiException class.
 * returns The HTTP status code for authentication errors (401 - Unauthorized).
 * @extends ApiException
 */
export class AuthError extends ApiException {
    message: string = 'Something went wrong with your authentication';
    code: string = this.code + '.auth';
    statusCode: number = 401;
}

/**
 * error class for when a user is not found during authentication.
 * @extends AuthError
 */
export class UserNotFoundError extends AuthError {
    message: string = 'User not found';
    code: string = this.code + '.user.notfound';
}

/**
 * Represents an error that occurs during the login process.
 * @extends AuthError
 */
export class LoginError extends AuthError {
    message: string = 'Invalid email or password';
    code: string = this.code + '.login';
}

/**
 * Custom error class for when a login user does not exist.
 * @extends LoginError
 */
export class LoginUserDoesNotExistError extends LoginError {
    message: string = 'User does not exist';
    code: string = this.code + '.notfound';
}

/**
 * Represents an error that occurs when the provided password is incorrect during login.
 * @extends LoginError
 */
export class LoginPasswordIncorrectError extends LoginError {
    message: string = 'Password is incorrect';
    code: string = this.code + '.incorrect';
}

/**
 * Represents an error that occurs during user registration.
 * @extends AuthError
 */
export class RegisterError extends AuthError {
    message: string = 'Invalid email or password';
    code: string = this.code + '.register';
}

/**
 * Represents an error that occurs when attempting to register with an email that already exists.
 * @extends RegisterError
 */
export class RegisterEmailExistsError extends RegisterError {
    message: string = 'Email already exists';
    code: string = this.code + '.exists';
}

/**
 * Represents an error that occurs when an unauthorized use of a token is detected.
 * @extends AuthError
 */
export class UnauthorizedUseOfTokenError extends AuthError {
    message: string = 'Unauthorized use of token';
    code: string = this.code + '.token.unauthorized';
}