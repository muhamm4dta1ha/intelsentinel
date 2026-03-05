import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000
})

export const fetchStats = () => api.get('/incidents/stats').then(r => r.data)
export const fetchIncidents = (params = {}) => api.get('/incidents', { params }).then(r => r.data)
export const fetchMapData = (params = {}) => api.get('/incidents/map', { params }).then(r => r.data)
export const fetchIncident = (id) => api.get(`/incidents/${id}`).then(r => r.data)
export const fetchYears = () => api.get('/incidents/years').then(r => r.data)
export const uploadFile = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).then(r => r.data)

export default api
