import dotenv from 'dotenv';

dotenv.config();

const {
	BCRYPT_PASSWORD,
	NODE_ENV,
	PORT,
	POSTGRES_DB,
	POSTGRES_HOST,
	POSTGRES_PASSWORD,
	POSTGRES_PORT,
	POSTGRES_TEST_DB,
	POSTGRES_USER,
	SALT_ROUNDS,
	TOKEN_SECRET
} = process.env;

export default {
	db: {
		name: NODE_ENV === 'dev' ? POSTGRES_DB : POSTGRES_TEST_DB,
		host: POSTGRES_HOST,
		port: POSTGRES_PORT,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD
	},
	server: {
		port: PORT
	},
	auth: {
		pepper: BCRYPT_PASSWORD,
		salt: SALT_ROUNDS,
		tokenSecret: TOKEN_SECRET
	},
	ENV: NODE_ENV
};
