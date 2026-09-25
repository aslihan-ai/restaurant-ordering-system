import { useEffect, useState } from 'react'
import api from '../services/api'
import AdminNav from '../components/AdminNav'

function AdminDashboard() {
  const [menuItems, setMenuItems] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [menuResponse, orderResponse] = await Promise.all([
          api.get('/admin/menu'),
          api.get('/orders'),
        ])

        setMenuItems(menuResponse.data.data)
        setOrders(orderResponse.data.data)
      } catch (error) {
        console.error('Failed to load dashboard data.', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <>
        <AdminNav />
        <div>Loading dashboard...</div>
      </>
    )
  }

  const availableItems = menuItems.filter(
    (item) => item.available
  )

  const pendingOrders = orders.filter(
    (order) => order.status === 'pending'
  )

  return (
    <>
      <AdminNav />

      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

        <div className="dashboard-stats">
          <div className="dashboard-card">
            <h2>Total Menu Items</h2>
            <p>{menuItems.length}</p>
          </div>

          <div className="dashboard-card">
            <h2>Available Items</h2>
            <p>{availableItems.length}</p>
          </div>

          <div className="dashboard-card">
            <h2>Total Orders</h2>
            <p>{orders.length}</p>
          </div>

          <div className="dashboard-card">
            <h2>Pending Orders</h2>
            <p>{pendingOrders.length}</p>
          </div>
        </div>

        <div className="dashboard-links">
          <a href="/admin/menu">Manage Menu</a>
          <a href="/admin/orders">Manage Orders</a>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard

