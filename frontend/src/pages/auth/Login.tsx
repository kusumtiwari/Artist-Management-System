import { useState } from 'react'
import { AuthWrapper } from '../../components/auth/auth-layout'
import LoginForm from '../../components/auth/login-form'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  return (
     <AuthWrapper title="Login to your account" description="Welcome back! Please enter your details.">
          <LoginForm  />
     </AuthWrapper>
  )
}