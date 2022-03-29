import { Router } from 'express';
import {
	create,
	destroy,
	index,
	show,
	update,
	currentOrderByUserId,
	addProduct
} from '../../handlers/orders';
import { verifyAuthToken } from '../../middlewares';

const orderRoutes = Router();

orderRoutes.get('/', verifyAuthToken, index);
orderRoutes.get('/:id', verifyAuthToken, show);
orderRoutes.post('/', verifyAuthToken, create);
orderRoutes.put('/:id', verifyAuthToken, update);
orderRoutes.delete('/:id', verifyAuthToken, destroy);

orderRoutes.get('/users/:user_id', verifyAuthToken, currentOrderByUserId);
orderRoutes.post('/:id/products', verifyAuthToken, addProduct);

export default orderRoutes;
