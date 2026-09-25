import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getCategories = async () => {
  const response = await api.get('/categories')
  return response.data
}

export const getMenuItems = async () => {
  const response = await api.get('/menu')
  return response.data
}

export const getMenuItem = async (id) => {
  const response = await api.get('/menu/' + id)
  return response.data
}

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData)
  return response.data
}

export const getCustomerOrder = async (orderId, phone) => {
  const response = await api.get(`/orders/${orderId}`, {
    params: {
      phone: phone,
    },
  })

  return response.data
}

export default api

