const DEBUG = (process.env.NODE_ENV ?? "") === 'development';

export const parseServerError = (err: Error | any) => {
    return {
        error: {
            message: 'Internal server error',
            ...(DEBUG ? { details: `${err.prototype?.name ? err.prototype.name + ': ' : ''}${err.message}` } : {}),
        }
    }
}