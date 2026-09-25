import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'

function AdminNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout request failed.', error)
    } finally {
      localStorage.removeItem('admin_token')
      navigate('/admin/login')
    }
  }

  return (
    <nav className="admin-nav">
      <div className="admin-nav-title">
        <Link to="/admin">Restaurant Admin</Link>
      </div>

      <div className="admin-nav-links">
        <Link
          to="/admin"
          className={location.pathname === '/admin' ? 'active' : ''}
        >
          Dashboard
        </Link>

        <Link
          to="/admin/menu"
          className={location.pathname === '/admin/menu' ? 'active' : ''}
        >
          Menu
        </Link>

        <Link
          to="/admin/orders"
          className={location.pathname === '/admin/orders' ? 'active' : ''}
        >
          Orders
        </Link>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default AdminNav