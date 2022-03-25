import supertest from 'supertest';
import db from '../../database';
import { Order } from '../../models/order';
import { Product, ProductStore } from '../../models/product';
import { User, UserStore } from '../../models/user';
import app from '../../server';

const userStore = new UserStore();
const productStore = new ProductStore();
const request = supertest(app);
let userToken: string;
let testUser: User;
let testProduct: Product;

describe('Orders API Endpoints Test', () => {
	let order: Order;

	beforeAll(async () => {
		// create a dummy user
		testUser = await userStore.create({
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
		order = {
			status: 'active',
			user_id: testUser.id?.toString() as string
		};
		testProduct = await productStore.create({
			name: 'watch',
			price: 100,
			category: 'electronics'
		});
	});

	afterAll(async () => {
		const connection = await db.connect();
		// reset order_products table
		await connection.query(
			'DELETE FROM order_products;\nALTER SEQUENCE order_products_id_seq RESTART WITH 1;'
		);
		// reset orders table
		await connection.query(
			'DELETE FROM orders;\nALTER SEQUENCE orders_id_seq RESTART WITH 1'
		);
		// reset products table
		await connection.query(
			'DELETE FROM products;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;'
		);
		// reset users table
		await connection.query(
			'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;'
		);
		connection.release();
	});

	describe('Create new order', () => {
		it('should fail without user token provided', async () => {
			const res = await request.post('/api/orders').send(order);
			expect(res.status).toBe(401);
		});
		it('should create a new order', async () => {
			const res = await request
				.post('/api/orders/')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`)
				.send(order);
			expect(res.status).toBe(200);
			expect(res.body).toEqual({ ...order, id: 1 });
		});

		it('should fail to add a product to an existing order without token provided', async () => {
			const res = await request
				.post(`/api/orders/1/products`)
				.send({ productId: testProduct.id, quantity: 10 });
			expect(res.status).toBe(401);
		});
		it('should pass to add a product to an existing order with token provided', async () => {
			const res = await request
				.post(`/api/orders/1/products`)
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`)
				.send({ productId: testProduct.id, quantity: 10 });
			expect(res.status).toBe(200);
			expect(res.body).toEqual({
				id: 1,
				quantity: 10,
				order_id: '1',
				product_id: testProduct.id?.toString() as string
			});
		});
	});

	describe('Read user(s) data', () => {
		it('should fail to get all orders without token provided', async () => {
			const res = await request.get('/api/orders');
			expect(res.status).toBe(401);
		});
		it('should get all orders with token provided', async () => {
			const res = await request
				.get('/api/orders')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`);
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(1);
			expect(res.body).toEqual([{ ...order, id: 1 }]);
		});

		it('should fail to get an order data without token provided', async () => {
			const res = await request.get('/api/orders/1');
			expect(res.status).toBe(401);
		});
		it('should pass to get an order data with token provided', async () => {
			const res = await request
				.get('/api/orders/1')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`);
			expect(res.status).toBe(200);
			expect(res.body).toEqual({ ...order, id: 1 });
		});

		it('should fail to get an order data by user id with token provided', async () => {
			const res = await request.get(`/api/orders/users/${testUser.id}`);
			expect(res.status).toBe(401);
		});
		it('should pass to get an order data by user id with token provided', async () => {
			const res = await request
				.get(`/api/orders/users/${testUser.id}`)
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`);
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(1);
			expect(res.body[0]).toEqual({
				id: 1,
				quantity: 10,
				product_id: testProduct.id?.toString() as string,
				user_id: testUser.id?.toString() as string,
				status: 'active'
			});
		});
	});

	describe('Update order data', () => {
		it('should fail without user token provided', async () => {
			const res = await request
				.put('/api/orders/1')
				.send({ ...order, status: 'complete', id: 1 });
			expect(res.status).toBe(401);
		});

		it('should pass with user token provided', async () => {
			const res = await request
				.put('/api/orders/1')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`)
				.send({ ...order, status: 'complete', id: 1 });
			expect(res.status).toBe(200);
			expect(res.body.status).toBe('complete');
		});
	});

	describe('Delete order', () => {
		it('should fail without user token provided', async () => {
			const res = await request.delete('/api/orders/1');
			expect(res.status).toBe(401);
		});

		it('should pass with user token provided', async () => {
			const connection = await db.connect();
			await connection.query(`DELETE FROM order_products WHERE product_id=$1`, [
				testProduct.id
			]);

			const res = await request
				.delete('/api/orders/1')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`);
			expect(res.status).toBe(200);
			expect(res.body.id).toBe(1);
		});
	});
});
