import { useState } from 'react'

import { searchClinics } from '../api/clinics'
import ClinicCard from './ClinicCard'
import MapView from './MapView'

const initialFilters = { city: '', state: '', pincode: '', specialty: '', sort: 'rating' }

export default function CitySearchTab() {
  const [filters, setFilters] = useState(initialFilters)
  const [clinics, setClinics] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const { data } = await searchClinics(filters)
      setClinics(data)
    } catch (requestError) {
      setError(requestError.response?.data?.detail ?? 'Could not search clinics.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:grid-cols-2 lg:grid-cols-5">
        {[['city', 'City'], ['state', 'State'], ['pincode', 'Pincode'], ['specialty', 'Specialty']].map(([name, label]) => (
          <label key={name} className="text-sm font-medium text-slate-700">{label}
            <input value={filters[name]} onChange={(event) => setFilters({ ...filters, [name]: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-sky-500" placeholder={`Enter ${label.toLowerCase()}`} />
          </label>
        ))}
        <div className="flex items-end">
          <button disabled={isLoading} className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60">
            {isLoading ? 'Searching…' : 'Search clinics'}
          </button>
        </div>
        <p className="sm:col-span-2 lg:col-span-5 text-sm text-slate-500">Search any city across India—there is no distance limit.</p>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <MapView clinics={clinics} />
      {clinics.length > 0 ? <div className="grid gap-4 md:grid-cols-2">{clinics.map((clinic) => <ClinicCard key={clinic.id} clinic={clinic} />)}</div> : !isLoading && <p className="text-sm text-slate-500">Search by city, state, pincode, or specialty to find clinics.</p>}
    </section>
  )
}
