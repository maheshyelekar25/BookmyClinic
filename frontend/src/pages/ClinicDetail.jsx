import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getClinicById } from '../api/clinics'
import MapView from '../components/MapView'

export default function ClinicDetail() {
  const { id } = useParams()
  const [clinic, setClinic] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getClinicById(id)
      .then(({ data }) => setClinic(data))
      .catch((requestError) => setError(requestError.response?.data?.detail ?? 'Could not load this clinic.'))
  }, [id])

  if (error) return <main className="mx-auto max-w-6xl px-4 py-10 text-red-600">{error}</main>
  if (!clinic) return <main className="mx-auto max-w-6xl px-4 py-10 text-slate-600">Loading clinic…</main>

  return (
    <main className="mx-auto max-w-6xl px-4 py-32 sm:px-6">
      <div className="animate-[fade-in-up_1s_cubic-bezier(0.32,0.72,0,1)_forwards] opacity-0 [animation-delay:200ms]">
        <Link to="/" className="text-sm font-semibold text-soft-muted hover:text-soft-text transition-colors duration-700 ease-fluid tracking-wide">
          ← BACK TO CLINICS
        </Link>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2 animate-[fade-in-up_1s_cubic-bezier(0.32,0.72,0,1)_forwards] opacity-0 [animation-delay:400ms]">
        <section>
          <div className="mb-4 inline-block rounded-full bg-soft-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-soft-text">
            Clinic Details
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-soft-text">{clinic.name}</h1>
          <p className="mt-4 text-lg text-soft-muted leading-relaxed">{clinic.address}</p>
          <p className="mt-1 text-soft-muted leading-relaxed">{clinic.city}, {clinic.state} · {clinic.pincode}</p>

          <a
            href={`tel:${clinic.phone}`}
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-soft-text px-6 py-3 text-sm font-medium text-white transition-all duration-700 ease-fluid hover:scale-[0.98]"
          >
            <span>Call Clinic</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 ease-fluid group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
          </a>

          <div className="mt-12 rounded-[2rem] bg-soft-border/50 p-1.5 ring-1 ring-soft-border">
            <div className="overflow-hidden rounded-[calc(2rem-0.375rem)] bg-soft-surface shadow-soft-inner">
              <MapView clinics={[clinic]} />
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] bg-soft-border/30 p-2 ring-1 ring-soft-border">
          <div className="h-full rounded-[calc(2.5rem-0.5rem)] bg-soft-surface p-8 shadow-soft-inner">
            <h2 className="text-2xl font-bold tracking-tight">Specialists</h2>
            <div className="mt-8 space-y-6">
              {clinic.doctors.map((doctor) => (
                <article key={doctor.id} className="group rounded-3xl border border-soft-border bg-soft-bg p-6 transition-all duration-700 ease-fluid hover:shadow-soft-ambient hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-soft-text">{doctor.name}</h3>
                  <p className="mt-2 text-sm text-soft-muted">{doctor.specialization} · {doctor.experience_years} years experience</p>
                  <Link
                    to={`/doctors/${doctor.id}/slots`}
                    state={{ clinic, doctor }}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-soft-text px-5 py-2.5 text-sm font-medium text-white transition-all duration-700 ease-fluid active:scale-[0.98]"
                  >
                    <span>Book Appointment</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 ease-fluid group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
