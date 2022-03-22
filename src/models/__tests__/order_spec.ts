import { Order, OrderStore } from '../order';
import { User, UserStore } from '../user';
import db from '../../database';

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

		it('should have a update method', () => {
			expect(orderStore.update).toBeDefined();
		});

		it('should have a delete method', () => {
			expect(orderStore.delete).toBeDefined();
		});
	});

	describe('Check methods implementation', () => {
		let order: Order;
		let dummyUser: User;
		const userStore = new UserStore();

		afterAll(async () => {
			const connection = await db.connect();
			await connection.query(
				'DELETE FROM orders;\n ALTER SEQUENCE orders_id_seq RESTART WITH 1;\n'
			);
			await connection.query(
				'DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\n'
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
		});

		it('create method should add an order', async () => {
			order = await orderStore.create({
				status: 'active',
				user_id: (<unknown>dummyUser.id) as string
			});
			expect(order).toEqual({
				status: 'active',
				user_id: `${dummyUser.id}`,
				id: 1
			});
		});

		it('index method should return a list of products', async () => {
			const result = await orderStore.index();
			expect(result.length).toBe(1);
			expect(result).toEqual([{ ...order, id: 1 }]);
		});

		it('show method should return the correct order', async () => {
			const result = await orderStore.show('1');
			expect(result).toEqual({
				...order,
				id: 1
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
			await orderStore.delete('1');
			const result = await orderStore.index();
			expect(result.length).toEqual(0);
		});
	});
});
