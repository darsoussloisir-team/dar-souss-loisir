import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, MapPin, ChevronRight } from 'lucide-react'
import { PACKAGES } from '../data/content'
import { useScrollReveal } from '../hooks/useScrollReveal'
import BookingModal from '../components/ui/BookingModal'
import './ExperiencesIndex.css'
import image18 from '../assets/images/GroupClients.webp'

export default function ExperiencesIndex() {
  const [bookingPkg, setBookingPkg] = useState(null)
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg">
          <img src={image18} alt="Camel rides in Agadir" />
        </div>
        <div className="container page-hero__content">
          <span className="section-label page-hero__label">What We Offer</span>
          <div className="divider-line" />
          <h1 className="page-hero__title">Our Experiences</h1>
          <p className="page-hero__sub">Three ways to experience the Souss landscape. All include hotel pickup, a professional guide, and one camel per guest.</p>
        </div>
      </section>

      <section className="exp-index">
        <div className="container">
          <div className="exp-index__list">
            {PACKAGES.map((pkg, i) => (
              <ExpRow key={pkg.id} pkg={pkg} reverse={i % 2 !== 0} delay={i} onBook={setBookingPkg} />
            ))}
          </div>
        </div>
      </section>

      <NoticeSection />

      {bookingPkg && <BookingModal pkg={bookingPkg} onClose={() => setBookingPkg(null)} />}
    </>
  )
}

function ExpRow({ pkg, reverse, onBook }) {
  const ref = useScrollReveal()
  return (
    <div className={`exp-row fade-up ${reverse ? 'exp-row--reverse' : ''}`} ref={ref}>
      <div className="exp-row__img">
        <img src={pkg.heroImage} alt={pkg.name} loading="lazy" />
        {pkg.featured && <div className="exp-row__badge">Most Popular</div>}
        <div className="exp-row__price-tag">
          <span className="exp-row__price-from">from</span>
          <span className="exp-row__price-num">€{pkg.prices.adult}</span>
          <span className="exp-row__price-per">per adult</span>
        </div>
      </div>

      <div className="exp-row__content">
        <p className="exp-row__tagline">{pkg.tagline}</p>
        <h2 className="exp-row__name">{pkg.name}</h2>

        <div className="exp-row__meta">
          <span className="exp-row__meta-item"><Clock size={14} />{pkg.duration}</span>
          <span className="exp-row__meta-item"><MapPin size={14} />{pkg.time}</span>
          <span className="exp-row__meta-item"><Users size={14} />Max {pkg.maxGuests} guests</span>
        </div>

        <p className="exp-row__desc">{pkg.shortDesc}</p>

        <ul className="exp-row__includes">
          {pkg.includes.slice(0, 4).map(item => (
            <li key={item} className="exp-row__include">
              <span className="exp-row__dot" />{item}
            </li>
          ))}
          {pkg.includes.length > 4 && (
            <li className="exp-row__include exp-row__include--more">
              +{pkg.includes.length - 4} more inclusions
            </li>
          )}
        </ul>

        <div className="exp-row__prices">
          <div className="exp-row__price-row"><span>Adult</span><strong>€{pkg.prices.adult}</strong></div>
          <div className="exp-row__price-row"><span>Child</span><strong>€{pkg.prices.child}</strong></div>
          <div className="exp-row__price-row"><span>Infant</span><strong>Free</strong></div>
        </div>

        <div className="exp-row__actions">
          <button className="btn-primary" onClick={() => onBook(pkg)}>
            <span>Book Now</span>
          </button>
          <Link to={`/experiences/${pkg.id}`} className="exp-row__detail-link">
            Full Details <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function NoticeSection() {
  const ref = useScrollReveal()
  return (
    <section className="exp-notice fade-up" ref={ref}>
      <div className="container">
        <div className="exp-notice__inner">
          <span className="section-label">Important Information</span>
          <div className="exp-notice__grid">
            <div className="exp-notice__block">
              <h4>Pickup Coverage</h4>
              <p>Hotel pickup is included only for hotels in the Agadir city centre and on the Agadir coast. Pickup from Taghazout, Tamraght, Aourir, and Imiwaddar is not included. Arriving by cruise ship? See our <Link to="/experiences/cruise">Cruise Ship Excursion</Link> — built specifically around port schedules.</p>
            </div>
            <div className="exp-notice__block">
              <h4>Health & Safety</h4>
              <p>Tours are cancelled in rainy conditions. Not recommended for travelers with serious back, hip, or heart conditions, or for pregnant women. Most travelers can participate without difficulty.</p>
            </div>
            <div className="exp-notice__block">
              <h4>Children</h4>
              <p>Children under 12 share a camel with a parent for their safety. Infants ride with a parent at no charge. Children are welcome on all our experiences.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}