import { STATUS_CODES } from 'http';

class HttpException extends Error {
	status: number;
	message: string;
	/**
	 * @description Represents an HTTP response
	 * @constructor
	 * @param status - status code of the HTTP response
	 * @param message - error message of the HTTP response
	 */
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
		this.message = message;
	}
}

class ValidationError extends HttpException {
	/**
	 * @description Represents invalid error
	 * @constructor
	 * @param message - will be mapped to the default message of 400 error if empty
	 */
	constructor(message = '') {
		const httpStatusCode = 400;
		message ||= (<unknown>STATUS_CODES[httpStatusCode]) as string;
		super(httpStatusCode, message);
	}
}
class PageNotFound extends HttpException {
	/**
	 * @description Represents undefined route error
	 * @constructor
	 * @param message - will be mapped to the default message of 400 error if empty
	 */
	constructor(message = '') {
		const httpStatusCode = 404;
		message ||= (<unknown>STATUS_CODES[httpStatusCode]) as string;
		super(httpStatusCode, message);
	}
}

export { HttpException, ValidationError, PageNotFound };
