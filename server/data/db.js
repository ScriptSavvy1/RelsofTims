// In-memory database storage
let customers = []
let orders = []
let customerIdCounter = 1
let orderIdCounter = 1

export const db = {
  // Customers
  customers: {
    getAll: () => [...customers],
    getById: (id) => customers.find(c => c.id === parseInt(id)),
    create: (customerData) => {
      const newCustomer = {
        id: customerIdCounter++,
        ...customerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      customers.push(newCustomer)
      return newCustomer
    },
    update: (id, customerData) => {
      const index = customers.findIndex(c => c.id === parseInt(id))
      if (index === -1) return null
      customers[index] = {
        ...customers[index],
        ...customerData,
        updatedAt: new Date().toISOString()
      }
      return customers[index]
    },
    delete: (id) => {
      const index = customers.findIndex(c => c.id === parseInt(id))
      if (index === -1) return false
      customers.splice(index, 1)
      // Also delete related orders
      orders = orders.filter(o => o.customerId !== parseInt(id))
      return true
    },
    getPaged: (pageNumber = 1, pageSize = 100) => {
      const startIndex = (pageNumber - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedCustomers = customers.slice(startIndex, endIndex)
      return {
        data: paginatedCustomers,
        totalCount: customers.length,
        pageNumber,
        pageSize,
        totalPages: Math.ceil(customers.length / pageSize)
      }
    }
  },

  // Orders
  orders: {
    getAll: () => [...orders],
    getById: (id) => orders.find(o => o.id === parseInt(id)),
    create: (orderData) => {
      const newOrder = {
        id: orderIdCounter++,
        orderNumber: orderData.orderNumber || `ORD-${orderIdCounter - 1}`,
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      orders.push(newOrder)
      return newOrder
    },
    update: (id, orderData) => {
      const index = orders.findIndex(o => o.id === parseInt(id))
      if (index === -1) return null
      orders[index] = {
        ...orders[index],
        ...orderData,
        updatedAt: new Date().toISOString()
      }
      return orders[index]
    },
    delete: (id) => {
      const index = orders.findIndex(o => o.id === parseInt(id))
      if (index === -1) return false
      orders.splice(index, 1)
      return true
    },
    getPaged: (pageNumber = 1, pageSize = 100) => {
      const startIndex = (pageNumber - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedOrders = orders.slice(startIndex, endIndex)
      return {
        data: paginatedOrders,
        totalCount: orders.length,
        pageNumber,
        pageSize,
        totalPages: Math.ceil(orders.length / pageSize)
      }
    },
    getByCustomerId: (customerId, pageNumber = 1, pageSize = 100) => {
      const customerOrders = orders.filter(o => o.customerId === parseInt(customerId))
      const startIndex = (pageNumber - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedOrders = customerOrders.slice(startIndex, endIndex)
      return {
        data: paginatedOrders,
        totalCount: customerOrders.length,
        pageNumber,
        pageSize,
        totalPages: Math.ceil(customerOrders.length / pageSize)
      }
    }
  }
}

