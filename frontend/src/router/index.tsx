import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/dashboard' // your new dashboard folder/index.tsx
import { ROUTES } from './routes'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}