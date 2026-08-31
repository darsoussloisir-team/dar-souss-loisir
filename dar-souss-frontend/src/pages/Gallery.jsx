import { useState } from 'react'
import { X } from 'lucide-react'
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
import { useScrollReveal } from '../hooks/useScrollReveal'
const GALLERY_IMAGES = [
  { id: 1, src: image1, caption: 'Barbecue Experience', category: 'food' },
  { id: 2, src: image2, caption: 'Barbecue Experience', category: 'food' },
  { id: 3, src: image3, caption: 'Camel Experience', category: 'ride' },
  { id: 4, src: image4, caption: 'Camel Ride', category: 'ride' },
  { id: 5, src: image5, caption: 'Camels by the River', category: 'landscape' },
  { id: 6, src: image6, caption: 'Our Guests', category: 'ride' },
  { id: 7, src: image7, caption: 'Our Clients', category: 'ride' },
  { id: 8, src: image8, caption: 'Camel Ride Experience', category: 'ride' },
  { id: 9, src: image9, caption: 'Guests by the River', category: 'landscape' },
  { id: 10, src: image10, caption: 'Traditional Moroccan Experience', category: 'ranch' },
  { id: 11, src: image11, caption: 'Traditional Couscous', category: 'food' },
  { id: 12, src: image12, caption: 'Fresh Bread', category: 'food' },
  { id: 13, src: image13, caption: 'Group Experience', category: 'ride' },
  { id: 14, src: image14, caption: 'Group Experience', category: 'ride' },
  { id: 15, src: image15, caption: 'Group Experience', category: 'ride' },
  { id: 16, src: image16, caption: 'Group Experience', category: 'ride' },
  { id: 17, src: image17, caption: 'Our Guests', category: 'ride' },
  { id: 18, src: image18, caption: 'Our Guests', category: 'ride' },
  { id: 19, src: image19, caption: 'River Landscape', category: 'landscape' },
  { id: 20, src: image20, caption: 'River Landscape', category: 'landscape' },
  { id: 21, src: image21, caption: 'Sunset Experience', category: 'landscape' },
  { id: 22, src: image22, caption: 'Sunset by the Lake', category: 'landscape' },
  { id: 23, src: image23, caption: 'Sunset by the River', category: 'landscape' },
  { id: 24, src: image24, caption: 'Moroccan Tea & Cakes', category: 'food' },
]
import './Gallery.css'

const FILTERS = ['all', 'landscape', 'ride', 'ranch', 'food']

export default function Gallery() {
  const [active, setActive] = useState('all')
  const [lightbox, setLightbox] = useState(null)

  const filtered = active === 'all' ? GALLERY_IMAGES : GALLERY_IMAGES.filter(img => img.category === active)

  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg">
          <img src={image6} alt="Gallery" />
        </div>
        <div className="container page-hero__content">
          <span className="section-label page-hero__label">Photo Gallery</span>
          <div className="divider-line" />
          <h1 className="page-hero__title">The Experience<br /><em>in Pictures</em></h1>
        </div>
      </section>

      <section className="gallery-page">
        <div className="container">

          {/* Filters */}
          <div className="gallery-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`gallery-filter ${active === f ? 'gallery-filter--active' : ''}`}
                onClick={() => setActive(f)}
              >
                {f === 'all' ? 'All Photos' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="gallery-grid">
            {filtered.map((img, i) => (
              <GalleryItem key={img.id} img={img} delay={i % 4} onClick={() => setLightbox(img)} />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox__close" onClick={() => setLightbox(null)}><X size={22} /></button>
          <div className="lightbox__img-wrap" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption} />
            <p className="lightbox__caption">{lightbox.caption}</p>
          </div>
        </div>
      )}
    </>
  )
}

function GalleryItem({ img, delay, onClick }) {
  const ref = useScrollReveal()
  return (
    <div className={`gallery-item fade-up d${delay + 1}`} ref={ref} onClick={onClick}>
      <img src={img.src} alt={img.caption} loading="lazy" />
      <div className="gallery-item__overlay">
        <p className="gallery-item__caption">{img.caption}</p>
      </div>
    </div>
  )
}