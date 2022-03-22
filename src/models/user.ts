import bcrypt from 'bcrypt';

import db from '../database';
import config from '../config';

export type User = {
	id?: number;
	username: string;
	firstname: string;
	lastname: string;
	password: string;
};

export class UserStore {
	async index(): Promise<User[]> {
		const conn = await db.connect();
		try {
			const sql = 'SELECT * FROM users';
			const result = await conn.query(sql);
			return result.rows;
		} catch (err) {
			throw new Error(`Could not get users. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async show(id: string): Promise<User> {
		const conn = await db.connect();
		try {
			const sql = 'SELECT * FROM users WHERE id=($1)';
			const result = await conn.query(sql, [id]);
			return result.rows[0];
		} catch (err) {
			throw new Error(`Could not find user ${id}. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async create(u: User): Promise<User> {
		const conn = await db.connect();
		try {
			const sql =
				'INSERT INTO users (username, firstname, lastname, password) VALUES($1, $2, $3, $4) RETURNING *';
			const hash = bcrypt.hashSync(
				u.password + config.auth.pepper,
				parseInt(config.auth.salt as string, 10)
			);
			const result = await conn.query(sql, [
				u.username,
				u.firstname,
				u.lastname,
				hash
			]);
			const user = result.rows[0];
			return user;
		} catch (err) {
			throw new Error(
				`unable to create user (${u.firstname} ${u.lastname}): ${err}`
			);
		} finally {
			conn.release();
		}
	}

	async update(user: User): Promise<User> {
		const conn = await db.connect();
		try {
			const sql =
				'UPDATE users SET username=$2, firstname=$3, lastname=$4, password=$5 WHERE id=$1 RETURNING *';
			const hash = bcrypt.hashSync(
				user.password + config.auth.pepper,
				parseInt(config.auth.salt as string, 10)
			);
			const result = await conn.query(sql, [
				user.id,
				user.username,
				user.firstname,
				user.lastname,
				hash
			]);
			return result.rows[0];
		} catch (err) {
			throw new Error(
				`unable to update user (${user.firstname} ${user.lastname}): ${err}`
			);
		} finally {
			conn.release();
		}
	}

	async delete(id: string): Promise<User> {
		const conn = await db.connect();
		try {
			const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
			const result = await conn.query(sql, [id]);
			const user = result.rows[0];
			return user;
		} catch (err) {
			throw new Error(`Could not delete user ${id}. Error: ${err}`);
		} finally {
			conn.release();
		}
	}

	async authenticate(username: string, password: string): Promise<User | null> {
		const conn = await db.connect();
		try {
			const sql = 'SELECT password FROM users WHERE username=($1)';
			const result = await conn.query(sql, [username]);
			if (result.rows.length) {
				const user = result.rows[0];
				if (bcrypt.compareSync(password + config.auth.pepper, user.password)) {
					return user;
				}
			}
			return null;
		} catch (error) {
			throw new Error(`login failed: ${(error as Error).message}`);
		} finally {
			conn.release();
		}
	}
}
