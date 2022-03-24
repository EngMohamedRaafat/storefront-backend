import supertest from 'supertest';
import db from '../../database';
import { Product } from '../../models/product';
import { User, UserStore } from '../../models/user';
import app from '../../server';

const store = new UserStore();
const request = supertest(app);
let userToken: string;

describe('Products API Endpoints Test', () => {
	const product: Product = {
		name: 'labtop',
		price: 5000,
		category: 'computers'
	};

	beforeAll(async () => {
		// create a test user
		await store.create({
			username: 'tester',
			firstname: 'Test',
			lastname: 'User',
			password: 'pass123'
		} as User);

		// get user authorization token
		const res = await request
			.post('/api/users/authenticate')
			.set('Content-type', 'application/json')
			.send({
				username: 'tester',
				password: 'pass123'
			});
		expect(res.status).toBe(200);
		expect(res.body?.token).toBeDefined();
		expect(res.body?.token).not.toBeNull();
		const { token } = res.body;
		userToken = token;
	});

	afterAll(async () => {
		const connection = await db.connect();
		// reset users table
		await connection.query(
			'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;'
		);
		// reset products table
		await connection.query(
			'DELETE FROM products;\nALTER SEQUENCE products_id_seq RESTART WITH 1'
		);
		connection.release();
	});

	describe('Create new product', () => {
		it('should create a new product', async () => {
			const res = await request
				.post('/api/products/')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`)
				.send(product);
			expect(res.status).toBe(200);
			expect(res.body).toEqual({ ...product, id: 1 });
		});
	});

	describe('Read product(s) data', () => {
		it('should get list of all products', async () => {
			const res = await request.get('/api/products');
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(1);
			expect(res.body).toEqual([{ ...product, id: 1 }]);
		});

		it('should get a product data', async () => {
			const res = await request.get('/api/products/1');
			expect(res.status).toBe(200);
			expect(res.body).toEqual({ ...product, id: 1 });
		});
	});

	describe('Update product data', () => {
		it('should fail without user token provided', async () => {
			const res = await request.put('/api/products/1').send({
				...product,
				name: 'mobile',
				category: 'electronics',
				id: 1
			});
			expect(res.status).toBe(401);
		});

		it('should pass with user token provided', async () => {
			const res = await request
				.put('/api/products/1')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`)
				.send({
					...product,
					name: 'mobile',
					category: 'electronics',
					id: 1
				});
			expect(res.status).toBe(200);
			expect(res.body.name).toBe('mobile');
			expect(res.body.category).toBe('electronics');
		});
	});

	describe('Delete product', () => {
		it('should fail without user token provided', async () => {
			const res = await request.delete('/api/products/1');
			expect(res.status).toBe(401);
		});

		it('should pass with user token provided', async () => {
			const res = await request
				.delete('/api/products/1')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`);
			expect(res.status).toBe(200);
			expect(res.body.id).toBe(1);
		});
	});
});
