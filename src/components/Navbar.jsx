import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

const NAV_PATHS = ["/", "/about", "/ideas", "/labs", "/blog", "/contact"];
const NAV_LABELS = ["Home", "About", "Ideas", "Labs", "Blog", "Contact"];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isLabs = pathname.startsWith("/labs");

  const linkBase =
    "block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out";
  const inactive = isLabs
    ? "text-slate-400 hover:text-emerald-400 hover:bg-white/5"
    : "text-gray-700 hover:text-primary-700 hover:bg-primary-50";
  const active = isLabs
    ? "text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/25"
    : "text-primary-800 bg-primary-50";
  const navShell = isLabs
    ? "sticky top-0 z-20 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur"
    : "sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur";
  const brandText = isLabs
    ? "font-bold tracking-wide text-slate-100 text-sm sm:text-base md:text-lg whitespace-nowrap truncate"
    : "font-bold tracking-wide text-gray-900 text-sm sm:text-base md:text-lg whitespace-nowrap truncate";
  const hamburgerBtn = isLabs
    ? "md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
    : "md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-colors duration-200";
  const mobilePanel = isLabs
    ? "md:hidden border-t border-slate-800 bg-slate-950"
    : "md:hidden border-t border-gray-200 bg-white";

  return (
    <nav className={navShell}>
      <div className="max-w-5xl mx-auto px-4 md:px-10 h-14 flex items-center justify-between">

        {/* Brand */}
        <NavLink
          to="/"
          className="flex items-center gap-2 min-w-0 transition-opacity duration-200 hover:opacity-80"
          aria-label="Home"
        >
          <span className={brandText}>
            Testa de Nevill
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-1">
          {NAV_PATHS.map((path, i) => {
            const label = NAV_LABELS[i];
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
          className={hamburgerBtn}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
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
        <div className={mobilePanel}>
          <div className="px-4 py-3 space-y-1">
            {NAV_PATHS.map((path, i) => {
              const label = NAV_LABELS[i];
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
