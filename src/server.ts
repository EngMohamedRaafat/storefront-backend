import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import { errorHandler, pageNotFound } from './middlewares';

const app: express.Application = express();
const PORT = 3000;

app.use(bodyParser.json());
// logging middleware
app.use(morgan('dev'));

app.get('/', function (req: Request, res: Response) {
	res.send('Hello World!');
});

// page not found middleware
app.use(pageNotFound);
// error handler middleware
app.use(errorHandler);

app.listen(PORT, function () {
	// eslint-disable-next-line no-console
	console.log(`server started at http://localhost:${PORT}`);
});

export default app;
