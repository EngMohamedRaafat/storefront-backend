import { Router } from 'express';
import {
	create,
	destroy,
	index,
	show,
	update,
	authenticate
} from '../../handlers/users';
import { verifyAuthToken } from '../../middlewares';

const userRoutes = Router();

userRoutes.get('/', verifyAuthToken, index);
userRoutes.get('/:id', verifyAuthToken, show);
userRoutes.post('/', create);
userRoutes.put('/:id', verifyAuthToken, update);
userRoutes.delete('/:id', verifyAuthToken, destroy);
userRoutes.post('/authenticate', authenticate);

export default userRoutes;
