const formatTime = (value) => {
  const [hours, minutes] = value.slice(0, 5).split(':').map(Number)
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(
    new Date(2000, 0, 1, hours, minutes),
  )
}

export { formatTime }

export default function SlotPicker({ slots, selectedSlotId, onSelect, disabled = false }) {
  if (!slots.length) return <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">No available slots for this date.</p>

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {slots.map((slot) => {
        const unavailable = disabled || slot.is_booked
        const selected = selectedSlotId === slot.id
        return (
          <button
            key={slot.id}
            type="button"
            disabled={unavailable}
            onClick={() => onSelect(slot)}
            className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${selected ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-sky-500 hover:text-sky-700'} disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400`}
          >
            {formatTime(slot.start_time)}
          </button>
        )
      })}
    </div>
  )
}
