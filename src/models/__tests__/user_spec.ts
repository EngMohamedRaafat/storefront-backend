import { User, UserStore } from '../user';
import db from '../../database';

const store = new UserStore();

describe('User Model Test', () => {
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

		it('should have an update method', () => {
			expect(store.update).toBeDefined();
		});

		it('should have a delete method', () => {
			expect(store.delete).toBeDefined();
		});

		it('should have an authenticate method', () => {
			expect(store.authenticate).toBeDefined();
		});
	});

	describe('Check methods implementation', () => {
		const user: User = {
			username: 'JhonSmith',
			firstname: 'Jhon',
			lastname: 'Smith',
			password: 'test123'
		};

		afterAll(async () => {
			const connection = await db.connect();
			const sql =
				'DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\n';
			await connection.query(sql);
			connection.release();
		});

		it('create method should add a user', async () => {
			const result = await store.create(user);
			expect(result.username).toBe(user.username);
			expect(result.firstname).toBe(user.firstname);
			expect(result.lastname).toBe(user.lastname);
			expect(result.id).toBe(1);
		});

		it('index method should return a list of users', async () => {
			const result = await store.index();
			expect(result.length).toBe(1);
			expect(result[0].username).toEqual(user.username);
			expect(result[0].firstname).toEqual(user.firstname);
			expect(result[0].lastname).toEqual(user.lastname);
			expect(result[0].id).toEqual(1);
		});

		it('show method should return the correct user', async () => {
			const result = await store.show('1');
			expect(result.username).toBe(user.username);
			expect(result.firstname).toBe(user.firstname);
			expect(result.lastname).toBe(user.lastname);
		});

		it('update method should return a user with updated properties', async () => {
			const result = await store.update({
				...user,
				username: 'Dr.Strange',
				firstname: 'Doctor',
				lastname: 'Strange',
				id: 1
			});
			expect(result.username).toBe('Dr.Strange');
			expect(result.firstname).toBe('Doctor');
			expect(result.lastname).toBe('Strange');
		});

		it('authenticate method should return the authenticated user', async () => {
			const user = await store.authenticate('Dr.Strange', 'test123');
			expect(user).not.toBeNull();
		});

		it('authenticate method should return null for wrong credentials', async () => {
			const user = await store.authenticate('Dr.Strange', 'WrongPassword');
			expect(user).toBeNull();
		});

		it('delete method should remove the user', async () => {
			await store.delete('1');
			const result = await store.index();
			expect(result.length).toEqual(0);
		});
	});
});
