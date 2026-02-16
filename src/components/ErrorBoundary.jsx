import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="container-page text-center py-16">
          <h1 className="text-4xl font-bold text-gray-900">Something went wrong</h1>
          <p className="text-gray-600 mt-2">
            An unexpected error occurred. Please try again or go back home.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 text-green-700 hover:underline font-medium"
          >
            ← Back to home
          </Link>
        </section>
      )
    }
    return this.props.children
  }
}
