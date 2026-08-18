import { formatTime } from './SlotPicker'

const readableDate = (value) => new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(new Date(`${value}T00:00:00`))

export default function AppointmentCard({ appointment, onCancel, onReschedule, busy }) {
  const { slot } = appointment
  const doctor = slot.doctor
  const clinic = doctor?.clinic
  const cancelled = appointment.status === 'cancelled'

  return (
    <article className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold">{clinic?.name ?? 'Clinic appointment'}</p>
          <p className="mt-1 text-sm text-slate-600">{doctor?.name ?? 'Doctor'}{doctor?.specialization ? ` · ${doctor.specialization}` : ''}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${cancelled ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'}`}>{appointment.status}</span>
      </div>
      <p className="mt-4 font-semibold text-slate-800">{readableDate(slot.date)} · {formatTime(slot.start_time)}</p>
      {clinic && <p className="mt-2 text-sm leading-6 text-slate-600">{clinic.address}, {clinic.city}, {clinic.state} {clinic.pincode}</p>}
      {!cancelled && <div className="mt-5 flex gap-3">
        <button type="button" disabled={busy} onClick={() => onReschedule(appointment)} className="rounded-md border border-sky-600 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 disabled:opacity-60">Reschedule</button>
        <button type="button" disabled={busy} onClick={() => onCancel(appointment.id)} className="rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">Cancel</button>
      </div>}
    </article>
  )
}
