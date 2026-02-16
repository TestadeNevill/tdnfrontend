import { Link } from 'react-router-dom'

export default function Footer() {
  const links = [
    { to: '/about', label: 'About' },
    { to: '/ideas', label: 'Ideas' },
    { to: '/projects', label: 'Projects' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ]
  return (
    <footer className="border-t border-gray-200 mt-12">
      <div className="max-w-5xl mx-auto px-4 md:px-10 py-8">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start text-sm text-gray-600 mb-4">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className="link">
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-gray-500 text-center md:text-left">
          © {new Date().getFullYear()} Testa De Nevill • Vite + React • Deployed on Vercel
        </p>
      </div>
    </footer>
  )
}
