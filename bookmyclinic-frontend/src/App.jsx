import { Navigate, Route, Routes } from 'react-router-dom'

import Navbar from './components/Navbar'
import ClinicDetail from './pages/ClinicDetail'
import ClinicList from './pages/ClinicList'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ClinicList />} />
          <Route path="/clinics/:id" element={<ClinicDetail />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
