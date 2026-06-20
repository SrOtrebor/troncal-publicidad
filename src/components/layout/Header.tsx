import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/espacios', label: 'Espacios Publicitarios' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top teal bar */}
      <div className="gradient-teal text-white text-xs py-1.5 text-center tracking-wide font-medium">
        Nordelta · Tigre · Alrededores — La Guía de tu zona
      </div>

      {/* Main nav */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img src="/logo-latroncal.svg" alt="La Troncal" className="h-10 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.href
                      ? 'text-teal bg-teal-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <Link to="/espacios" className="hidden sm:block">
                <Button size="sm">
                  Publicitar ahora
                </Button>
              </Link>
              <button
                className="md:hidden p-2 rounded-[var(--radius-md)] text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menú"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="md:hidden border-t border-gray-100"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-3 space-y-1 bg-white">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${
                      location.pathname === link.href
                        ? 'text-teal bg-teal-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2">
                  <Link to="/espacios" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full">
                      Publicitar ahora
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
