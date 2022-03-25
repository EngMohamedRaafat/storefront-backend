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
			const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
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
	): Promise<{
		id?: number;
		quantity: number;
		order_id: string;
		product_id: string;
	}> {
		// get order to see if it is active
		const order = await this.show(orderId);
		if (order.status !== 'active') {
			throw new Error(
				`Could not add order ${productId} to order ${orderId} because order status is ${order.status}`
			);
		}

		try {
			const sql =
				'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
			const conn = await db.connect();
			const result = await conn.query(sql, [quantity, orderId, productId]);
			conn.release();
			return result.rows[0];
		} catch (err) {
			throw new Error(
				`Could not add order ${productId} to order ${orderId}: ${err}`
			);
		}
	}

	async currentOrderByUserId(userId: string): Promise<
		{
			id?: number;
			product_id: string;
			quantity: number;
			user_id: string;
			status: string;
		}[]
	> {
		const conn = await db.connect();
		try {
			const ordersql = `
				SELECT o.id, op.product_id, op.quantity, o.user_id, o.status
				FROM orders AS o
					INNER JOIN order_products AS op ON o.id = op.order_id
				WHERE user_id=($1) AND status=($2)`;
			const result = await conn.query(ordersql, [userId, 'active']);
			return result.rows;
		} catch (err) {
			throw new Error(`${err}`);
		} finally {
			conn.release();
		}
	}
}
