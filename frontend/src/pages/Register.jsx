import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { register as registerRequest } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const FIELDS = [
  { key: 'name',     label: 'Full name',    type: 'text',     placeholder: 'Riya Sharma' },
  { key: 'email',    label: 'Email',        type: 'email',    placeholder: 'you@example.com' },
  { key: 'phone',    label: 'Phone',        type: 'text',     placeholder: '98765 43210' },
  { key: 'password', label: 'Password',     type: 'password', placeholder: '••••••••', minLength: 8 },
]

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const { data } = await registerRequest(form)
      login(data, { name: form.name, email: form.email, role: data.role })
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.detail ?? 'Unable to create your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-24">
      <div className="w-full max-w-md animate-[fade-in-up_0.8s_cubic-bezier(0.32,0.72,0,1)_forwards] opacity-0">

        {/* Eyebrow */}
        <div className="mb-6 text-center">
          <span className="inline-block rounded-full bg-soft-border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-soft-text">
            BookMyClinic
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl font-bold tracking-tight text-soft-text">Create your account</h1>
        <p className="mt-3 text-center text-soft-muted">Find and book care with confidence.</p>

        {/* Double-bezel card */}
        <div className="mt-10 rounded-[2.5rem] bg-soft-border/40 p-2 ring-1 ring-soft-border shadow-soft-ambient">
          <div className="rounded-[calc(2.5rem-0.5rem)] bg-soft-surface p-8 shadow-soft-inner">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {FIELDS.map(({ key, label, type, placeholder, minLength }) => (
                <label key={key} className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-soft-text">{label}</span>
                  <input
                    type={type}
                    required
                    minLength={minLength}
                    value={form[key]}
                    placeholder={placeholder}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="mt-2 block w-full rounded-2xl border-none bg-soft-bg px-4 py-3 text-soft-text placeholder:text-soft-muted/50 shadow-soft-inner focus:outline-none focus:ring-1 focus:ring-soft-border transition-shadow duration-500"
                  />
                </label>
              ))}

              {error && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group mt-2 flex w-full items-center justify-between rounded-full bg-soft-text px-6 py-4 font-semibold text-white transition-all duration-700 ease-fluid hover:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <span>{isSubmitting ? 'Creating account…' : 'Create account'}</span>
                {!isSubmitting && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 ease-fluid group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-soft-muted">
          Already have an account?{' '}
          <Link className="font-semibold text-soft-text underline-offset-4 hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
