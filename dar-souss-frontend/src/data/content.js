// ─────────────────────────────────────────────────────────────────────────────
// DAR SOUSS LOISIR — Central Data
// Edit this file to update content across the entire site.
// ─────────────────────────────────────────────────────────────────────────────

// ── PACKAGES ─────────────────────────────────────────────────────────────────
// Replace image URLs with your own photos:
//   1. Put your photos in src/assets/images/
//   2. Import them at the top of this file:
//      import sunsetHero from '../assets/images/sunset-hero.jpg'
//   3. Use the variable instead of the URL string

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
import image25 from '../assets/images/cruise.jpg'
export const PACKAGES = [
  {
    id: 'sunset',
    name: 'Camel Ride at Sunset',
    tagline: 'The purest form of the experience',
    shortDesc: 'A two-hour camel ride through the village of Aghroud, the eucalyptus forest, and the mouth of the Souss Massa River — ending with mint tea at the ranch.',
    duration: '2 hours',
    time: 'Daily at 6:30 pm',
    maxGuests: 15,
    prices: { adult: 25, child: 12.5, infant: 0 },
    // ↓ Replace with your own photo
    heroImage: image13,
    cardImage: image13,
    includes: [
      'Hotel pickup & drop-off (Agadir city centre and coast only)',
      'Professional camel guide throughout',
      'One camel per guest — no exceptions',
      'Crossing of Aghroud Bensergao village',
      'Eucalyptus forest trail',
      'Souss Massa River mouth stop — flamingo spotting',
      'Sunset photography with your guide',
      'Mint tea & Moroccan cakes on return',
      'Bottled water',
    ],
    excludes: [
      'Pickup from cruise ships at Agadir port',
      'Pickup from Taghazout, Tamraght, Aourir, Imiwaddar',
    ],
    healthNotes: [
      'Not recommended for travelers with serious back or hip conditions',
      'Not recommended for pregnant travelers',
      'Not recommended for travelers with serious heart conditions',
      'Tours are cancelled in rainy conditions (flat-footed camels slip on wet ground)',
      'Children under 12 share a camel with a parent for safety',
      'Most travelers can participate',
    ],
    gallery: [
      image23,
      image24,
      image17,
      image5,
    ],
  },
  {
    id: 'bbq',
    name: 'Camel Ride & Barbecue',
    tagline: 'The full nomadic evening',
    shortDesc: 'Everything in the Sunset Ride, followed by a full barbecue dinner prepared by our family chef — a man with over 40 years of culinary expertise.',
    duration: '3 hours',
    time: 'Daily at 6:30 pm',
    maxGuests: 15,
    prices: { adult: 37, child: 25, infant: 0 },
    featured: true,
    heroImage: image1,
    cardImage: image1,
    includes: [
      'Everything included in the Sunset Ride',
      'Full barbecue dinner by our family chef',
      'Moroccan salads',
      'Chakchouka (without eggs)',
      'Grilled chicken or turkey escalope',
      'Couscous',
      'Seasonal fruits',
      'Mint tea, Moroccan cakes & soft drinks',
      'Bottled water & orange juice',
    ],
    excludes: [
      'Pickup from cruise ships at Agadir port',
      'Pickup from Taghazout, Tamraght, Aourir, Imiwaddar',
    ],
    healthNotes: [
      'Not recommended for travelers with serious back or hip conditions',
      'Not recommended for pregnant travelers',
      'Not recommended for travelers with serious heart conditions',
      'Tours are cancelled in rainy conditions',
      'Vegetarian option available — please advise at booking',
      'Children under 12 share a camel with a parent for safety',
    ],
    gallery: [
     image1,
     image2,
     image12,
     image14
    ],
  },
  {
    id: 'couscous',
    name: 'Camel Ride with Couscous',
    tagline: 'Tradition on a plate',
    shortDesc: 'The Sunset Ride followed by a traditional Moroccan couscous with argan oil, prepared by our family chef and served at the ranch.',
    duration: '3 hours',
    time: 'Daily at 7:00 pm',
    maxGuests: 15,
    prices: { adult: 30, child: 20, infant: 0 },
    heroImage: image11,
    cardImage: image11,
    includes: [
      'Everything included in the Sunset Ride',
      'Traditional Moroccan couscous with argan oil',
      'Moroccan salads',
      'Seasonal fruits',
      'Mint tea & Moroccan pastries',
      'Bottled water & soft drinks',
    ],
    excludes: [
      'Pickup from cruise ships at Agadir port',
      'Pickup from Taghazout, Tamraght, Aourir, Imiwaddar',
    ],
    healthNotes: [
      'Not recommended for travelers with serious back or hip conditions',
      'Not recommended for pregnant travelers',
      'Not recommended for travelers with serious heart conditions',
      'Tours are cancelled in rainy conditions',
      'Vegetarian option available — please advise at booking',
      'Children under 12 share a camel with a parent for safety',
    ],
    gallery: [
      image11,
      image20,
      image15,
      image9
    ],
  },
  {
  id: 'cruise',
  name: 'Cruise Ship Shore Excursion',
  tagline: 'Timed to your port call, guaranteed back to ship',
  shortDesc: 'A flexible camel excursion built around cruise arrival times, with traditional nomad dress for photos and a meal at the ranch — designed so you\'re back at the port with time to spare.',
  duration: '~2 hours',
  time: 'Flexible daytime departures, scheduled around your ship\'s port call',
  maxGuests: 12,
  prices: { adult: 25, child: 15, infant: 0 }, 
  heroImage: image25,
  cardImage: image25,
  includes: [
    'Hotel/port-area coordination timed to your ship\'s schedule',
    'Professional camel guide throughout',
    'One camel per guest',
    'Traditional nomad costume — borrowed for photos (tunic & headscarf)',
    'Coffee, tea & snacks',
    'A meal at the ranch',
    'Back-to-ship guarantee — we plan around your departure time',
  ],
  excludes: [
    'Port-to-ranch transfer (arranged on request — flat rate paid on arrival, not commissioned)',
  ],
  healthNotes: [
    'Not wheelchair accessible',
    'Infants must sit on a parent\'s lap rather than ride independently',
    'Not recommended for travelers with serious back, hip, or heart conditions',
    'Not recommended for pregnant travelers',
    'Maximum 12 travelers per group',
    'Free cancellation up to 24 hours before departure',
  ],
  gallery: [
    image10,
    image8,
    image7,
    image16,
  ],
},
]

// ── REVIEWS ───────────────────────────────────────────────────────────────────
// Replace these with your real reviews from Google / Viator / TripAdvisor
// Stars: 1–5

export const REVIEWS = [
  {
    id: 1,
    name: 'Dave Ulman',
    country: 'United States',
    stars: 5,
    source: 'Google',
    date: 'January 2026',
    text: 'We just completed a cruise with a stop in Agadir and I wanted to make a recommendation for an awesome camel ride excursion. During our port stop in Agadir we used DAR SOUSS LOISIR for our camel ride excursion. Except for a small delay at the port (caused by the port authorities) we had an amazing, awesome experience. This wasn\'t some short ride around the camel corral. They took us for a long ride out to the river to see the flamingos, although the flamingos were on the other side of the river (they cannot control where the flamingos stay), and back to the camel corral. I would recommend contacting them directly to arrange your camel ride while in Agadir. You won\'t regret it!',
    package: 'cruise',
  },
  {
    id: 2,
    name: 'Virginie Latore',
    country: 'France',
    stars: 5,
    source: 'Google',
    date: 'April 2025',
    text: 'Une superbe soirée entre la ballade et le repas. La ballade en dromadaire vaut la peine d être vécue une fois dans sa Vie. Notre guide était super gentil.Et le repas?!Un festin , accompagné de la grande fille de la famille, une personne passionnée et passionnante!!! Tout était bien du début à la fin. Merciiii du fond du cœur à cette famille.',
    package: 'bbq',
  },
  {
    id: 3,
    name: 'Amy.E',
    country: 'United Kingdom',
    stars: 5,
    source: 'Viator',
    date: 'October 2023',
    text: 'We had the most incredible experience - one that we’ll remember fondly for the rest of our lives. From the clear communication to the delicious authentic food, the unique hospitality to the friendliness of the team, everything was perfect. The camels are gorgeous and well looked after, they clearly loved their handlers! The skies were a little cloudy so not great views of the sunset but the atmosphere and experience was spellbinding. Hussein, you’re an asset to the team and it was a pleasure speaking with you. We cannot fault this experience at all, it was simply incredible - a must-do experience in Agadir.',
    package: 'sunset',
  },
  {
    id: 4,
    name: 'Ruth',
    country: 'United Kingdom',
    stars: 5,
    source: 'TripAdvisor',
    date: 'August 2025',
    text: 'Such a fun experience for our family (comprising 3 adults and 2 x 11 year olds). The communication pre trip was great - and We received a warm greeting from Asmaa and she quickly got us dressed up in national dress (which is optional). The camels were clearly well looked after and it was pleasing to see the guides chatting to them and checking they were ok. The ride itself is nice enough round the back of a village on the outskirts of the city and along to the river - is in need of a little clearing but the sunset, the palm trees and the soft padding of the camels was relaxing and atmospheric especially with the call to prayer on the return leg. The post ride traditional meal prepared by Asmaa and her family was delicious and huge. She provided a little birthday gift to my daughter and gave another to her cousin (so she didn’t feel left out) Great value and a lovely experience - thank you',
    package: 'bbq',
  },
  {
    id: 5,
    name: 'Curiosity48386779756',
    country: 'Belgium',
    stars: 5,
    source: 'TripAdvisor',
    date: 'July 2023',
    text: 'A great time spent with my mom! Thank you for everything, the welcome, the hospitality, the kindness. Clearly something to do in Agadir, walk and couscous at the end at the top!!!😇',
    package: 'couscous',
  },
  {
    id: 6,
    name: 'Virginie R',
    country: 'France',
    stars: 5,
    source: 'Viator',
    date: 'January 2024',
    text: 'If you want to take a camel ride with a great guide who shows you everything there is to know about the route (royal palace, ancient Berber village, etc...) and who takes you to the perfect places to take pretty photos, so go for it! The whole team is very kind, they are very welcoming and warm, they are gracious and think of the smallest detail so that you have a wonderful time.',
    package: 'sunset',
  },
]

// External review links — update with your actual profile URLs
export const REVIEW_LINKS = {
  google: 'https://maps.google.com/?q=Dar+Souss+Loisir+Agadir',
  viator: 'https://www.tripadvisor.com/Attraction_Review-g293731-d3966355-Reviews-Dar_Souss_Loisir-Agadir_Souss_Massa.html',
}

// ── GALLERY IMAGES ────────────────────────────────────────────────────────────
// Replace src values with your own photos
// caption is shown on hover
export const GALLERY_IMAGES = [
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
  { id: 12, src: image12, caption: 'Fresh Moroccan Bread', category: 'food' },
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