import { NextFunction, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';

const store = new ProductStore();

export const index = async (
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const products = await store.index();
		res.json(products);
	} catch (error) {
		next(error);
	}
};

export const show = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const product = await store.show(req.params.id);
		res.json(product);
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
		const product: Product = {
			name: req.body.name as string,
			price: Number(req.body.price),
			category: req.body.category as string
		};
		const newProduct = await store.create(product);
		res.json(newProduct);
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
		const product: Product = {
			id: Number(req.params.id),
			name: req.body.name as string,
			price: Number(req.body.price),
			category: req.body.category as string
		};
		const newProduct = await store.update(product);
		res.json(newProduct);
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
		const deletedProduct = await store.delete(req.params.id);
		res.json(deletedProduct);
	} catch (error) {
		next(error);
	}
};
