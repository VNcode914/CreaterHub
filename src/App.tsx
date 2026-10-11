import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { StudioProvider } from './context/StudioProvider'
import { StoreProvider } from './context/store/StoreProvider'
import { Dashboard } from './pages/Dashboard'
import { Ideas } from './pages/Ideas'

export default function App() {
  return (
    <StoreProvider>
      <StudioProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ideas" element={<Ideas />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StudioProvider>
    </StoreProvider>
  )
}
