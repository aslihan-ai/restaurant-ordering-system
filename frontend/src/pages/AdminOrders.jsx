import { useEffect, useState } from 'react'
import api from '../services/api'
import AdminNav from '../components/AdminNav'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders')
      setOrders(response.data.data)
    } catch (err) {
      setError('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, {
        status: status,
      })

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: status }
            : order
        )
      )
    } catch (err) {
      alert('Failed to update order status.')
    }
  }

  if (loading) {
    return (
      <>
        <AdminNav />
        <div className="admin-orders">Loading orders...</div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <AdminNav />
        <div className="admin-orders">{error}</div>
      </>
    )
  }

  return (
    <>
      <AdminNav />

      <div className="admin-orders">
        <h1>Admin Orders</h1>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <h2>Order #{order.id}</h2>

                  <span
                    className={`order-status ${order.status}`}
                  >
                    {order.status}
                  </span>
                </div>

                <p>
                  <strong>Customer:</strong>{' '}
                  {order.customer_name}
                </p>

                <p>
                  <strong>Phone:</strong>{' '}
                  {order.customer_phone}
                </p>

                <h3>Items</h3>

                <ul>
                  {order.order_items.map((item) => (
                    <li key={item.id}>
                      {item.menu_item.name} × {item.quantity} —{' '}
                      {(
                        Number(item.price) * item.quantity
                      ).toFixed(2)}{' '}
                      ETB
                    </li>
                  ))}
                </ul>

                <div className="order-total">
                  Total:{' '}
                  {Number(order.total_amount).toFixed(2)} ETB
                </div>

                <div className="status-controls">
                  <label htmlFor={`status-${order.id}`}>
                    Update Status:
                  </label>

                  <select
                    id={`status-${order.id}`}
                    value={order.status}
                    onChange={(event) =>
                      updateStatus(
                        order.id,
                        event.target.value
                      )
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">
                      Completed
                    </option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default AdminOrders