import express from 'express'
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getPagedOrders,
  getCustomerOrdersPaged
} from '../controllers/ordersController.js'

const router = express.Router()

// GET /api/orders - Get all orders
router.get('/', getAllOrders)

// GET /api/orders/paged - Get paginated orders
router.get('/paged', getPagedOrders)

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderById)

// POST /api/orders - Create new order
router.post('/', createOrder)

// PUT /api/orders/:id - Update order
router.put('/:id', updateOrder)

// DELETE /api/orders/:id - Delete order
router.delete('/:id', deleteOrder)

// GET /api/customers/:customerId/orders/paged - Get paginated orders for a customer
// Note: This route should be registered before the /:id route in the main app
// For now, we'll handle it in a separate route file or use a more specific path

export default router

