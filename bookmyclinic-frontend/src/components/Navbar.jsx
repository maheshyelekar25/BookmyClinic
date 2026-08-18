import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="text-xl font-bold text-sky-700">
          BookMyClinic
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Hi, {user?.name ?? 'there'}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link to="/login" className="text-slate-600 hover:text-sky-700">Login</Link>
            <Link to="/register" className="rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">Register</Link>
          </div>
        )}
      </nav>
    </header>
  )
}
