import express from 'express';
import verifyAuthToken from '../middlewares/verifyAuthToken';
import orderRoutes from './api/orders';
import productRoutes from './api/products';
import userRoutes from './api/users';

const routes = express.Router();

routes.use('/orders', verifyAuthToken, orderRoutes);
routes.use('/products', productRoutes);
routes.use('/users', userRoutes);

export default routes;
