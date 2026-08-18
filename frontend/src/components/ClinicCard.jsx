import { Link } from 'react-router-dom'

export default function ClinicCard({ clinic }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{clinic.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{clinic.address}</p>
          <p className="mt-1 text-sm font-medium text-sky-700">{clinic.city}, {clinic.state} · {clinic.pincode}</p>
        </div>
        {clinic.distance_km != null && (
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700">
            {clinic.distance_km.toFixed(1)} km away
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {clinic.specialties.map((specialty) => (
          <span key={specialty} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {specialty}
          </span>
        ))}
      </div>
      <Link to={`/clinics/${clinic.id}`} className="mt-5 inline-block text-sm font-semibold text-sky-700 hover:text-sky-800">
        View clinic details →
      </Link>
    </article>
  )
}
