import express from 'express';
import orderRoutes from './api/orders';
import productRoutes from './api/products';
import userRoutes from './api/users';

const routes = express.Router();

routes.use('/orders', orderRoutes);
routes.use('/products', productRoutes);
routes.use('/users', userRoutes);

export default routes;
