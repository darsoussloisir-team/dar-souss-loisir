import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { PACKAGES } from '../../data/content'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [dropOpen, setDropOpen]   = useState(false)
  const dropRef = useRef(null)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setDropOpen(false) }, [pathname])

  const solid = scrolled || !isHome

  return (
    <header className={`navbar ${solid ? 'navbar--solid' : ''}`}>
      <div className="navbar__inner container">

        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-main">Dar Souss</span>
          <span className="navbar__logo-sub">Loisir</span>
        </Link>

        <nav className="navbar__links">
          <NavLink to="/" className={({isActive}) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`} end>
            Home
          </NavLink>

          <NavLink to="/about" className={({isActive}) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
            Our Story
          </NavLink>

          {/* Experiences dropdown */}
          <div className="navbar__dropdown" ref={dropRef}>
            <button
              className={`navbar__link navbar__drop-trigger ${pathname.startsWith('/experiences') ? 'navbar__link--active' : ''}`}
              onClick={() => setDropOpen(v => !v)}
            >
              Experiences <ChevronDown size={13} className={`navbar__chevron ${dropOpen ? 'navbar__chevron--open' : ''}`} />
            </button>
            {dropOpen && (
              <div className="navbar__drop-menu">
                <Link to="/experiences" className="navbar__drop-item navbar__drop-all" onClick={() => setDropOpen(false)}>
                  All Experiences
                </Link>
                {PACKAGES.map(pkg => (
                  <Link key={pkg.id} to={`/experiences/${pkg.id}`} className="navbar__drop-item" onClick={() => setDropOpen(false)}>
                    <span className="navbar__drop-name">{pkg.name}</span>
                    <span className="navbar__drop-price">from €{pkg.prices.adult}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/gallery" className={({isActive}) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
            Gallery
          </NavLink>

          <NavLink to="/contact" className={({isActive}) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
            Contact
          </NavLink>
        </nav>

        <Link to="/experiences" className="navbar__book-btn">Book Now</Link>

        <button className="navbar__burger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <Link to="/"            className="navbar__mobile-link">Home</Link>
        <Link to="/about"       className="navbar__mobile-link">Our Story</Link>
        <Link to="/experiences" className="navbar__mobile-link">All Experiences</Link>
        {PACKAGES.map(pkg => (
          <Link key={pkg.id} to={`/experiences/${pkg.id}`} className="navbar__mobile-link navbar__mobile-sub">
            {pkg.name}
          </Link>
        ))}
        <Link to="/gallery"     className="navbar__mobile-link">Gallery</Link>
        <Link to="/contact"     className="navbar__mobile-link">Contact</Link>
        <Link to="/experiences" className="btn-primary" style={{ margin: '1rem 1.5rem' }}>
          <span>Book an Experience</span>
        </Link>
      </div>
    </header>
  )
}