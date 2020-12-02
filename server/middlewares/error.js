class ApiError extends Error {
    constructor(errorCode) {
        super();
        this.errorCode = errorCode
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
