import { useState, useEffect } from 'react'
import { customersAPI, ordersAPI } from '../services/api'
import { UserGroupIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    loading: true,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customersRes, ordersRes] = await Promise.all([
          customersAPI.getAll(),
          ordersAPI.getAll(),
        ])
        setStats({
          customers: customersRes.data?.length || 0,
          orders: ordersRes.data?.length || 0,
          loading: false,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats({ customers: 0, orders: 0, loading: false })
      }
    }

    fetchStats()
  }, [])

  if (stats.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.customers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <ShoppingBagIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.orders}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

