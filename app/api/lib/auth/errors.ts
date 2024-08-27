import { ApiException } from "@/app/api/lib/error";

export class GenericAuthError extends ApiException {
    message: string = 'Something went wrong with your authentication';
    code: string = 'api.auth.generic';
    statusCode: number = 401;
}

// api.auth.login.invalid
export class InvalidLoginError extends GenericAuthError {
    message: string = 'Invalid email or password';
    code: string = 'api.auth.login.invalid';
}
// api.auth.login.notfound
export class UserDoesNotExistError extends GenericAuthError {
    message: string = 'User does not exist';
    code: string = 'api.auth.login.notfound';
}
// api.auth.register.invalid
export class InvalidRegisterError extends GenericAuthError {
    message: string = 'Invalid email or password';
    code: string = 'api.auth.register.invalid';
}
// api.auth.register.exists
export class EmailExistsError extends GenericAuthError {
    message: string = 'Email already exists';
    code: string = 'api.auth.register.exists';
}
