import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({ baseURL: `${API_BASE}/api`, headers: { 'Content-Type': 'application/json' } })

export const submitContact = (data) => api.post('/contact', data).then(r => r.data)
export const submitBooking = (data) => api.post('/booking', data).then(r => r.data)

export default api