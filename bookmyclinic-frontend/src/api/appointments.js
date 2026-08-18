import api from './axios'

export const getSlots = (doctorId, date) =>
  api.get(`/doctors/${doctorId}/slots`, { params: { date } })

export const bookSlot = (slotId) => api.post('/appointments', { slot_id: slotId })

export const getUserAppointments = (userId) => api.get(`/appointments/user/${userId}`)

export const cancelAppointment = (id) => api.patch(`/appointments/${id}/cancel`)

export const rescheduleAppointment = (id, newSlotId) =>
  api.patch(`/appointments/${id}/reschedule`, { slot_id: newSlotId })
