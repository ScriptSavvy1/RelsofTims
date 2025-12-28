import { useState, useEffect, useCallback } from 'react'
import { ordersAPI, customersAPI } from '../../services/api'

function OrderForm({ order, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    productName: '',
    quantity: '',
    amount: '',
    orderDate: new Date().toISOString().split('T')[0],
    status: 'pending',
  })
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await customersAPI.getAll()
      setCustomers(response.data || [])
    } catch (err) {
      console.error('Error fetching customers:', err)
    } finally {
      setLoadingCustomers(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  useEffect(() => {
    if (order) {
      setFormData({
        customerId: order.customerId || order.customer?._id || order.customer?.id || '',
        customerName: order.customerName || order.customer?.name || '',
        productName: order.productName || order.product || '',
        quantity: order.quantity || '',
        amount: order.amount || order.total || '',
        orderDate: order.orderDate
          ? new Date(order.orderDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: order.status || 'pending',
      })
    } else {
      setFormData({
        customerId: '',
        customerName: '',
        productName: '',
        quantity: '',
        amount: '',
        orderDate: new Date().toISOString().split('T')[0],
        status: 'pending',
      })
    }
  }, [order])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'customerId') {
      const selectedCustomer = customers.find((c) => (c._id || c.id) === value)
      setFormData((prev) => ({
        ...prev,
        customerId: value,
        customerName: selectedCustomer?.name || '',
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const orderData = {
        customerId: formData.customerId,
        customerName: formData.customerName,
        productName: formData.productName,
        quantity: Number(formData.quantity),
        amount: Number(formData.amount),
        orderDate: formData.orderDate,
        status: formData.status,
      }

      if (order) {
        await ordersAPI.update(order._id || order.id, orderData)
      } else {
        await ordersAPI.create(orderData)
      }
      onSuccess()
      setFormData({
        customerId: '',
        customerName: '',
        productName: '',
        quantity: '',
        amount: '',
        orderDate: new Date().toISOString().split('T')[0],
        status: 'pending',
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save order')
      console.error('Error saving order:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-md p-6 mb-6 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {order ? 'Edit Order' : 'Add New Order'}
      </h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer *
            </label>
            <select
              id="customerId"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              required
              disabled={loadingCustomers}
              className="w-full px-3 py-2 border border-slate-400 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:border-transparent disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer._id || customer.id} value={customer._id || customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-400 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-slate-400 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-slate-400 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="orderDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order Date *
            </label>
            <input
              type="date"
              id="orderDate"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-400 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-400 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:border-transparent transition-colors"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#004e98] dark:bg-[#00a8e8] text-white rounded-lg hover:bg-[#003d7a] dark:hover:bg-[#0085b8] focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {loading ? 'Saving...' : order ? 'Update Order' : 'Add Order'}
          </button>
          {order && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-slate-300 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-slate-400 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default OrderForm

