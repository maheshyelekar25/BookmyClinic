import { useEffect, useState } from 'react'

import { cancelAppointment, getSlots, getUserAppointments, rescheduleAppointment } from '../api/appointments'
import AppointmentCard from '../components/AppointmentCard'
import SlotPicker from '../components/SlotPicker'
import { useAuth } from '../context/AuthContext'

const today = new Date().toISOString().slice(0, 10)

export default function MyAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [tab, setTab] = useState('upcoming')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [rescheduling, setRescheduling] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState(today)
  const [newSlots, setNewSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)

  const loadAppointments = async () => {
    if (!user?.id) return
    try {
      const { data } = await getUserAppointments(user.id)
      setAppointments(data)
    } catch (requestError) { setError(requestError.response?.data?.detail ?? 'Could not load appointments.') }
  }
  useEffect(() => { loadAppointments() }, [user?.id])

  const openReschedule = async (appointment) => {
    setError(''); setRescheduling(appointment); setSelectedSlot(null); setNewSlots([])
    try { const { data } = await getSlots(appointment.slot.doctor_id, rescheduleDate); setNewSlots(data) } catch { setError('Could not load alternative slots.') }
  }
  const loadRescheduleSlots = async (date) => {
    setRescheduleDate(date); setSelectedSlot(null)
    if (!rescheduling) return
    try { const { data } = await getSlots(rescheduling.slot.doctor_id, date); setNewSlots(data) } catch { setError('Could not load alternative slots.') }
  }
  const cancel = async (id) => { setBusy(true); setError(''); try { await cancelAppointment(id); await loadAppointments() } catch (e) { setError(e.response?.data?.detail ?? 'Could not cancel this appointment.') } finally { setBusy(false) } }
  const saveReschedule = async () => {
    if (!selectedSlot) return
    setBusy(true); setError('')
    try { await rescheduleAppointment(rescheduling.id, selectedSlot.id); setRescheduling(null); await loadAppointments() }
    catch (e) { setError(e.response?.status === 409 ? 'This slot was just taken, please pick another.' : e.response?.data?.detail ?? 'Could not reschedule this appointment.'); if (e.response?.status === 409) await loadRescheduleSlots(rescheduleDate) }
    finally { setBusy(false) }
  }
  const visible = appointments.filter((a) => tab === 'past' ? a.status === 'cancelled' || a.slot.date < today : a.status !== 'cancelled' && a.slot.date >= today)

  return <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6"><h1 className="text-3xl font-bold">My appointments</h1>
    <div className="mt-6 flex border-b border-slate-200"><button onClick={() => setTab('upcoming')} className={`px-4 py-3 text-sm font-bold ${tab === 'upcoming' ? 'border-b-2 border-sky-600 text-sky-700' : 'text-slate-500'}`}>Upcoming</button><button onClick={() => setTab('past')} className={`px-4 py-3 text-sm font-bold ${tab === 'past' ? 'border-b-2 border-sky-600 text-sky-700' : 'text-slate-500'}`}>Past & cancelled</button></div>
    {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
    <div className="mt-5 space-y-4">{visible.length ? visible.map((a) => <AppointmentCard key={a.id} appointment={a} onCancel={cancel} onReschedule={openReschedule} busy={busy} />) : <p className="rounded-xl bg-white p-6 text-slate-600 shadow-sm">No {tab} appointments.</p>}</div>
    {rescheduling && <section className="mt-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="text-xl font-bold">Reschedule appointment</h2><label className="mt-4 block max-w-xs text-sm font-semibold">New date<input type="date" min={today} value={rescheduleDate} onChange={(e) => loadRescheduleSlots(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2" /></label><div className="mt-5"><SlotPicker slots={newSlots} selectedSlotId={selectedSlot?.id} onSelect={setSelectedSlot} /></div><div className="mt-5 flex gap-3"><button disabled={!selectedSlot || busy} onClick={saveReschedule} className="rounded-md bg-sky-600 px-4 py-2 font-semibold text-white disabled:opacity-50">Save new time</button><button onClick={() => setRescheduling(null)} className="rounded-md border border-slate-300 px-4 py-2 font-semibold">Cancel</button></div></section>}
  </main>
}
