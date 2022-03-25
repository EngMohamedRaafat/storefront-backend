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

const orderRoutes = Router();

orderRoutes.get('/', index);
orderRoutes.get('/:id', show);
orderRoutes.post('/', create);
orderRoutes.put('/:id', update);
orderRoutes.delete('/:id', destroy);

orderRoutes.get('/users/:user_id', currentOrderByUserId);
orderRoutes.post('/:id/products', addProduct);

export default orderRoutes;
