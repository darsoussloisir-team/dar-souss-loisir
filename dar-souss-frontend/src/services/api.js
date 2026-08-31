import axios from 'axios'

const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })

export const submitContact = (data) => api.post('/contact', data).then(r => r.data)
export const submitBooking = (data) => api.post('/booking', data).then(r => r.data)

export default api