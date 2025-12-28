import { useState } from 'react'
import CustomerForm from '../components/customers/CustomerForm'
import CustomerList from '../components/customers/CustomerList'

function CustomersPage() {
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = () => {
    setEditingCustomer(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
  }

  const handleCancel = () => {
    setEditingCustomer(null)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Customers</h1>
      <CustomerForm
        customer={editingCustomer}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
      <CustomerList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
    </div>
  )
}

export default CustomersPage

