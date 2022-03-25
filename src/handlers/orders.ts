import { NextFunction, Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';

const store = new OrderStore();

export const index = async (
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const orders = await store.index();
		res.json(orders);
	} catch (error) {
		next(error);
	}
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const order = await store.show(req.params.id);
		res.json(order);
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
		const order: Order = {
			status: req.body.status as string,
			user_id: req.body.user_id as string
		};
		const newOrder = await store.create(order);
		res.json(newOrder);
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
		const order: Order = {
			id: Number(req.params.id),
			status: req.body.status as string,
			user_id: req.body.user_id as string
		};
		const newOrder = await store.update(order);
		res.json(newOrder);
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
		const deletedOrder = await store.delete(req.params.id);
		res.json(deletedOrder);
	} catch (error) {
		next(error);
	}
};

export const addProduct = async (req: Request, res: Response) => {
	try {
		const orderId: string = req.params.id;
		const productId: string = req.body.productId;
		const quantity: number = parseInt(req.body.quantity);

		const addedProduct = await store.addProduct(quantity, orderId, productId);
		res.json(addedProduct);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

export const currentOrderByUserId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const order = await store.currentOrderByUserId(req.params.user_id);
		res.json(order);
	} catch (error) {
		next(error);
	}
};
