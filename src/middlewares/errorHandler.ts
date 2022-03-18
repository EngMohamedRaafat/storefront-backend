/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

import { HttpException } from '../errors';

/**
 * @description A middleware to handle all thrown exceptions
 */
const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const status = err instanceof HttpException ? err.status : 500;
	const message = err.message || 'Server Error';
	res.status(status).json({
		error: { status, message }
	});
};

export default errorHandler;
