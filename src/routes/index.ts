import express from 'express';
import productRoutes from './api/products';

const routes = express.Router();

routes.use('/products', productRoutes);

export default routes;
