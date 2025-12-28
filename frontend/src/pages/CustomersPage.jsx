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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
          Customers
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your customer database
        </p>
      </div>
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


