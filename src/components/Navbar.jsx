import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkBase =
    "block px-3 py-2 rounded-md text-sm font-medium transition";
  const inactive =
    "text-gray-700 hover:text-green-700 hover:bg-green-50";
  const active =
    "text-green-800 bg-green-50";

  return (
    <nav className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 md:px-10 h-14 flex items-center justify-between">

        {/* Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-2 min-w-0"
          aria-label="Home"
        >
          {/* Optional logo image */}
          {/* Uncomment when ready */}
          {/* 
          <img
            src="/assets/logo.svg"
            alt=""
            className="h-7 w-auto"
          /> 
          */}

          <span className="font-bold tracking-wide text-gray-900 
                           text-sm sm:text-base md:text-lg
                           whitespace-nowrap truncate">
            Testa De Nevill
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-1">
          {["/", "/about", "/ideas", "/blog", "/contact"].map((path, i) => {
            const label = ["Home", "About", "Ideas", "Blog", "Contact"][i];
            return (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? active : inactive}`
                }
              >
                {label}
              </NavLink>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {/* Hamburger / Close icon */}
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {["/", "/about", "/ideas", "/blog", "/contact"].map((path, i) => {
              const label = ["Home", "About", "Ideas", "Blog", "Contact"][i];
              return (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? active : inactive}`
                  }
                >
                  {label}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
