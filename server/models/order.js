// Order model/schema validation
export const validateOrder = (orderData) => {
  const errors = []

  if (orderData.customerId === undefined || orderData.customerId === null) {
    errors.push('CustomerId is required')
  } else if (typeof orderData.customerId !== 'number' && !Number.isInteger(Number(orderData.customerId))) {
    errors.push('CustomerId must be an integer')
  }

  if (orderData.customerName !== undefined && orderData.customerName !== null && typeof orderData.customerName !== 'string') {
    errors.push('CustomerName must be a string')
  }

  if (orderData.productName !== undefined && orderData.productName !== null && typeof orderData.productName !== 'string') {
    errors.push('ProductName must be a string')
  }

  if (orderData.quantity !== undefined && orderData.quantity !== null) {
    if (!Number.isInteger(Number(orderData.quantity))) {
      errors.push('Quantity must be an integer')
    }
  }

  if (orderData.amount !== undefined && orderData.amount !== null) {
    if (typeof orderData.amount !== 'number' && isNaN(Number(orderData.amount))) {
      errors.push('Amount must be a number')
    }
  }

  if (orderData.orderDate !== undefined && orderData.orderDate !== null && typeof orderData.orderDate !== 'string') {
    errors.push('OrderDate must be a string')
  }

  if (orderData.status !== undefined && orderData.status !== null && typeof orderData.status !== 'string') {
    errors.push('Status must be a string')
  }

  if (orderData.orderNumber !== undefined && orderData.orderNumber !== null && typeof orderData.orderNumber !== 'string') {
    errors.push('OrderNumber must be a string')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const sanitizeOrder = (orderData) => {
  return {
    customerId: orderData.customerId ? parseInt(orderData.customerId) : null,
    customerName: orderData.customerName || null,
    productName: orderData.productName || null,
    quantity: orderData.quantity !== undefined && orderData.quantity !== null ? parseInt(orderData.quantity) : null,
    amount: orderData.amount !== undefined && orderData.amount !== null ? parseFloat(orderData.amount) : null,
    orderDate: orderData.orderDate || null,
    status: orderData.status || null,
    orderNumber: orderData.orderNumber || null
  }
}

