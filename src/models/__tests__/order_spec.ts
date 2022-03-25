import { Order, OrderStore } from '../order';
import { User, UserStore } from '../user';
import db from '../../database';
import { Product, ProductStore } from '../product';

const orderStore = new OrderStore();

describe('Order Model Test', () => {
	describe('Check defined methods', () => {
		it('should have an index method', () => {
			expect(orderStore.index).toBeDefined();
		});

		it('should have a show method', () => {
			expect(orderStore.show).toBeDefined();
		});

		it('should have a create method', () => {
			expect(orderStore.create).toBeDefined();
		});

		it('should have an update method', () => {
			expect(orderStore.update).toBeDefined();
		});

		it('should have a delete method', () => {
			expect(orderStore.delete).toBeDefined();
		});

		it('should have an addProduct method', () => {
			expect(orderStore.addProduct).toBeDefined();
		});

		it('should have a currentOrderByUserId method', () => {
			expect(orderStore.currentOrderByUserId).toBeDefined();
		});
	});

	describe('Check methods implementation', () => {
		let order: Order;
		let dummyUser: User;
		let dummyProduct: Product;
		const userStore = new UserStore();
		const productStore = new ProductStore();

		afterAll(async () => {
			const connection = await db.connect();
			await connection.query(
				'DELETE FROM order_products;\nALTER SEQUENCE order_products_id_seq RESTART WITH 1;'
			);
			await connection.query(
				'DELETE FROM orders;\n ALTER SEQUENCE orders_id_seq RESTART WITH 1;'
			);
			await connection.query(
				'DELETE FROM products;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;'
			);
			await connection.query(
				'DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;'
			);
			connection.release();
		});

		beforeAll(async () => {
			// create a dummy user
			dummyUser = await userStore.create({
				username: 'dummy',
				firstname: 'test',
				lastname: 'test',
				password: 'test123'
			});
			// create sample product
			dummyProduct = await productStore.create({
				name: 'watch',
				price: 100,
				category: 'electronics'
			});
		});

		it('create method should add an order', async () => {
			order = await orderStore.create({
				status: 'active',
				user_id: dummyUser.id?.toString() as string
			});
			expect(order).toEqual({
				status: 'active',
				user_id: `${dummyUser.id}`,
				id: 1
			});
		});

		it('index method should return a list of orders', async () => {
			const result = await orderStore.index();
			expect(result.length).toBe(1);
			expect(result).toEqual([{ ...order, id: 1 }]);
		});

		it('show method should return a specific order', async () => {
			const result = await orderStore.show('1');
			expect(result).toEqual({
				...order,
				id: 1
			});
		});

		it('addProduct method should add a product to an existing order', async () => {
			const result = await orderStore.addProduct(
				10,
				order.id?.toString() as string,
				dummyProduct.id?.toString() as string
			);
			expect(result).toEqual({
				id: 1,
				quantity: 10,
				order_id: order.id?.toString() as string,
				product_id: dummyProduct.id?.toString() as string
			});
		});

		it('currentOrderByUserId method should return all active order by specific user', async () => {
			const result = await orderStore.currentOrderByUserId(
				dummyUser.id?.toString() as string
			);
			expect(result.length).toBe(1);
			expect(result[0]).toEqual({
				id: 1,
				quantity: 10,
				product_id: dummyProduct.id?.toString() as string,
				user_id: dummyUser.id?.toString() as string,
				status: 'active'
			});
		});

		it('update method should return a order with updated properties', async () => {
			const result = await orderStore.update({
				...order,
				status: 'complete',
				id: 1
			});
			expect(result.status).toBe('complete');
			expect(result.user_id).toBe(`${dummyUser.id}`);
		});

		it('delete method should remove the order', async () => {
			const connection = await db.connect();
			await connection.query(`DELETE FROM order_products WHERE product_id=$1`, [
				dummyProduct.id
			]);
			connection.release();
			await orderStore.delete('1');
			const result = await orderStore.index();
			expect(result.length).toEqual(0);
		});
	});
});
