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
    return (
      <main className="mx-auto max-w-2xl px-4 py-32 sm:px-6">
        <section className="animate-[fade-in-up_1s_cubic-bezier(0.32,0.72,0,1)_forwards] rounded-[2.5rem] bg-soft-border/30 p-2 ring-1 ring-soft-border shadow-soft-ambient">
          <div className="rounded-[calc(2.5rem-0.5rem)] bg-soft-surface p-10 shadow-soft-inner text-center flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Appointment confirmed</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-soft-text">You’re booked for {formatTime(confirmedSlot.start_time)}</h1>
            <p className="mt-4 text-lg text-soft-muted">{confirmedSlot.date}{(doctor?.name ?? confirmedSlot.doctor?.name) ? ` with ${doctor?.name ?? confirmedSlot.doctor?.name}` : ''}</p>
            
            {(clinic ?? confirmedSlot.doctor?.clinic) && (
              <div className="mt-10 w-full text-left rounded-3xl border border-soft-border bg-soft-bg p-8 transition-all duration-700 ease-fluid hover:shadow-soft-ambient hover:-translate-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-soft-muted">Clinic address</p>
                <p className="mt-3 text-xl font-bold tracking-tight text-soft-text">{(clinic ?? confirmedSlot.doctor.clinic).name}</p>
                <p className="mt-2 text-soft-muted">{(clinic ?? confirmedSlot.doctor.clinic).address}</p>
                <p className="font-medium text-soft-muted">{(clinic ?? confirmedSlot.doctor.clinic).city}, {(clinic ?? confirmedSlot.doctor.clinic).state} {(clinic ?? confirmedSlot.doctor.clinic).pincode}</p>
              </div>
            )}
            
            <Link 
              to="/appointments" 
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-soft-text px-8 py-4 font-semibold text-white transition-all duration-700 ease-fluid hover:scale-[0.98]"
            >
              <span>View my appointments</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 ease-fluid group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-32 sm:px-6">
      <div className="animate-[fade-in-up_1s_cubic-bezier(0.32,0.72,0,1)_forwards] opacity-0 [animation-delay:200ms]">
        <Link to={clinic ? `/clinics/${clinic.id}` : '/'} className="text-sm font-semibold text-soft-muted hover:text-soft-text transition-colors duration-700 ease-fluid tracking-wide">
          ← BACK TO CLINIC
        </Link>
        <div className="mt-8 mb-4 inline-block rounded-full bg-soft-border px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-soft-text">
          Scheduling
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-soft-text">Book an appointment</h1>
        <p className="mt-4 text-lg text-soft-muted">{doctor?.name ?? 'Select an available time'}{clinic ? ` at ${clinic.name}` : ''}</p>
      </div>
      
      <section className="mt-12 rounded-[2.5rem] bg-soft-border/30 p-2 ring-1 ring-soft-border animate-[fade-in-up_1s_cubic-bezier(0.32,0.72,0,1)_forwards] opacity-0 [animation-delay:400ms]">
        <div className="rounded-[calc(2.5rem-0.5rem)] bg-soft-surface p-8 shadow-soft-inner">
          <label className="block max-w-xs">
            <span className="text-sm font-bold tracking-wide text-soft-text uppercase">Choose a date</span>
            <input 
              type="date" 
              min={today} 
              value={date} 
              onChange={(event) => setDate(event.target.value)} 
              className="mt-3 block w-full rounded-2xl border-none bg-soft-bg px-4 py-3 text-soft-text shadow-soft-inner focus:ring-1 focus:ring-soft-border" 
            />
          </label>
          
          <h2 className="mt-10 text-xl font-bold tracking-tight text-soft-text">Available times</h2>
          <div className="mt-6">
            {loading ? <p className="text-sm text-soft-muted">Loading slots…</p> : <SlotPicker slots={slots} selectedSlotId={selectedSlot?.id} onSelect={setSelectedSlot} />}
          </div>
          
          {error && <p className="mt-6 text-sm font-medium text-red-600 bg-red-50 p-4 rounded-2xl">{error}</p>}
          
          <button 
            type="button" 
            disabled={!selectedSlot || submitting} 
            onClick={confirmBooking} 
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-soft-text px-8 py-4 font-semibold text-white transition-all duration-700 ease-fluid hover:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <span>{submitting ? 'Confirming…' : selectedSlot ? `Confirm ${formatTime(selectedSlot.start_time)} appointment` : 'Choose a time to continue'}</span>
            {!submitting && selectedSlot && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 ease-fluid group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            )}
          </button>
        </div>
      </section>
    </main>
  )
}
