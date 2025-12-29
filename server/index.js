import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import customersRoutes from './routes/customersRoutes.js'
import ordersRoutes from './routes/ordersRoutes.js'
import { getCustomerOrdersPaged } from './controllers/ordersController.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/customers', customersRoutes)
app.use('/api/orders', ordersRoutes)

// GET /api/customers/:customerId/orders/paged - Get paginated orders for a customer
app.get('/api/customers/:customerId/orders/paged', getCustomerOrdersPaged)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api`)
})

