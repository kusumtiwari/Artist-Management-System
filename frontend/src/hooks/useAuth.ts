import { useMe } from '../queries/auth'

export function useAuth() {
  const { data, isLoading } = useMe()

  return {
    isChecking: isLoading,
    isAuthenticated: !!data,
  }
}