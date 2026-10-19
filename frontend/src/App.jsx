import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import IndexPage from './pages/IndexPage'
import CarbonCalculatorPage from './pages/CarbonCalculatorPage'
import EevtaCalculatorPage from './pages/EevtaCalculatorPage'
import EnergyCalculatorPage from './pages/EnergyCalculatorPage'
import WasteCalculatorPage from './pages/WasteCalculatorPage'
import SustainabilityPage from './pages/SustainabilityPage'
import FormResultPage from './pages/FormResultPage'
import AggResultPage from './pages/AggResultPage'
import DashboardPage from './pages/DashboardPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<IndexPage />} />
            <Route path="/carbon" element={<CarbonCalculatorPage />} />
            <Route path="/eevta" element={<EevtaCalculatorPage />} />
            <Route path="/energy" element={<EnergyCalculatorPage />} />
            <Route path="/waste" element={<WasteCalculatorPage />} />
            <Route path="/sustainability" element={<SustainabilityPage />} />
            <Route path="/result" element={<FormResultPage />} />
            <Route path="/result/sustainability" element={<AggResultPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
