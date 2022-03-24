import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthorizationError } from '../errors';

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authorizationHeader = req.headers.authorization as string;
		const token = authorizationHeader.split(' ')[1];
		const decoded = jwt.verify(token, config.auth.tokenSecret as string);

		if (decoded) {
			next();
		} else {
			next(new AuthorizationError('Access denied, invalid token'));
		}
	} catch (error) {
		next(new AuthorizationError('Access denied, invalid token'));
	}
};

export default verifyAuthToken;
