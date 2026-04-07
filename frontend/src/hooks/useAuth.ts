import { useEffect, useState } from 'react'
import { api } from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'

export function useAuth() {
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    api.get(ENDPOINTS.AUTH.ME)
      .then(() => {
        setIsAuthenticated(true)
      })
      .catch(() => {
        setIsAuthenticated(false)
      })
      .finally(() => {
        setIsChecking(false)
      })
  }, [])

  return { isChecking, isAuthenticated }
}   