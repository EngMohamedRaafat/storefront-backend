import { Product, ProductStore } from '../product';
import db from '../../database';

const store = new ProductStore();

describe('Product Model Test', () => {
	describe('Check defined methods', () => {
		it('should have an index method', () => {
			expect(store.index).toBeDefined();
		});

		it('should have a show method', () => {
			expect(store.show).toBeDefined();
		});

		it('should have a create method', () => {
			expect(store.create).toBeDefined();
		});

		it('should have a update method', () => {
			expect(store.update).toBeDefined();
		});

		it('should have a delete method', () => {
			expect(store.delete).toBeDefined();
		});
	});

	describe('Check methods implementation', () => {
		const product: Product = {
			name: 'labtop',
			price: 5000,
			category: 'computers'
		};

		afterAll(async () => {
			const connection = await db.connect();
			const sql =
				'DELETE FROM products;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n';
			await connection.query(sql);
			connection.release();
		});

		it('create method should add a product', async () => {
			const result = await store.create(product);
			expect(result).toEqual({
				...product,
				id: 1
			});
		});

		it('index method should return a list of products', async () => {
			const result = await store.index();
			expect(result.length).toBe(1);
			expect(result).toEqual([{ ...product, id: 1 }]);
		});

		it('show method should return the correct product', async () => {
			const result = await store.show('1');
			expect(result).toEqual({
				...product,
				id: 1
			});
		});

		it('update method should return a product with updated properties', async () => {
			const result = await store.update({
				...product,
				name: 'mobile',
				category: 'electronics',
				id: 1
			});
			expect(result.name).toBe('mobile');
			expect(result.category).toBe('electronics');
		});

		it('delete method should remove the product', async () => {
			await store.delete('1');
			const result = await store.index();
			expect(result.length).toEqual(0);
		});
	});
});
