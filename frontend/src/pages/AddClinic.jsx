import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClinic } from '../api/clinics'

const FIELDS = [
  { key: 'name', label: 'Clinic Name', type: 'text', placeholder: 'Apex Care Clinic', colSpan: 2 },
  { key: 'address', label: 'Address', type: 'text', placeholder: '123 Main Street', colSpan: 2 },
  { key: 'city', label: 'City', type: 'text', placeholder: 'Mumbai', colSpan: 1 },
  { key: 'state', label: 'State', type: 'text', placeholder: 'Maharashtra', colSpan: 1 },
  { key: 'pincode', label: 'Pincode', type: 'text', placeholder: '400001', colSpan: 1 },
  { key: 'phone', label: 'Phone', type: 'text', placeholder: '98765 43210', colSpan: 1 },
  { key: 'lat', label: 'Latitude', type: 'number', step: 'any', placeholder: '19.0760', colSpan: 1 },
  { key: 'lng', label: 'Longitude', type: 'number', step: 'any', placeholder: '72.8777', colSpan: 1 },
  { key: 'specialties', label: 'Specialties (comma separated)', type: 'text', placeholder: 'Cardiology, Orthopedics', colSpan: 2 },
]

export default function AddClinic() {
  const [form, setForm] = useState({
    name: '', address: '', city: '', state: '', pincode: '', 
    phone: '', lat: '', lng: '', specialties: ''
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const payload = {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        specialties: form.specialties.split(',').map(s => s.trim()).filter(Boolean)
      }
      const { data } = await createClinic(payload)
      navigate(`/clinics/${data.id}`)
    } catch (requestError) {
      setError(requestError.response?.data?.detail ?? 'Unable to add clinic.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-32 sm:px-6">
      <div className="animate-[fade-in-up_1s_cubic-bezier(0.32,0.72,0,1)_forwards] opacity-0">
        <div className="mb-6">
          <span className="inline-block rounded-full bg-soft-border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-soft-text">
            Admin Panel
          </span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-soft-text">Add New Clinic</h1>
        <p className="mt-4 text-lg text-soft-muted">Register a new healthcare facility in the system.</p>

        <section className="mt-12 rounded-[2.5rem] bg-soft-border/30 p-2 ring-1 ring-soft-border shadow-soft-ambient">
          <div className="rounded-[calc(2.5rem-0.5rem)] bg-soft-surface p-8 shadow-soft-inner sm:p-12">
            <form className="grid grid-cols-1 gap-6 sm:grid-cols-2" onSubmit={handleSubmit}>
              {FIELDS.map(({ key, label, type, placeholder, step, colSpan }) => (
                <label key={key} className={`block ${colSpan === 2 ? 'sm:col-span-2' : ''}`}>
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-soft-text">{label}</span>
                  <input
                    type={type}
                    required
                    step={step}
                    value={form[key]}
                    placeholder={placeholder}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="mt-2 block w-full rounded-2xl border-none bg-soft-bg px-4 py-3 text-soft-text placeholder:text-soft-muted/50 shadow-soft-inner focus:outline-none focus:ring-1 focus:ring-soft-border transition-shadow duration-500"
                  />
                </label>
              ))}

              {error && (
                <div className="sm:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="sm:col-span-2 mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-full px-6 py-4 font-semibold text-soft-muted transition-colors hover:text-soft-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex items-center gap-3 rounded-full bg-soft-text px-8 py-4 font-semibold text-white transition-all duration-700 ease-fluid hover:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  <span>{isSubmitting ? 'Saving…' : 'Add Clinic'}</span>
                  {!isSubmitting && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 ease-fluid group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
