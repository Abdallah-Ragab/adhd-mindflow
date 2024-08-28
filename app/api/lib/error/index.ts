import { NextResponse } from "next/server";

const DEBUG = (process.env.NODE_ENV ?? "") === 'development';

type traceObject = {
    formatted: string,
    func: string,
    file: string,
    line: string,
    column: string
}

export const handleApiException = (error: ApiException | Error) => {
    if (typeof error === 'function') {
        throw new Error(`Expected an instance of Error class but got a reference to the class instead`);
    }

    // const exception = error instanceof ApiException ? error : ServerException.fromError(error)
    const exception = error instanceof ApiException ? error : new ServerException(Exception.fromError(error))

    if (DEBUG) {
        console.warn(exception.log);
    }
    return exception.response()
}

export class Exception extends Error {
    name: string = this.constructor.name;
    trace: traceObject;
    log: string;

    static fromError(error: Error) {
        return new this(error.name, error.message, error.stack);
    }

    constructor(name?: string, message?: string, stack?: string) {
        super(message);
        this.name = name ?? this.name;
        this.stack = stack ?? this.stack;
        this.trace = this.parseErrorStackLine(this.stack, 1);
        this.log = `${this.name}[${this instanceof ApiException && this.code}]: ${this.message} @${this.trace.formatted}`;
    }

    parseErrorStackLine(stack?: string, index: number = 1): traceObject {
        const lineExpression = /at\s(.*)\s\((.*)\)/
        const lineMatch = stack?.split('\n')[index]?.match(lineExpression);

        const locationExpression = /(.*):(\d*):(\d*)/
        const locationMatch = lineMatch?.[2]?.match(locationExpression);

        const details = {
            func: lineMatch?.[1] ?? "",
            location: lineMatch?.[2] ?? "",
            file: locationMatch?.[1] ?? "",
            line: locationMatch?.[2] ?? "",
            column: locationMatch?.[3] ?? ""
        }
        return { formatted: `[${details.func}]${details.location}`, ...details };
    }

    json() {
        return {
            type: this.name,
            message: this.message,
            trace: DEBUG ? this.trace.formatted : undefined
        }
    }

}

export class ApiException extends Exception {
    statusCode: number = 400;
    message: string = 'Something went wrong with your request';
    code: string = "api";

    response() {
        return NextResponse.json({
            error: {
                ...this.json()
            }
        }, { status: this.statusCode });
    }

    json() {
        return {
            ...super.json(),
            code: this.code
        }
    }

}

export class ServerException extends ApiException {
    statusCode: number = 500;
    message: string = 'Internal server error';
    code: string = this.code + '.server';
    internalException: Exception;

    constructor(exception: Exception) {
        super();
        this.internalException = exception;
    }

    static fromError(error: Error) {
        return new this(Exception.fromError(error));
    }

    response() {
        return NextResponse.json({
            error: {
                ...this.json(),
                cause: DEBUG ? {
                    ...this.internalException.json()
                } : undefined
            }
        }, { status: this.statusCode });
    }

}

export class ValidationException extends ApiException {
    statusCode: number = 400;
    message: string = "could not validate the submitted data";
    code: string = this.code + '.validation';
    issues: {[key: string]: string[]};

    constructor(issues: { [key: string]: string[] }) {
        super();
        this.issues = issues;
    }

    json() {
        return {
            ...super.json(),
            issues: this.issues
        }
    }
}