import { NextFunction, Request, Response } from 'express';

import { PageNotFound } from '../errors';

/**
 * @description A middleware to handle navigation to undefined routes
 */
const pageNotFound = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	next(new PageNotFound('Page Not Found'));
};

export default pageNotFound;
