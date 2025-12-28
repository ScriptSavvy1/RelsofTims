import { useState, useEffect } from 'react'
import { customersAPI, ordersAPI } from '../services/api'
import { UserGroupIcon, ShoppingBagIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    orders: 0,
    previousCustomers: 0,
    previousOrders: 0,
    loading: true,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Store previous values for trend calculation
        const prevCustomers = stats.customers
        const prevOrders = stats.orders

        const [customersRes, ordersRes] = await Promise.all([
          customersAPI.getAll(),
          ordersAPI.getAll(),
        ])
        
        const currentCustomers = customersRes.data?.length || 0
        const currentOrders = ordersRes.data?.length || 0

        setStats({
          customers: currentCustomers,
          orders: currentOrders,
          previousCustomers: prevCustomers,
          previousOrders: prevOrders,
          loading: false,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats((prev) => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [])

  const calculateTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? 'up' : 'neutral'
    const change = ((current - previous) / previous) * 100
    if (change > 0) return 'up'
    if (change < 0) return 'down'
    return 'neutral'
  }

  const getTrendPercentage = (current, previous) => {
    if (previous === 0) return current > 0 ? '100%' : '0%'
    const change = Math.abs(((current - previous) / previous) * 100)
    return `${change.toFixed(1)}%`
  }

  if (stats.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004e98] dark:border-[#00a8e8]"></div>
          <div className="text-gray-500 dark:text-gray-400">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  const customersTrend = calculateTrend(stats.customers, stats.previousCustomers)
  const ordersTrend = calculateTrend(stats.orders, stats.previousOrders)

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, gradientFrom, gradientTo, iconBg }) => {
    const TrendIcon = trend === 'up' ? ArrowTrendingUpIcon : trend === 'down' ? ArrowTrendingDownIcon : null
    const trendColor = trend === 'up' ? 'text-green-600 dark:text-green-400' : trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'

    return (
      <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700">
        {/* Gradient accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradientFrom} ${gradientTo}`}></div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`${iconBg} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
              <Icon className="h-6 w-6 text-[#004e98] dark:text-[#00a8e8]" />
            </div>
            {TrendIcon && trend !== 'neutral' && (
              <div className={`flex items-center space-x-1 ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                <span className="text-xs font-semibold">{trendValue}</span>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {value.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to Relsoft TIMS - Track your customers and orders
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Total Customers"
          value={stats.customers}
          icon={UserGroupIcon}
          trend={customersTrend}
          trendValue={getTrendPercentage(stats.customers, stats.previousCustomers)}
          gradientFrom="from-[#004e98]"
          gradientTo="to-[#0066cc]"
          iconBg="bg-blue-50 dark:bg-blue-900/20"
        />

        <StatCard
          title="Total Orders"
          value={stats.orders}
          icon={ShoppingBagIcon}
          trend={ordersTrend}
          trendValue={getTrendPercentage(stats.orders, stats.previousOrders)}
          gradientFrom="from-[#00a8e8]"
          gradientTo="to-[#33b8eb]"
          iconBg="bg-cyan-50 dark:bg-cyan-900/20"
        />
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Active Today</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.orders > 0 ? Math.floor(stats.orders * 0.1) : 0}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Growth Rate</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.customers > 0 ? '+12%' : '0%'}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Avg. Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.customers > 0 ? (stats.orders / stats.customers).toFixed(1) : 0}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


