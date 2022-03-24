import supertest from 'supertest';
import db from '../../database';
import { User, UserStore } from '../../models/user';
import app from '../../server';

const store = new UserStore();
const request = supertest(app);
let userToken: string;

describe('Users API Endpoints Test', () => {
	const user: User = {
		username: 'JhonSmith',
		firstname: 'Jhon',
		lastname: 'Smith',
		password: 'test123'
	};

	beforeAll(async () => {
		// create a test user
		await store.create({
			username: 'tester',
			firstname: 'Test',
			lastname: 'User',
			password: 'pass123'
		} as User);
	});

	afterAll(async () => {
		const connection = await db.connect();
		// reset users table
		await connection.query(
			'DELETE FROM users;\nALTER SEQUENCE users_id_seq RESTART WITH 1;'
		);
		connection.release();
	});

	describe('Authenticate user', () => {
		it('should pass and get token', async () => {
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
		it('should fail with wrong data', async () => {
			// get user authorization token
			const res = await request
				.post('/api/users/authenticate')
				.set('Content-type', 'application/json')
				.send({
					username: 'tester',
					password: 'WrongPassword'
				});
			expect(res.status).toBe(400);
			expect(res.error).toBeDefined();
		});
	});

	describe('Create a new user', () => {
		it('should fail without user token provided', async () => {
			const res = await request.post('/api/users').send(user);
			expect(res.status).toBe(401);
		});
		it('should pass with user token provided', async () => {
			const res = await request
				.post('/api/users')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`)
				.send(user);
			expect(res.status).toBe(200);
			expect(res.body.token).toBeDefined();
			expect(res.body.token).not.toBeNull();
			expect(res.body.username).toBe(user.username);
			expect(res.body.firstname).toBe(user.firstname);
			expect(res.body.lastname).toBe(user.lastname);
			expect(res.body.id).toBe(2);
		});
	});

	describe('Read user(s) data', () => {
		it('should fail to get all users without token provided', async () => {
			const res = await request.get('/api/users');
			expect(res.status).toBe(401);
		});
		it('should get all users with token provided', async () => {
			const res = await request
				.get('/api/users')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`);
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
		});

		it('should fail to get a user data without token provided', async () => {
			const res = await request.get('/api/users/1');
			expect(res.status).toBe(401);
		});
		it('should pass to get a user data with token provided', async () => {
			const res = await request
				.get('/api/users/2')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`);
			expect(res.status).toBe(200);
			expect(res.body.username).toBe(user.username);
			expect(res.body.firstname).toBe(user.firstname);
			expect(res.body.lastname).toBe(user.lastname);
		});
	});

	describe('Update user data', () => {
		it('should fail without user token provided', async () => {
			const res = await request.put('/api/users/2').send({
				...user,
				username: 'Dr.Strange',
				firstname: 'Doctor',
				lastname: 'Strange',
				id: 1
			});
			expect(res.status).toBe(401);
		});
		it('should pass with user token provided', async () => {
			const res = await request
				.put('/api/users/2')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`)
				.send({
					...user,
					username: 'Dr.Strange',
					firstname: 'Doctor',
					lastname: 'Strange',
					id: 1
				});
			expect(res.status).toBe(200);
			expect(res.body.username).toBe('Dr.Strange');
			expect(res.body.firstname).toBe('Doctor');
			expect(res.body.lastname).toBe('Strange');
		});
	});

	describe('Delete user', () => {
		it('should fail without user token provided', async () => {
			const res = await request.delete('/api/users/2');
			expect(res.status).toBe(401);
		});

		it('should pass with user token provided', async () => {
			const res = await request
				.delete('/api/users/2')
				.set('Content-type', 'application/json')
				.set('Authorization', `Bearer ${userToken}`);
			expect(res.status).toBe(200);
			expect(res.body.id).toBe(2);
		});
	});
});
