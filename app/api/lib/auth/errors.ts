import { ApiException } from "@/app/api/lib/error";

export class AuthError extends ApiException {
    message: string = 'Something went wrong with your authentication';
    code: string = this.code + '.auth';
    statusCode: number = 401;
}

// api.auth.user.notfound
export class UserNotFoundError extends AuthError {
    message: string = 'User not found';
    code: string = this.code + '.user.notfound';
}

// api.auth.login.invalid
export class InvalidLoginError extends AuthError {
    message: string = 'Invalid email or password';
    code: string = this.code + '.login.invalid';
}
// api.auth.login.notfound
export class LoginUserDoesNotExistError extends AuthError {
    message: string = 'User does not exist';
    code: string = this.code + '.login.notfound';
}
// api.auth.register.invalid
export class InvalidRegisterError extends AuthError {
    message: string = 'Invalid email or password';
    code: string = this.code + '.register.invalid';
}
// api.auth.register.exists
export class RegisterEmailExistsError extends AuthError {
    message: string = 'Email already exists';
    code: string = this.code + '.register.exists';
}

// api.auth.token.unauthorized
export class UnauthorizedUseOfTokenError extends AuthError {
    message: string = 'Unauthorized use of token';
    code: string = this.code + '.token.unauthorized';
}