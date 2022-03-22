import { Pool } from 'pg';

import config from './config';

const client = new Pool({
	host: config.db.host,
	port: Number(config.db.port),
	database: config.db.name,
	user: config.db.user,
	password: config.db.password
});

export default client;
