import { Link } from 'react-router-dom'
import { PACKAGES } from '../../data/content'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-main">Dar Souss</span>
              <span className="footer__logo-sub">Loisir</span>
            </Link>
            <p className="footer__tagline">Authentic camel experiences<br />in Agadir since 2005.</p>
            <a href="https://wa.me/212615726781" target="_blank" rel="noreferrer" className="btn-whatsapp">
              Chat on WhatsApp
            </a>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Experiences</h4>
            <ul className="footer__list">
              {PACKAGES.map(pkg => (
                <li key={pkg.id}><Link to={`/experiences/${pkg.id}`}>{pkg.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Navigate</h4>
            <ul className="footer__list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Contact</h4>
            <ul className="footer__list">
              <li><a href="mailto:contact@darsoussloisir.com">contact@darsoussloisir.com</a></li>
              <li><a href="tel:+212615726781">+212 615 726 781</a></li>
              <li>Aghroud Village, Agadir, Morocco</li>
              <li>Daily departures 6:30 pm &amp; 7:00 pm</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} Dar Souss Loisir. All rights reserved.</p>
          <div style={{ width: 40, height: 1, background: 'var(--green-gold)', opacity: 0.6 }} />
        </div>
      </div>
    </footer>
  )
}