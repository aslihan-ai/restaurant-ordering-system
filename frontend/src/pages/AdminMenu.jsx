import { useEffect, useState } from 'react'
import api from '../services/api'
import AdminNav from '../components/AdminNav'

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    available: true,
  })

  const [editingId, setEditingId] = useState(null)

  const loadData = async () => {
    try {
      const [menuResponse, categoryResponse] = await Promise.all([
        api.get('/admin/menu'),
        api.get('/categories'),
      ])

      setMenuItems(menuResponse.data.data)
      setCategories(categoryResponse.data.data)
    } catch (err) {
      setError('Failed to load menu data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const resetForm = () => {
    setForm({
      category_id: '',
      name: '',
      description: '',
      price: '',
      available: true,
    })

    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const data = {
        category_id: Number(form.category_id),
        name: form.name,
        description: form.description,
        price: Number(form.price),
        available: form.available,
      }

      if (editingId) {
        const response = await api.put(`/admin/menu/${editingId}`, data)

        setMenuItems((currentItems) =>
          currentItems.map((item) =>
            item.id === editingId ? response.data.data : item
          )
        )
      } else {
        const response = await api.post('/admin/menu', data)

        setMenuItems((currentItems) => [
          response.data.data,
          ...currentItems,
        ])
      }

      resetForm()
    } catch (err) {
      alert('Failed to save menu item.')
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)

    setForm({
      category_id: item.category_id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      available: item.available,
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this menu item?'
    )

    if (!confirmed) {
      return
    }

    try {
      await api.delete(`/admin/menu/${id}`)

      setMenuItems((currentItems) =>
        currentItems.filter((item) => item.id !== id)
      )
    } catch (err) {
      alert('Failed to delete menu item.')
    }
  }

  const handleAvailability = async (item) => {
    try {
      const response = await api.put(`/admin/menu/${item.id}`, {
        available: !item.available,
      })

      setMenuItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? response.data.data
            : currentItem
        )
      )
    } catch (err) {
      alert('Failed to update availability.')
    }
  }

  if (loading) {
    return (
      <>
        <AdminNav />
        <div className="admin-menu">Loading menu...</div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <AdminNav />
        <div className="admin-menu">{error}</div>
      </>
    )
  }

  return (
    <>
      <AdminNav />

      <div className="admin-menu">
        <h1>Admin Menu Management</h1>

        <form className="admin-menu-form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</h2>

          <label>
            Category
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Menu item name"
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Menu item description"
            />
          </label>

          <label>
            Price
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="Price in ETB"
              required
            />
          </label>

          <label className="availability-checkbox">
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />
            Available
          </label>

          <div className="form-buttons">
            <button type="submit">
              {editingId ? 'Update Item' : 'Add Item'}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-menu-list">
          <h2>Current Menu</h2>

          {menuItems.length === 0 ? (
            <p>No menu items found.</p>
          ) : (
            menuItems.map((item) => (
              <div className="admin-menu-card" key={item.id}>
                <h3>{item.name}</h3>

                <p>
                  <strong>Category:</strong>{' '}
                  {item.category?.name || 'Unknown'}
                </p>

                <p>
                  <strong>Price:</strong>{' '}
                  {Number(item.price).toFixed(2)} ETB
                </p>

                <p>
                  <strong>Description:</strong>{' '}
                  {item.description || 'No description'}
                </p>

                <p>
                  <strong>Available:</strong>{' '}
                  {item.available ? 'Yes' : 'No'}
                </p>

                <div className="admin-menu-actions">
                  <button onClick={() => handleEdit(item)}>
                    Edit
                  </button>

                  <button onClick={() => handleAvailability(item)}>
                    {item.available
                      ? 'Mark Unavailable'
                      : 'Mark Available'}
                  </button>

                  <button onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default AdminMenu