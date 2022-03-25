import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { errorHandler, pageNotFound } from './middlewares';
import routes from './routes';
import config from './config';

const app: express.Application = express();
const PORT = 3000;

app.use(bodyParser.json());

if (config.ENV !== 'test') {
	// logging middleware
	app.use(morgan('dev'));
}

app.use('/api', routes);

// page not found middleware
app.use(pageNotFound);
// error handler middleware
app.use(errorHandler);

app.listen(PORT, function () {
	// eslint-disable-next-line no-console
	console.log(`server started at http://localhost:${PORT}`);
});

export default app;
