import { useState } from 'react'

import { getNearbyClinics } from '../api/clinics'
import ClinicCard from './ClinicCard'
import MapView from './MapView'

export default function NearMeTab() {
  const [clinics, setClinics] = useState([])
  const [center, setCenter] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const findNearby = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }
    setError('')
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          setCenter([coords.latitude, coords.longitude])
          const { data } = await getNearbyClinics(coords.latitude, coords.longitude)
          setClinics(data)
        } catch (requestError) {
          setError(requestError.response?.data?.detail ?? 'Could not find nearby clinics.')
        } finally {
          setIsLoading(false)
        }
      },
      () => {
        setIsLoading(false)
        setError('Location access is required to find clinics near you.')
      },
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-sky-50 p-6">
        <h2 className="text-xl font-semibold">Find clinics near you</h2>
        <p className="mt-1 text-sm text-slate-600">Use your current location to see clinics within 5 km.</p>
        <button onClick={findNearby} disabled={isLoading} className="mt-4 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60">
          {isLoading ? 'Finding clinics…' : 'Use my location'}
        </button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
      <MapView clinics={clinics} center={center} />
      {clinics.length > 0 && <div className="grid gap-4 md:grid-cols-2">{clinics.map((clinic) => <ClinicCard key={clinic.id} clinic={clinic} />)}</div>}
    </section>
  )
}
