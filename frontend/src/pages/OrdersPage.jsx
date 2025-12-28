import { useState } from 'react'
import OrderForm from '../components/orders/OrderForm'
import OrderList from '../components/orders/OrderList'

function OrdersPage() {
  const [editingOrder, setEditingOrder] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = () => {
    setEditingOrder(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEdit = (order) => {
    setEditingOrder(order)
  }

  const handleCancel = () => {
    setEditingOrder(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
          Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage all your orders
        </p>
      </div>
      <OrderForm
        order={editingOrder}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
      <OrderList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
    </div>
  )
}

export default OrdersPage


