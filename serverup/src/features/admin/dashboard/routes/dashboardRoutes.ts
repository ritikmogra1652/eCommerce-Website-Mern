import express from 'express';
import { adminValidation } from '../../../product/middleware/adminValidation';
import HandleErrors from '../../../auth/middleware/handleErrors';
import { topCustomers, topProducts, totalOrders, totalProducts, totalSales, totalUsers } from '../controller/dashboardController';
const dashboardRoutes = express.Router();

dashboardRoutes.get("/total-sales", adminValidation, HandleErrors(totalSales));
dashboardRoutes.get('/total-products', adminValidation, HandleErrors(totalProducts));
dashboardRoutes.get('/total-users', adminValidation, HandleErrors(totalUsers));
dashboardRoutes.get('/total-orders', adminValidation, HandleErrors(totalOrders));
dashboardRoutes.get('/top-selling-products', adminValidation, HandleErrors(topProducts));
dashboardRoutes.get("/top-customers", adminValidation, HandleErrors(topCustomers));

export { dashboardRoutes }