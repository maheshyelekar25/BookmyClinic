import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { bookSlot, getSlots } from '../api/appointments'
import SlotPicker, { formatTime } from '../components/SlotPicker'

const today = new Date().toISOString().slice(0, 10)

export default function Booking() {
  const { doctorId } = useParams()
  const { state } = useLocation()
  const clinic = state?.clinic
  const doctor = state?.doctor
  const [date, setDate] = useState(today)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  const loadSlots = useCallback(async () => {
    setLoading(true)
    setError('')
    setSelectedSlot(null)
    try {
      const { data } = await getSlots(doctorId, date)
      setSlots(data)
    } catch (requestError) {
      setSlots([])
      setError(requestError.response?.data?.detail ?? 'Could not load available slots.')
    } finally {
      setLoading(false)
    }
  }, [date, doctorId])

  useEffect(() => { loadSlots() }, [loadSlots])

  const confirmBooking = async () => {
    if (!selectedSlot) return
    setSubmitting(true)
    setError('')
    try {
      const { data } = await bookSlot(selectedSlot.id)
      setConfirmation(data)
    } catch (requestError) {
      if (requestError.response?.status === 409) {
        await loadSlots()
        setError('This slot was just taken, please pick another.')
      } else {
        setError(requestError.response?.data?.detail ?? 'Could not book this appointment.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmation) {
    const confirmedSlot = confirmation.slot
    return <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <section className="rounded-xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Appointment confirmed</p>
        <h1 className="mt-2 text-3xl font-bold">You’re booked for {formatTime(confirmedSlot.start_time)}</h1>
        <p className="mt-2 text-slate-600">{confirmedSlot.date}{doctor?.name ? ` with ${doctor.name}` : ''}</p>
        {clinic && <div className="mt-7 rounded-lg border-2 border-sky-200 bg-sky-50 p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-800">Clinic address</p>
          <p className="mt-2 text-lg font-bold text-slate-900">{clinic.name}</p>
          <p className="mt-1 text-slate-800">{clinic.address}</p>
          <p className="font-semibold text-slate-800">{clinic.city}, {clinic.state} {clinic.pincode}</p>
        </div>}
        <Link to="/appointments" className="mt-7 inline-block rounded-md bg-sky-600 px-4 py-2 font-semibold text-white hover:bg-sky-700">View my appointments</Link>
      </section>
    </main>
  }

  return <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <Link to={clinic ? `/clinics/${clinic.id}` : '/'} className="text-sm font-semibold text-sky-700">← Back to clinic</Link>
    <h1 className="mt-5 text-3xl font-bold">Book an appointment</h1>
    <p className="mt-2 text-slate-600">{doctor?.name ?? 'Select an available time'}{clinic ? ` at ${clinic.name}` : ''}</p>
    <section className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <label className="block max-w-xs text-sm font-semibold">Choose a date
        <input type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2" />
      </label>
      <h2 className="mt-6 text-lg font-bold">Available times</h2>
      <div className="mt-3">{loading ? <p className="text-sm text-slate-600">Loading slots…</p> : <SlotPicker slots={slots} selectedSlotId={selectedSlot?.id} onSelect={setSelectedSlot} />}</div>
      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      <button type="button" disabled={!selectedSlot || submitting} onClick={confirmBooking} className="mt-6 rounded-md bg-sky-600 px-5 py-2.5 font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Confirming…' : selectedSlot ? `Confirm ${formatTime(selectedSlot.start_time)} appointment` : 'Choose a time to continue'}</button>
    </section>
  </main>
}
