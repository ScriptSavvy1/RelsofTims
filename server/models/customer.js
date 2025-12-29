// Customer model/schema validation
export const validateCustomer = (customerData) => {
  const errors = []

  if (customerData.name !== undefined && customerData.name !== null && typeof customerData.name !== 'string') {
    errors.push('Name must be a string')
  }

  if (customerData.email !== undefined && customerData.email !== null && typeof customerData.email !== 'string') {
    errors.push('Email must be a string')
  }

  if (customerData.phone !== undefined && customerData.phone !== null && typeof customerData.phone !== 'string') {
    errors.push('Phone must be a string')
  }

  if (customerData.address !== undefined && customerData.address !== null && typeof customerData.address !== 'string') {
    errors.push('Address must be a string')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export const sanitizeCustomer = (customerData) => {
  return {
    name: customerData.name || null,
    email: customerData.email || null,
    phone: customerData.phone || null,
    address: customerData.address || null
  }
}

