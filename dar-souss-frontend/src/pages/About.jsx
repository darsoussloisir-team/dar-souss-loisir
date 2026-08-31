import { Link } from 'react-router-dom'
import { Star, ExternalLink } from 'lucide-react'
import { REVIEWS, REVIEW_LINKS } from '../data/content'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './About.css'

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

export default function About() {
  return (
    <>
      <PageHero />
      <Story />
      <Pillars />
      <Chef />
      <AllReviews />
      <CtaStrip />
    </>
  )
}

function PageHero() {
  return (
    <section className="page-hero">
      <div className="page-hero__bg">
        <img src={image16} alt="Camel trek" />
      </div>
      <div className="container page-hero__content">
        <span className="section-label page-hero__label">Our Story</span>
        <div className="divider-line" />
        <h1 className="page-hero__title">Seventeen years of<br /><em>one singular craft</em></h1>
        <p className="page-hero__sub">We do nothing but camel rides. We have done so since 2005 and we intend to keep doing so.</p>
      </div>
    </section>
  )
}

function Story() {
  const ref1 = useScrollReveal()
  const ref2 = useScrollReveal()
  return (
    <section className="about-story">
      <div className="container">
        <div className="about-story__layout">
          <div className="about-story__images fade-up" ref={ref1}>
            <div className="about-story__img-main">
              <img src={image21} alt="The Souss Massa River mouth at sunset" />
            </div>
            <div className="about-story__img-inset">
              <img src={image24} alt="Moroccan mint tea ceremony at the ranch" />
              <div className="about-story__badge">
                <span className="about-story__badge-n">2005</span>
                <span className="about-story__badge-l">Est. in Agadir</span>
              </div>
            </div>
          </div>

          <div className="about-story__text fade-up d2" ref={ref2}>
            <span className="section-label">Who We Are</span>
            <div className="divider-line" />
            <h2>A family business built<br /><em>on a single conviction</em></h2>
            <p>
              Dar Souss Loisir was born from a simple conviction: that tourists deserve a genuine
              encounter with nomadic life — not a two-minute photo opportunity on a tired animal
              surrounded by salespeople.
            </p>
            <p>
              From our ranch in Aghroud Bensergao, we take you through the village, across
              a eucalyptus forest, and down to the mouth of the Souss Massa River — one of
              Morocco's most important bird sanctuaries and, depending on the tide, home to
              flocks of flamingos and migratory birds.
            </p>
            <p>
              After seventeen years, our approach remains unchanged: one tourist per camel,
              a maximum of fifteen guests per tour, no upselling, and a guide who knows every
              stretch of this land by name. What follows the ride — mint tea, couscous, or a
              full barbecue — is prepared by a family member who has been cooking Moroccan food
              for over four decades.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pillars() {
  const ref = useScrollReveal()
  const items = [
    {
      num: '01',
      title: 'One Tourist per Camel',
      body: 'Your comfort and the animal\'s well-being are never negotiated. Children under 12 share with a parent for safety — that is the only exception.',
    },
    {
      num: '02',
      title: 'No Hidden Agendas',
      body: 'We specialise exclusively in camel rides. We do not stop at craft shops, we do not sell excursions mid-ride, and we do not lower prices to compensate for upselling.',
    },
    {
      num: '03',
      title: 'Transparent Pricing',
      body: 'The price you see on our website is the price you pay. Adults, children, and infants are listed clearly. There are no supplements at pickup.',
    },
    {
      num: '04',
      title: 'Family Cooking',
      body: 'Our chef has over 40 years of culinary expertise. He is a family member who appears regularly at the ranch and whose food is the reason many guests book again.',
    },
    {
      num: '05',
      title: 'Animal Welfare',
      body: 'Our dromedaries are domestic, calm, and well cared for. We limit group sizes so the animals are never overworked. Tours are cancelled in rain — flat-footed camels slip.',
    },
    {
      num: '06',
      title: 'Punctual Pickup',
      body: 'Your guide meets you at your hotel reception with your reservation visible. The drive to the ranch is ten minutes. We have never left anyone waiting.',
    },
  ]
  return (
    <section className="pillars">
      <div className="container">
        <div className="pillars__header fade-up" ref={ref}>
          <span className="section-label">What Sets Us Apart</span>
          <div className="divider-line" />
          <h2>Six commitments we<br /><em>never compromise on</em></h2>
        </div>
        <div className="pillars__grid">
          {items.map((item, i) => <PillarCard key={item.num} item={item} delay={i % 3} />)}
        </div>
      </div>
    </section>
  )
}

function PillarCard({ item, delay }) {
  const ref = useScrollReveal()
  return (
    <div className={`pillar-card fade-up d${delay + 1}`} ref={ref}>
      <span className="pillar-card__num">{item.num}</span>
      <h4 className="pillar-card__title">{item.title}</h4>
      <p className="pillar-card__body">{item.body}</p>
    </div>
  )
}

function Chef() {
  const ref = useScrollReveal()
  return (
    <section className="chef">
      <div className="chef__img">
        <img src={image1} alt="Traditional Moroccan couscous with argan oil" />
        <div className="chef__img-ov" />
      </div>
      <div className="chef__text fade-up" ref={ref}>
        <span className="section-label" style={{ color: 'var(--green-gold)' }}>Our Kitchen</span>
        <div className="divider-line" />
        <h2 style={{ color: 'var(--sand-50)' }}>Four decades of<br /><em style={{ color: 'var(--terra-400)' }}>Moroccan expertise</em></h2>
        <p style={{ color: 'var(--sand-300)', marginBottom: '1.25rem' }}>
          Our family chef has been cooking Moroccan food for over forty years. He visits the
          ranch regularly, guides our kitchen, and ensures that every couscous, every
          barbecue, and every plate of salads reflects what Moroccan hospitality actually
          tastes like — not what it looks like on a tourist menu.
        </p>
        <p style={{ color: 'var(--sand-300)' }}>
          Vegetarian options are always available. Simply let us know at the time of booking
          and we will prepare accordingly.
        </p>
      </div>
    </section>
  )
}

function AllReviews() {
  const ref = useScrollReveal()
  return (
    <section id="reviews" className="all-reviews">
      <div className="container">
        <div className="all-reviews__header fade-up" ref={ref}>
          <span className="section-label">Guest Reviews</span>
          <div className="divider-line" />
          <h2>What travelers say<br /><em>about their experience</em></h2>
          <div className="all-reviews__links">
            <a href={REVIEW_LINKS.google} target="_blank" rel="noreferrer" className="reviews__platform-link">
              All Google reviews <ExternalLink size={13} />
            </a>
            <a href={REVIEW_LINKS.viator} target="_blank" rel="noreferrer" className="reviews__platform-link">
              All Viator reviews <ExternalLink size={13} />
            </a>
          </div>
        </div>
        <div className="all-reviews__grid">
          {REVIEWS.map((r, i) => <FullReviewCard key={r.id} review={r} delay={i % 3} />)}
        </div>
      </div>
    </section>
  )
}

function FullReviewCard({ review, delay }) {
  const ref = useScrollReveal()
  return (
    <div className={`full-review fade-up d${delay + 1}`} ref={ref}>
      <div className="full-review__stars">
        {Array.from({ length: review.stars }).map((_, i) => (
          <Star key={i} size={13} fill="var(--green-gold)" color="var(--green-gold)" />
        ))}
      </div>
      <p className="full-review__text">"{review.text}"</p>
      <div className="full-review__footer">
        <div>
          <span className="full-review__name">{review.name}</span>
          <span className="full-review__country">{review.country}</span>
        </div>
        <div className="full-review__meta">
          <span className="full-review__platform">{review.source}</span>
          <span className="full-review__date">{review.date}</span>
        </div>
      </div>
    </div>
  )
}

function CtaStrip() {
  const ref = useScrollReveal()
  return (
    <section className="about-cta fade-up" ref={ref}>
      <div className="container about-cta__inner">
        <h2>Ready to join us?</h2>
        <p>Daily departures at 6:30 pm and 7:00 pm from your Agadir hotel.</p>
        <div className="about-cta__actions">
          <Link to="/experiences" className="btn-primary"><span>Browse Experiences</span></Link>
          <Link to="/contact" className="btn-outline">Get in Touch</Link>
        </div>
      </div>
    </section>
  )
}