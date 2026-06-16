import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Admin from './admin/AdminDashboard.jsx'

const isAdmin = window.location.pathname === '/admin'

createRoot(document.getElementById('root')).render()
    {isAdmin ? <Admin /> : <App />}
import AdminRouteGuard from './admin/AdminRouteGuard'
import AdminJerseys from './admin/AdminJerseys'
import AdminOrders from './admin/AdminOrders'
import AdminCustomRequests from './admin/AdminCustomRequests'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/admin" element={<AdminRouteGuard><AdminJerseys /></AdminRouteGuard>} />
        <Route path="/admin/jerseys" element={<AdminRouteGuard><AdminJerseys /></AdminRouteGuard>} />
        <Route path="/admin/orders" element={<AdminRouteGuard><AdminOrders /></AdminRouteGuard>} />
        <Route path="/admin/custom-requests" element={<AdminRouteGuard><AdminCustomRequests /></AdminRouteGuard>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
