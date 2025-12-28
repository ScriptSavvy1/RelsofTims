import { useState, useEffect, useCallback, useMemo } from 'react'
import { ordersAPI } from '../../services/api'
import { PencilIcon, TrashIcon, MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import Tooltip from '../Tooltip'

function OrderList({ onEdit, refreshTrigger }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('orderDate')
  const [sortDirection, setSortDirection] = useState('desc')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ordersAPI.getAll()
      setOrders(response.data || [])
    } catch (err) {
      setError('Failed to fetch orders. Please check if the server is running.')
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders, refreshTrigger])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return
    }

    try {
      await ordersAPI.delete(id)
      fetchOrders()
    } catch (err) {
      alert('Failed to delete order')
      console.error('Error deleting order:', err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter((order) => {
      const matchesSearch =
        (order.orderNumber?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerName || order.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.productName || order.product || '').toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || (order.status || 'pending') === statusFilter
      
      return matchesSearch && matchesStatus
    })

    filtered.sort((a, b) => {
      let aValue, bValue
      
      if (sortField === 'orderDate' || sortField === 'date') {
        aValue = new Date(a.orderDate || a.date || 0)
        bValue = new Date(b.orderDate || b.date || 0)
      } else if (sortField === 'amount' || sortField === 'total') {
        aValue = a.amount || a.total || 0
        bValue = b.amount || b.total || 0
      } else if (sortField === 'quantity') {
        aValue = a.quantity || 0
        bValue = b.quantity || 0
      } else {
        aValue = a[sortField] || ''
        bValue = b[sortField] || ''
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      const comparison = aValue.toString().localeCompare(bValue.toString())
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [orders, searchTerm, statusFilter, sortField, sortDirection])

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedOrders, currentPage])

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage)

  const SortButton = ({ field, children }) => {
    const isActive = sortField === field
    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center space-x-1 hover:text-[#004e98] dark:hover:text-[#00a8e8] transition-colors"
      >
        <span>{children}</span>
        {isActive && (
          sortDirection === 'asc' ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )
        )}
      </button>
    )
  }

  const getStatusBadgeClass = (status) => {
    const statusLower = (status || 'pending').toLowerCase()
    if (statusLower === 'completed') {
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
    } else if (statusLower === 'pending') {
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
    } else if (statusLower === 'cancelled') {
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
    }
    return 'bg-slate-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
  }

  if (loading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004e98] dark:border-[#00a8e8]"></div>
            <div className="text-gray-500 dark:text-gray-400">Loading orders...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-red-200 dark:border-red-800">
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="px-6 py-4 border-b border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <ShoppingBagIcon className="h-6 w-6 text-[#004e98] dark:text-[#00a8e8]" />
              <span>Orders List</span>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({filteredAndSortedOrders.length})
              </span>
            </h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-slate-400 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-slate-400 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredAndSortedOrders.length === 0 ? (
        <div className="p-12 text-center">
          <ShoppingBagIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No orders found' : 'No orders yet'}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first order using the form above'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="orderNumber">Order ID</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="customerName">Customer</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="productName">Product</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="quantity">Quantity</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="amount">Amount</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="orderDate">Date</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="status">Status</SortButton>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-50 dark:bg-slate-800 divide-y divide-slate-300 dark:divide-slate-700">
                {paginatedOrders.map((order) => (
                  <tr
                    key={order._id || order.id}
                    className="hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{order.orderNumber || order._id?.slice(-6) || order.id?.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.customerName || order.customer?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.productName || order.product || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {order.quantity || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(order.amount || order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.orderDate || order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}
                      >
                        {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Tooltip content="Edit order">
                          <button
                            onClick={() => onEdit(order)}
                            className="p-2 text-[#004e98] dark:text-[#00a8e8] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Delete order">
                          <button
                            onClick={() => handleDelete(order._id || order.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length)} of{' '}
                  {filteredAndSortedOrders.length} orders
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-slate-50 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        if (totalPages <= 7) return true
                        if (page === 1 || page === totalPages) return true
                        if (Math.abs(page - currentPage) <= 1) return true
                        return false
                      })
                      .map((page, index, array) => {
                        const showEllipsis = index > 0 && page - array[index - 1] > 1
                        return (
                          <div key={page} className="flex items-center space-x-1">
                            {showEllipsis && (
                              <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                  ? 'bg-[#004e98] dark:bg-[#00a8e8] text-white'
                                  : 'text-gray-700 dark:text-gray-300 bg-slate-50 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        )
                      })}
                  </div>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-slate-50 dark:bg-slate-800 border border-slate-400 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OrderList

