import { Router } from 'express';
import { create, destroy, index, show, update } from '../../handlers/products';
import verifyAuthToken from '../../middlewares/verifyAuthToken';

const productRoutes = Router();

productRoutes.get('/', index);
productRoutes.get('/:id', show);
productRoutes.post('/', verifyAuthToken, create);
productRoutes.put('/:id', verifyAuthToken, update);
productRoutes.delete('/:id', verifyAuthToken, destroy);

export default productRoutes;
