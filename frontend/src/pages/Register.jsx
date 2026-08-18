import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { register as registerRequest } from '../api/auth'
import { useAuth } from '../context/AuthContext'

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
      login(data, { name: form.name, email: form.email })
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError.response?.data?.detail ?? 'Unable to create your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">Find and book care with confidence.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {['name', 'email', 'phone', 'password'].map((field) => (
            <label key={field} className="block text-sm font-medium capitalize">{field}
              <input type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'} required minLength={field === 'password' ? 8 : undefined} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
            </label>
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={isSubmitting} className="w-full rounded-md bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700 disabled:opacity-60">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link className="font-medium text-sky-700" to="/login">Sign in</Link></p>
      </div>
    </main>
  )
}
