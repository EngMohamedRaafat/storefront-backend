import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ValidationError } from '../errors';

import { User, UserStore } from '../models/user';

const store = new UserStore();

export const index = async (
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const users = await store.index();
		res.json(users);
	} catch (error) {
		next(error);
	}
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await store.show(req.params.id);
		res.json(user);
	} catch (error) {
		next(error);
	}
};

export const create = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user: User = {
			username: req.body.username as string,
			firstname: req.body.firstname as string,
			lastname: req.body.lastname as string,
			password: req.body.password as string
		};
		const newUser = await store.create(user);
		const token = jwt.sign(
			{ user: newUser },
			config.auth.tokenSecret as string
		);
		res.json({ ...newUser, token });
	} catch (error) {
		next(error);
	}
};

export const update = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user: User = {
			id: Number(req.params.id),
			username: req.body.username as string,
			firstname: req.body.firstname as string,
			lastname: req.body.lastname as string,
			password: req.body.password as string
		};
		const newUser = await store.update(user);
		res.json(newUser);
	} catch (error) {
		next(error);
	}
};

export const destroy = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const deletedUser = await store.delete(req.params.id);
		res.json(deletedUser);
	} catch (error) {
		next(error);
	}
};

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { username, password } = req.body;
		const user = await store.authenticate(
			username as string,
			password as string
		);
		const token = jwt.sign({ user }, config.auth.tokenSecret as string);
		if (!user) {
			throw new ValidationError('Invalid username or password');
		}
		res.json({ token });
	} catch (err) {
		next(err);
	}
};
