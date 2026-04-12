// components/error-boundary.tsx
import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Boundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-sm text-text-default-secondary">Something went wrong.</p>
        </div>
      )
    }
    return this.props.children
  }
}