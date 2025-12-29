import { useState, useEffect } from 'react'
import { customersAPI } from '../../services/api'

function CustomerForm({ customer, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      })
    }
  }, [customer])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (customer) {
        await customersAPI.update(customer.id, formData)
      } else {
        await customersAPI.create(formData)
      }
      onSuccess()
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save customer')
      console.error('Error saving customer:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-md p-6 mb-6 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {customer ? 'Edit Customer' : 'Add New Customer'}
      </h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-400 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-400 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-400 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-400 dark:border-slate-600 rounded-lg shadow-sm bg-slate-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:border-transparent transition-colors"
            />
          </div>
        </div>
        <div className="mt-6 flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#004e98] dark:bg-[#00a8e8] text-white rounded-lg hover:bg-[#003d7a] dark:hover:bg-[#0085b8] focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {loading ? 'Saving...' : customer ? 'Update Customer' : 'Add Customer'}
          </button>
          {customer && (
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

export default CustomerForm


