import { db } from '../data/db.js'
import { validateCustomer, sanitizeCustomer } from '../models/customer.js'

// GET /api/customers - Get all customers
export const getAllCustomers = (req, res) => {
  try {
    const customers = db.customers.getAll()
    res.json(customers)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message })
  }
}

// GET /api/customers/:id - Get customer by ID
export const getCustomerById = (req, res) => {
  try {
    const { id } = req.params
    const customer = db.customers.getById(id)
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    
    res.json(customer)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error: error.message })
  }
}

// POST /api/customers - Create new customer
export const createCustomer = (req, res) => {
  try {
    const validation = validateCustomer(req.body)
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.errors 
      })
    }

    const sanitizedData = sanitizeCustomer(req.body)
    const newCustomer = db.customers.create(sanitizedData)
    
    res.status(201).json(newCustomer)
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error: error.message })
  }
}

// PUT /api/customers/:id - Update customer
export const updateCustomer = (req, res) => {
  try {
    const { id } = req.params
    const validation = validateCustomer(req.body)
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validation.errors 
      })
    }

    const sanitizedData = sanitizeCustomer(req.body)
    const updatedCustomer = db.customers.update(id, sanitizedData)
    
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    
    res.json(updatedCustomer)
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error: error.message })
  }
}

// DELETE /api/customers/:id - Delete customer
export const deleteCustomer = (req, res) => {
  try {
    const { id } = req.params
    const deleted = db.customers.delete(id)
    
    if (!deleted) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    
    res.status(200).json({ message: 'Customer deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error: error.message })
  }
}

// GET /api/customers/paged - Get paginated customers
export const getPagedCustomers = (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 1
    const pageSize = parseInt(req.query.pageSize) || 100
    
    const result = db.customers.getPaged(pageNumber, pageSize)
    res.json(result)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message })
  }
}

