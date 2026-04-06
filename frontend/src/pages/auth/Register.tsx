import { useState } from 'react'
import { AuthWrapper } from '../../components/auth/auth-layout'
import LoginForm from '../../components/auth/login-form'
import CreateAccountForm from '../../components/auth/create-account-form'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  return (
     <AuthWrapper title="Sign Up" description="Create a new account">
      <CreateAccountForm/>
     </AuthWrapper>
  )
}