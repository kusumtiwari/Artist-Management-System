import { AuthWrapper } from '../../components/auth/auth-layout'
import LoginForm from '../../components/auth/login-form'

export default function Login() {
  return (
     <AuthWrapper title="Login to your account" description="Welcome back! Please enter your details.">
          <LoginForm  />
     </AuthWrapper>
  )
}