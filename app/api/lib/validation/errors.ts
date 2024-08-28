import { ApiException } from "../error";

/**
 * Represents an error that occurs when the request format is invalid.
 * @extends ApiException
 */
export class RequestError extends ApiException {
    message: string = 'Invalid request format';
    code: string = this.code + '.request';
}

/**
 * Represents an error that occurs when the request body is not valid JSON.
 * @extends RequestError
 */
export class InvalidJsonError extends RequestError {
    message: string = "the request body is not valid JSON";
    code: string = this.code + '.json';
}