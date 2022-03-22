import db from '../database';

export type Product = {
	id?: number;
	name: string;
	price: number;
	category: string;
};

export class ProductStore {
	async index(): Promise<Product[]> {
		const conn = await db.connect();
		try {
			const sql = 'SELECT * FROM products';
			const result = await conn.query(sql);
			return result.rows;
		} catch (err) {
			throw new Error(`Could not get products. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async show(id: string): Promise<Product> {
		const conn = await db.connect();
		try {
			const sql = 'SELECT * FROM products WHERE id=($1)';
			const result = await conn.query(sql, [id]);
			return result.rows[0];
		} catch (err) {
			throw new Error(`Could not get product ${id}. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async create(product: Product): Promise<Product> {
		const conn = await db.connect();
		try {
			const sql =
				'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
			const result = await conn.query(sql, [
				product.name,
				product.price,
				product.category
			]);
			const newproduct = result.rows[0];
			return newproduct;
		} catch (err) {
			throw new Error(`Could not add product ${product.name}. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async update(product: Product): Promise<Product> {
		const conn = await db.connect();
		try {
			const sql =
				'UPDATE products SET name=$2, price=$3, category=$4 WHERE id=$1 RETURNING *';
			const result = await conn.query(sql, [
				product.id,
				product.name,
				product.price,
				product.category
			]);
			const updatedProduct = result.rows[0];
			return updatedProduct;
		} catch (err) {
			throw new Error(
				`Could not update product ${product.name}. Error: ${err}`
			);
		} finally {
			conn.release();
		}
	}

	async delete(id: string): Promise<Product> {
		const conn = await db.connect();
		try {
			const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
			const result = await conn.query(sql, [id]);
			const product = result.rows[0];
			return product;
		} catch (err) {
			throw new Error(`Could not delete product ${id}. Error: ${err}`);
		} finally {
			conn.release();
		}
	}
}
