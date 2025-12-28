import { useState, useEffect, useCallback, useMemo } from 'react'
import { customersAPI } from '../../services/api'
import { PencilIcon, TrashIcon, MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import Tooltip from '../Tooltip'

function CustomerList({ onEdit, refreshTrigger }) {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await customersAPI.getAll()
      setCustomers(response.data || [])
    } catch (err) {
      setError('Failed to fetch customers. Please check if the server is running.')
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers, refreshTrigger])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return
    }

    try {
      await customersAPI.delete(id)
      fetchCustomers()
    } catch (err) {
      alert('Failed to delete customer')
      console.error('Error deleting customer:', err)
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.phone?.toLowerCase().includes(searchLower) ||
        customer.address?.toLowerCase().includes(searchLower)
      )
    })

    filtered.sort((a, b) => {
      const aValue = a[sortField] || ''
      const bValue = b[sortField] || ''
      const comparison = aValue.toString().localeCompare(bValue.toString())
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [customers, searchTerm, sortField, sortDirection])

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedCustomers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedCustomers, currentPage])

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / itemsPerPage)

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

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-100 dark:border-slate-700">
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004e98] dark:border-[#00a8e8]"></div>
            <div className="text-gray-500 dark:text-gray-400">Loading customers...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-red-200 dark:border-red-800">
        <div className="text-center text-red-600 dark:text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors duration-300">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <UserGroupIcon className="h-6 w-6 text-[#004e98] dark:text-[#00a8e8]" />
            <span>Customers List</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({filteredAndSortedCustomers.length})
            </span>
          </h2>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#004e98] dark:focus:ring-[#00a8e8] transition-colors"
            />
          </div>
        </div>
      </div>

      {filteredAndSortedCustomers.length === 0 ? (
        <div className="p-12 text-center">
          <UserGroupIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
            {searchTerm ? 'No customers found' : 'No customers yet'}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Add your first customer using the form above'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="name">Name</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="email">Email</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="phone">Phone</SortButton>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <SortButton field="address">Address</SortButton>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {paginatedCustomers.map((customer) => (
                  <tr
                    key={customer._id || customer.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {customer.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {customer.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {customer.address || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Tooltip content="Edit customer">
                          <button
                            onClick={() => onEdit(customer)}
                            className="p-2 text-[#004e98] dark:text-[#00a8e8] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Delete customer">
                          <button
                            onClick={() => handleDelete(customer._id || customer.id)}
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
            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredAndSortedCustomers.length)} of{' '}
                  {filteredAndSortedCustomers.length} customers
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                  : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
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
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default CustomerList

