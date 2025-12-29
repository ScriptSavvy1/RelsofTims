import { db } from '../data/db.js'
import { validateOrder, sanitizeOrder } from '../models/order.js'

// GET /api/orders - Get all orders
export const getAllOrders = (req, res) => {
  try {
    const orders = db.orders.getAll()
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message })
  }
}

// GET /api/orders/:id - Get order by ID
export const getOrderById = (req, res) => {
  try {
    const { id } = req.params
    const order = db.orders.getById(id)
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message })
  }
}

// POST /api/orders - Create new order
export const createOrder = (req, res) => {
  try {
    const validation = validateOrder(req.body)
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.errors 
      })
    }

    // Verify customer exists
    const customer = db.customers.getById(req.body.customerId)
    if (!customer) {
      return res.status(400).json({ message: 'Customer not found' })
    }

    const sanitizedData = sanitizeOrder(req.body)
    // Set customerName from customer if not provided
    if (!sanitizedData.customerName && customer) {
      sanitizedData.customerName = customer.name
    }
    
    const newOrder = db.orders.create(sanitizedData)
    
    res.status(201).json(newOrder)
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message })
  }
}

// PUT /api/orders/:id - Update order
export const updateOrder = (req, res) => {
  try {
    const { id } = req.params
    const validation = validateOrder(req.body)
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.errors 
      })
    }

    // Verify customer exists if customerId is being updated
    if (req.body.customerId) {
      const customer = db.customers.getById(req.body.customerId)
      if (!customer) {
        return res.status(400).json({ message: 'Customer not found' })
      }
    }

    const sanitizedData = sanitizeOrder(req.body)
    const updatedOrder = db.orders.update(id, sanitizedData)
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    res.json(updatedOrder)
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message })
  }
}

// DELETE /api/orders/:id - Delete order
export const deleteOrder = (req, res) => {
  try {
    const { id } = req.params
    const deleted = db.orders.delete(id)
    
    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    res.status(200).json({ message: 'Order deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message })
  }
}

// GET /api/orders/paged - Get paginated orders
export const getPagedOrders = (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1
    const pageSize = parseInt(req.query.pageSize) || 100
    
    const result = db.orders.getPaged(pageNumber, pageSize)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message })
  }
}

// GET /api/customers/:customerId/orders/paged - Get paginated orders for a customer
export const getCustomerOrdersPaged = (req, res) => {
  try {
    const { customerId } = req.params
    const pageNumber = parseInt(req.query.pageNumber) || 1
    const pageSize = parseInt(req.query.pageSize) || 100
    
    // Verify customer exists
    const customer = db.customers.getById(customerId)
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    
    const result = db.orders.getByCustomerId(customerId, pageNumber, pageSize)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer orders', error: error.message })
  }
}

