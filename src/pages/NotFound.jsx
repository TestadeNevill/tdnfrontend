import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="container-page text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900">Page not found</h1>
      <p className="text-gray-600 mt-2">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block mt-6 text-primary-700 hover:underline font-medium"
      >
        ← Back to home
      </Link>
    </section>
  )
}
