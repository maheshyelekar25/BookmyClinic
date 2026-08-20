import api from './axios'

export const getNearbyClinics = (lat, lng, radius = 5) =>
  api.get('/clinics/nearby', { params: { lat, lng, radius_km: radius } })

export const searchClinics = (filters) =>
  api.get('/clinics/search', {
    params: Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== '' && value != null),
    ),
  })

export const getClinicById = (id) => api.get(`/clinics/${id}`)

export const createClinic = (payload) => api.post('/clinics', payload)
