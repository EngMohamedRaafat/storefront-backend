import express from 'express';
import productRoutes from './api/products';
import userRoutes from './api/users';

const routes = express.Router();

routes.use('/products', productRoutes);
routes.use('/users', userRoutes);

export default routes;
