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
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders</h1>
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

