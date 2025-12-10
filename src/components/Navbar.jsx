import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const linkBase = 'px-3 py-2 rounded-md text-sm font-medium'
  const inactive = 'text-gray-700 hover:text-green-700 hover:bg-green-50'
  const active = 'text-green-800 bg-green-50'
  return (
    <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 md:px-10 h-14 flex items-center justify-between">
        <div className="font-bold tracking-wide text-gray-900">Testa De Nevill</div>
        <div className="flex gap-1">
          <NavLink to="/" end className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>About</NavLink>
          <NavLink to="/ideas" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Ideas</NavLink>

          {/* <NavLink to="/projects" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Projects</NavLink> */}
          <NavLink to="/blog" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Blog</NavLink>
          <NavLink to="/contact" className={({isActive}) => `${linkBase} ${isActive?active:inactive}`}>Contact</NavLink>
        </div>
      </div>
    </nav>
  )
}
