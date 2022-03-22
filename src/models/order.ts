import db from '../database';

export type Order = {
	id?: number;
	status: string;
	user_id: string;
};

export class OrderStore {
	async index(): Promise<Order[]> {
		const conn = await db.connect();
		try {
			const sql = 'SELECT * FROM orders';
			const result = await conn.query(sql);
			return result.rows;
		} catch (err) {
			throw new Error(`Could not get orders. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async show(id: string): Promise<Order> {
		const conn = await db.connect();
		try {
			const sql = 'SELECT * FROM orders WHERE id=($1)';
			const result = await conn.query(sql, [id]);
			return result.rows[0];
		} catch (err) {
			throw new Error(`Could not get order ${id}. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async create(order: Order): Promise<Order> {
		const conn = await db.connect();
		try {
			const sql =
				'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
			const result = await conn.query(sql, [order.status, order.user_id]);
			const newOrder = result.rows[0];
			return newOrder;
		} catch (err) {
			throw new Error(`Could not add order. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async update(order: Order): Promise<Order> {
		const conn = await db.connect();
		try {
			const sql =
				'UPDATE orders SET status=$2, user_id=$3 WHERE id=$1 RETURNING *';
			const result = await conn.query(sql, [
				order.id,
				order.status,
				order.user_id
			]);
			const updatedProduct = result.rows[0];
			return updatedProduct;
		} catch (err) {
			throw new Error(`Could not update order ${order.id}. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async delete(id: string): Promise<Order> {
		const conn = await db.connect();
		try {
			const sql = 'DELETE FROM orders WHERE id=($1)';
			const result = await conn.query(sql, [id]);
			const order = result.rows[0];
			return order;
		} catch (err) {
			throw new Error(`Could not delete order ${id}. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async addProduct(
		quantity: number,
		orderId: string,
		productId: string
	): Promise<Order> {
		// get order to see if it is open
		try {
			const ordersql = 'SELECT * FROM orders WHERE id=($1)';
			const conn = await db.connect();
			const result = await conn.query(ordersql, [orderId]);
			const order = result.rows[0];
			if (order.status !== 'open') {
				throw new Error(
					`Could not add order ${productId} to order ${orderId} because order status is ${order.status}`
				);
			}
			conn.release();
		} catch (err) {
			throw new Error(`${err}`);
		}

		try {
			const sql =
				'INSERT INTO orders (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
			const conn = await db.connect();

			const result = await conn.query(sql, [quantity, orderId, productId]);

			const order = result.rows[0];

			conn.release();

			return order;
		} catch (err) {
			throw new Error(
				`Could not add order ${productId} to order ${orderId}: ${err}`
			);
		}
	}

	async currentOrderByUserId(userId: string): Promise<Order> {
		const conn = await db.connect();
		try {
			const ordersql =
				'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
			const result = await conn.query(ordersql, [userId, 'active']);
			const order = result.rows[0];
			return order;
		} catch (err) {
			throw new Error(`${err}`);
		} finally {
			conn.release();
		}
	}
}
