import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getClinicById } from '../api/clinics'
import MapView from '../components/MapView'

export default function ClinicDetail() {
  const { id } = useParams()
  const [clinic, setClinic] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getClinicById(id).then(({ data }) => setClinic(data)).catch((requestError) => setError(requestError.response?.data?.detail ?? 'Could not load this clinic.'))
  }, [id])

  if (error) return <main className="mx-auto max-w-6xl px-4 py-10 text-red-600">{error}</main>
  if (!clinic) return <main className="mx-auto max-w-6xl px-4 py-10 text-slate-600">Loading clinic…</main>

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to="/" className="text-sm font-semibold text-sky-700">← Back to clinics</Link>
      <div className="mt-5 grid gap-8 lg:grid-cols-2">
        <section>
          <h1 className="text-3xl font-bold">{clinic.name}</h1>
          <p className="mt-3 text-slate-600">{clinic.address}</p>
          <p className="text-slate-600">{clinic.city}, {clinic.state} · {clinic.pincode}</p>
          <a href={`tel:${clinic.phone}`} className="mt-5 inline-block rounded-md bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Call Clinic</a>
          <div className="mt-7"><MapView clinics={[clinic]} /></div>
        </section>
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-semibold">Doctors</h2>
          <div className="mt-4 space-y-4">
            {clinic.doctors.map((doctor) => (
              <article key={doctor.id} className="rounded-lg border border-slate-200 p-4">
                <h3 className="font-semibold">{doctor.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{doctor.specialization} · {doctor.experience_years} years experience</p>
                <Link to={`/doctors/${doctor.id}/slots`} className="mt-3 inline-block rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700">Book Appointment</Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
