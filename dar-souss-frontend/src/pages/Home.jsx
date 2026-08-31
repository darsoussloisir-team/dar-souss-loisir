import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Star, ExternalLink } from 'lucide-react'
import { PACKAGES, REVIEWS, REVIEW_LINKS } from '../data/content'
import { useScrollReveal } from '../hooks/useScrollReveal'
import BookingModal from '../components/ui/BookingModal'
import './Home.css'
import image1 from '../assets/images/Barbecue.jpg'
import image2 from '../assets/images/Barbecue.webp'
import image3 from '../assets/images/camel2.jpg'
import image4 from '../assets/images/Camel.jpg'
import image5 from '../assets/images/camelsRiver.jpg'
import image6 from '../assets/images/GroupOfClients.jpg'
import image7 from '../assets/images/Clients.jpg'
import image8 from '../assets/images/ClientsOnCamels.webp'
import image9 from '../assets/images/ClientsRiver.jpg'
import image10 from '../assets/images/ClientsWearingTraditionalAtires.jpg'
import image11 from '../assets/images/Couscous.jpg'
import image12 from '../assets/images/fresh-bread.webp'
import image13 from '../assets/images/Group2.jpg'
import image14 from '../assets/images/group2.webp'
import image15 from '../assets/images/Group3.jpeg'
import image16 from '../assets/images/group4.jpg'
import image17 from '../assets/images/GroupClients.webp'
import image18 from '../assets/images/GroupOfClients.webp'
import image19 from '../assets/images/river.jpg'
import image20 from '../assets/images/river2.jpg'
import image21 from '../assets/images/sunset.jpg'
import image22 from '../assets/images/sunset-at-the-lake.jpg'
import image23 from '../assets/images/SunsetByTheRiver.jpg'
import image24 from '../assets/images/TeaCakes.webp'

export default function Home() {
  const [bookingPkg, setBookingPkg] = useState(null)
  return (
    <>
      <Hero onBook={setBookingPkg} />
      <TrustStrip />
      <PackagesPreview onBook={setBookingPkg} />
      <StoryStrip />
      <Reviews />
      <CtaBanner />
      {bookingPkg && <BookingModal pkg={bookingPkg} onClose={() => setBookingPkg(null)} />}
    </>
  )
}

function Hero({ onBook }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <section className="hero">
      <div className="hero__bg">
        {/* Replace this src with your own hero photo */}
        <img src={image6} alt="Camel ride at sunset in Agadir" onLoad={() => setLoaded(true)} className="hero__img" />
        <div className="hero__overlay" />
        <div className="hero__grain" />
      </div>
      <div className={`hero__content container ${loaded ? 'hero__content--in' : ''}`}>
        <div className="hero__meta">
          <span className="hero__line" /><span className="hero__meta-text">Agadir, Morocco — Since 2005</span><span className="hero__line" />
        </div>
        <h1 className="hero__title">Where the Desert<br /><em>Meets the Sea</em></h1>
        <p className="hero__sub">Two hours of nomadic life. One camel, one horizon,<br />one memory that outlasts every other souvenir.</p>
        <div className="hero__actions">
          <button className="btn-primary" onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>Discover Our Experiences</span>
          </button>
          <a href="https://wa.me/212615726781?text=Hello%2C%20I%20would%20like%20to%20book%20a%20camel%20ride." target="_blank" rel="noreferrer" className="btn-outline-light">Book via WhatsApp</a>
        </div>
        <div className="hero__stats">
          {[['17', 'Years of Experience'], ['1', 'Camel per Guest'], ['15', 'Max Guests per Tour']].map(([n, l], i) => (
            <div key={i} className="hero__stat-wrap">
              {i > 0 && <div className="hero__stat-div" />}
              <div className="hero__stat"><span className="hero__stat-n">{n}</span><span className="hero__stat-l">{l}</span></div>
            </div>
          ))}
        </div>
      </div>
      <button className="hero__scroll" onClick={() => document.getElementById('trust')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Scroll">
        <ChevronDown size={20} />
      </button>
    </section>
  )
}

function TrustStrip() {
  const ref = useScrollReveal()
  return (
    <div id="trust" className="trust fade-up" ref={ref}>
      <div className="container trust__inner">
        {['One tourist per camel — no exceptions', 'Hotel pickup included from Agadir', 'No shopping stops or hidden agendas', 'Family-run for 17 years'].map(t => (
          <div key={t} className="trust__item">
            <span className="trust__dot" />{t}
          </div>
        ))}
      </div>
    </div>
  )
}

function PackagesPreview({ onBook }) {
  const ref = useScrollReveal()
  return (
    <section id="packages" className="packages-preview">
      <div className="container">
        <div className="packages-preview__header fade-up" ref={ref}>
          <span className="section-label">Our Experiences</span>
          <div className="divider-line" />
          <h2>Three ways to live<br /><em>the nomadic life</em></h2>
        </div>
        <div className="pkg-grid">
          {PACKAGES.map((pkg, i) => <PkgCard key={pkg.id} pkg={pkg} delay={i} onBook={onBook} />)}
        </div>
      </div>
    </section>
  )
}

function PkgCard({ pkg, delay, onBook }) {
  const ref = useScrollReveal()
  return (
    <div className={`pkg-card fade-up d${delay + 1} ${pkg.featured ? 'pkg-card--featured' : ''}`} ref={ref}>
      {pkg.featured && <div className="pkg-card__badge">Most Popular</div>}
      <div className="pkg-card__img">
        <img src={pkg.cardImage} alt={pkg.name} loading="lazy" />
        <div className="pkg-card__img-ov" />
        <div className="pkg-card__price-ov">
          <span className="pkg-card__from">from</span>
          <span className="pkg-card__num">€{pkg.prices.adult}</span>
        </div>
      </div>
      <div className="pkg-card__body">
        <p className="pkg-card__tag">{pkg.tagline}</p>
        <h3 className="pkg-card__name">{pkg.name}</h3>
        <p className="pkg-card__desc">{pkg.shortDesc}</p>
        <div className="pkg-card__actions">
          <button className="btn-primary pkg-card__book" onClick={() => onBook(pkg)}>
            <span>Book Now</span>
          </button>
          <Link to={`/experiences/${pkg.id}`} className="pkg-card__more">
            More Info
          </Link>
        </div>
      </div>
    </div>
  )
}

function StoryStrip() {
  const ref = useScrollReveal()
  return (
    <section className="story-strip">
      <div className="story-strip__img">
        <img src={image4} alt="Camel silhouettes at dusk" />
        <div className="story-strip__img-ov" />
      </div>
      <div className="story-strip__text fade-up" ref={ref}>
        <span className="section-label" style={{ color: 'var(--green-gold)' }}>Our Promise</span>
        <div className="divider-line" />
        <h2 style={{ color: 'var(--sand-50)' }}>Seventeen years of<br /><em style={{ color: 'var(--terra-400)' }}>one singular craft</em></h2>
        <p style={{ color: 'var(--sand-300)', marginBottom: '2rem' }}>
          We do nothing but camel rides. We have been doing this since 2005, we know this land, 
          these animals, and what genuine hospitality looks like. One tourist per camel. 
          No craft shops. No pressure. Just the Souss, the light, and your guide.
        </p>
        <Link to="/about" className="btn-outline-light">Our Full Story</Link>
      </div>
    </section>
  )
}

function Reviews() {
  const ref = useScrollReveal()
  const featured = REVIEWS.slice(0, 3)
  return (
    <section className="reviews">
      <div className="container">
        <div className="reviews__header fade-up" ref={ref}>
          <span className="section-label">What Our Guests Say</span>
          <div className="divider-line" />
          <h2>Trusted by travelers<br /><em>from around the world</em></h2>
          <div className="reviews__platforms">
            <a href={REVIEW_LINKS.google} target="_blank" rel="noreferrer" className="reviews__platform-link">
              Read all Google reviews <ExternalLink size={13} />
            </a>
            <a href={REVIEW_LINKS.viator} target="_blank" rel="noreferrer" className="reviews__platform-link">
              Read all Viator reviews <ExternalLink size={13} />
            </a>
          </div>
        </div>
        <div className="reviews__grid">
          {featured.map((r, i) => <ReviewCard key={r.id} review={r} delay={i} />)}
        </div>
        <div className="reviews__all">
          <Link to="/about#reviews" className="btn-outline">See All Reviews</Link>
        </div>
      </div>
    </section>
  )
}

function ReviewCard({ review, delay }) {
  const ref = useScrollReveal()
  return (
    <div className={`review-card fade-up d${delay + 1}`} ref={ref}>
      <div className="review-card__stars">
        {Array.from({ length: review.stars }).map((_, i) => <Star key={i} size={14} fill="var(--green-gold)" color="var(--green-gold)" />)}
      </div>
      <p className="review-card__text">"{review.text}"</p>
      <div className="review-card__footer">
        <div>
          <span className="review-card__name">{review.name}</span>
          <span className="review-card__country">{review.country}</span>
        </div>
        <div className="review-card__source">
          <span className="review-card__platform">{review.source}</span>
          <span className="review-card__date">{review.date}</span>
        </div>
      </div>
    </div>
  )
}

function CtaBanner() {
  const ref = useScrollReveal()
  return (
    <section className="cta-banner fade-up" ref={ref}>
      <div className="container cta-banner__inner">
        <div>
          <h2 className="cta-banner__title">Ready to experience it?</h2>
          <p className="cta-banner__sub">Daily departures at 6:30 pm and 7:00 pm. Hotel pickup included.</p>
        </div>
        <div className="cta-banner__actions">
          <Link to="/experiences" className="btn-primary"><span>Browse Experiences</span></Link>
          <a href="https://wa.me/212615726781?text=Hello%2C%20I%20would%20like%20to%20book." target="_blank" rel="noreferrer" className="btn-whatsapp">Book on WhatsApp</a>
        </div>
      </div>
    </section>
  )
}