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
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center mt-6 pointer-events-none px-4">
      <nav className="pointer-events-auto flex items-center justify-between rounded-full bg-soft-surface/80 px-6 py-3 backdrop-blur-2xl ring-1 ring-soft-border shadow-soft-ambient transition-all duration-700 ease-fluid w-full max-w-4xl">
        <Link 
          to="/" 
          className="text-lg font-bold text-soft-text tracking-tight transition-transform duration-700 ease-fluid hover:scale-[0.98]"
        >
          BookMyClinic
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-soft-muted hidden sm:inline-block">Hi, {user?.name ?? 'there'}</span>
            <Link 
              to="/appointments" 
              className="text-sm font-semibold text-soft-text hover:text-soft-muted transition-colors duration-700 ease-fluid"
            >
              My appointments
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="group flex items-center gap-2 rounded-full bg-soft-text px-5 py-2.5 text-sm font-medium text-white transition-all duration-700 ease-fluid active:scale-[0.98]"
            >
              <span>Logout</span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 ease-fluid group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link 
              to="/login" 
              className="text-soft-muted hover:text-soft-text transition-colors duration-700 ease-fluid"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="group flex items-center gap-2 rounded-full bg-soft-text px-5 py-2.5 text-white transition-all duration-700 ease-fluid active:scale-[0.98]"
            >
              <span>Register</span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 ease-fluid group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
