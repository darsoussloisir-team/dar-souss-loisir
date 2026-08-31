import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/ui/WhatsAppButton'
import ChatWidget from './components/ui/ChatWidget'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import ExperiencesIndex from './pages/ExperiencesIndex'
import ExperienceDetail from './pages/experiences/ExperienceDetail'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/"                        element={<Home />} />
        <Route path="/about"                   element={<About />} />
        <Route path="/experiences"             element={<ExperiencesIndex />} />
        <Route path="/experiences/:packageId"  element={<ExperienceDetail />} />
        <Route path="/gallery"                 element={<Gallery />} />
        <Route path="/contact"                 element={<Contact />} />
      </Routes>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </BrowserRouter>
  )
}