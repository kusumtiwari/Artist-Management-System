
import { AuthWrapper } from '../../components/auth/auth-layout'
import CreateAccountForm from '../../components/auth/create-account-form'

export default function Register() {
  return (
     <AuthWrapper title="Sign Up" description="Create a new account">
      <CreateAccountForm/>
     </AuthWrapper>
  )
}