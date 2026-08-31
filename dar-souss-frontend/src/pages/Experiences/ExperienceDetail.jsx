import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Clock, Users, MapPin, Check, X, AlertTriangle, ChevronRight } from 'lucide-react'
import { PACKAGES } from '../../data/content'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import BookingModal from '../../components/ui/BookingModal'
import './ExperienceDetail.css'

export default function ExperienceDetail() {
  const { packageId } = useParams()
  const pkg = PACKAGES.find(p => p.id === packageId)
  const [booking, setBooking] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  if (!pkg) return <Navigate to="/experiences" replace />

  const others = PACKAGES.filter(p => p.id !== packageId)

  return (
    <>
      {/* Hero */}
      <section className="det-hero">
        <div className="det-hero__bg">
          <img src={pkg.heroImage} alt={pkg.name} />
          <div className="det-hero__overlay" />
        </div>
        <div className="container det-hero__content">
          <div className="det-hero__breadcrumb">
            <Link to="/experiences">Experiences</Link>
            <ChevronRight size={13} />
            <span>{pkg.name}</span>
          </div>
          <p className="det-hero__tagline">{pkg.tagline}</p>
          <h1 className="det-hero__title">{pkg.name}</h1>
          <div className="det-hero__meta">
            <span className="det-hero__meta-item"><Clock size={14} />{pkg.duration}</span>
            <span className="det-hero__meta-item"><MapPin size={14} />{pkg.time}</span>
            <span className="det-hero__meta-item"><Users size={14} />Max {pkg.maxGuests} guests</span>
          </div>
          <button className="btn-primary det-hero__book" onClick={() => setBooking(true)}>
            <span>Book This Experience</span>
          </button>
        </div>
      </section>

      {/* Main content */}
      <section className="det-body">
        <div className="container">
          <div className="det-body__layout">

            {/* Left column */}
            <div className="det-body__main">
              <DescSection pkg={pkg} />
              <GallerySection pkg={pkg} activeImg={activeImg} setActiveImg={setActiveImg} />
              <HealthSection pkg={pkg} />
            </div>

            {/* Right sidebar */}
            <div className="det-body__sidebar">
              <PricingCard pkg={pkg} onBook={() => setBooking(true)} />
              <IncludesCard pkg={pkg} />
            </div>
          </div>
        </div>
      </section>

      {/* Other experiences */}
      <OtherExperiences others={others} />

      {booking && <BookingModal pkg={pkg} onClose={() => setBooking(false)} />}
    </>
  )
}

function DescSection({ pkg }) {
  const ref = useScrollReveal()
  return (
    <div className="det-section fade-up" ref={ref}>
      <h2 className="det-section__title">About This Experience</h2>
      <div className="divider-line" />
      <p className="det-desc">{pkg.shortDesc}</p>
      <p className="det-desc">
        Your guide meets you at your hotel reception in Agadir. The drive to our ranch in
        Aghroud Bensergao takes approximately ten minutes. Once at the ranch, your camel
        guide introduces you to your dromedary — domestic, calm, and yours alone for the ride.
      </p>
      <p className="det-desc">
        From the ranch you will cross the village of Aghroud, pass through an eucalyptus
        forest, and arrive at the mouth of the Souss Massa River — a major bird sanctuary.
        Depending on the tide, you may spot flamingos and migratory birds. Your guide will
        photograph the sunset for you on your own device.
      </p>
      {(pkg.id === 'bbq' || pkg.id === 'couscous') && (
        <p className="det-desc">
          On your return to the ranch, our family chef — a culinary professional with over
          40 years of experience — will have prepared {pkg.id === 'bbq' ? 'a full barbecue dinner' : 'a traditional couscous with argan oil'} for
          your group. Vegetarian options are available on request at the time of booking.
        </p>
      )}
      {pkg.id === 'cruise' && (
        <p className="det-desc">
          We know port time is tight. Rather than a fixed departure slot, we schedule your ride
          around your ship's arrival and all-aboard time, so you're never rushing back. If you'd
          like us to arrange your transfer from the port, just ask when you book — it's a flat
          rate paid directly on the day, with nothing added to the tour price.
        </p>
      )}
    </div>
  )
}

function GallerySection({ pkg, activeImg, setActiveImg }) {
  const ref = useScrollReveal()
  return (
    <div className="det-section fade-up" ref={ref}>
      <h2 className="det-section__title">Gallery</h2>
      <div className="divider-line" />
      <div className="det-gallery">
        <div className="det-gallery__main">
          <img src={pkg.gallery[activeImg]} alt={`${pkg.name} — photo ${activeImg + 1}`} />
        </div>
        <div className="det-gallery__thumbs">
          {pkg.gallery.map((src, i) => (
            <button
              key={i}
              className={`det-gallery__thumb ${i === activeImg ? 'det-gallery__thumb--active' : ''}`}
              onClick={() => setActiveImg(i)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      </div>
    
    </div>
  )
}

function HealthSection({ pkg }) {
  const ref = useScrollReveal()
  return (
    <div className="det-section fade-up" ref={ref}>
      <h2 className="det-section__title">Health &amp; Accessibility</h2>
      <div className="divider-line" />
      <div className="det-health">
        {pkg.healthNotes.map(note => (
          <div key={note} className="det-health__item">
            <AlertTriangle size={14} color="var(--green-gold)" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PricingCard({ pkg, onBook }) {
  const ref = useScrollReveal()
  return (
    <div className="det-card fade-up" ref={ref}>
      <div className="det-card__header">
        <span className="det-card__label">Pricing</span>
        <span className="det-card__time">{pkg.time}</span>
      </div>
      <div className="det-card__prices">
        {[
          { label: 'Adult',   price: `€${pkg.prices.adult}` },
          { label: 'Child',   price: `€${pkg.prices.child}` },
          { label: 'Infant',  price: 'Free' },
        ].map(r => (
          <div key={r.label} className="det-card__price-row">
            <span>{r.label}</span><strong>{r.price}</strong>
          </div>
        ))}
      </div>
      <button className="btn-primary det-card__book" onClick={onBook}>
        <span>Book Now</span>
      </button>
      
       <a href={`https://wa.me/212615726781?text=Hello%2C%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(pkg.name)}.`}
        target="_blank"
        rel="noreferrer"
        className="btn-whatsapp det-card__wa"
      >
        Book via WhatsApp
      </a>
      <p className="det-card__note">
        Max {pkg.maxGuests} guests per tour. Hotel pickup from Agadir only.
      </p>
    </div>
  )
}

function IncludesCard({ pkg }) {
  const ref = useScrollReveal()
  return (
    <div className="det-card det-card--includes fade-up d2" ref={ref}>
      <div className="det-card__header">
        <span className="det-card__label">What's Included</span>
      </div>
      <ul className="det-inc__list">
        {pkg.includes.map(item => (
          <li key={item} className="det-inc__item det-inc__item--yes">
            <Check size={13} color="var(--green-deep)" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {pkg.excludes.length > 0 && (
        <>
          <div className="det-card__header" style={{ marginTop: '1.25rem', borderTop: '1px solid var(--sand-200)', paddingTop: '1.25rem' }}>
            <span className="det-card__label">Not Included</span>
          </div>
          <ul className="det-inc__list">
            {pkg.excludes.map(item => (
              <li key={item} className="det-inc__item det-inc__item--no">
                <X size={13} color="var(--terra-400)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function OtherExperiences({ others }) {
  const ref = useScrollReveal()
  return (
    <section className="det-others">
      <div className="container">
        <div className="det-others__header fade-up" ref={ref}>
          <span className="section-label">Also Available</span>
          <div className="divider-line" />
          <h2>Other Experiences</h2>
        </div>
        <div className="det-others__grid">
          {others.map((pkg, i) => (
            <OtherCard key={pkg.id} pkg={pkg} delay={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function OtherCard({ pkg, delay }) {
  const ref = useScrollReveal()
  return (
    <div className={`other-card fade-up d${delay + 1}`} ref={ref}>
      <div className="other-card__img">
        <img src={pkg.cardImage} alt={pkg.name} loading="lazy" />
        <div className="other-card__overlay" />
      </div>
      <div className="other-card__body">
        <p className="other-card__tag">{pkg.tagline}</p>
        <h3 className="other-card__name">{pkg.name}</h3>
        <p className="other-card__price">from €{pkg.prices.adult} per adult</p>
        <Link to={`/experiences/${pkg.id}`} className="other-card__link">
          View Details <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  )
}