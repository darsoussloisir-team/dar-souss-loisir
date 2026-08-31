import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Phone, Mail, MapPin, CheckCircle, Clock } from 'lucide-react'
import { submitContact } from '../services/api'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './Contact.css'
import image18 from '../assets/images/GroupClients.webp'

export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="page-hero__bg">
          <img src={image18} alt="Contact Dar Souss Loisir" />
        </div>
        <div className="container page-hero__content">
          <span className="section-label page-hero__label">Get in Touch</span>
          <div className="divider-line" />
          <h1 className="page-hero__title">We are here<br /><em>to help</em></h1>
          <p className="page-hero__sub">Questions about our experiences, availability, or anything else — we reply within a few hours.</p>
        </div>
      </section>

      <section className="contact-page">
        <div className="container">
          <div className="contact-page__layout">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

      <MapSection />
    </>
  )
}

function ContactInfo() {
  const ref = useScrollReveal()
  return (
    <div className="contact-info fade-up" ref={ref}>
      <span className="section-label">Direct Contact</span>
      <div className="divider-line" />
      <h2 className="contact-info__title">The fastest way<br /><em>is WhatsApp</em></h2>
      <p className="contact-info__body">
        For booking confirmations and quick questions, WhatsApp is always the fastest channel.
        Send us a message and we will get back to you within a few hours, every day.
      </p>

      <div className="contact-info__details">
        <a href="tel:+212615726781" className="contact-info__detail">
          <div className="contact-info__icon"><Phone size={15} /></div>
          <div>
            <span className="contact-info__detail-label">Phone &amp; WhatsApp</span>
            <span className="contact-info__detail-value">+212 615 726 781</span>
          </div>
        </a>
        <a href="mailto:contact.darsoussloisir@gmail.com" className="contact-info__detail">
          <div className="contact-info__icon"><Mail size={15} /></div>
          <div>
            <span className="contact-info__detail-label">Email</span>
            <span className="contact-info__detail-value">contact.darsoussloisir@gmail.com</span>
          </div>
        </a>
        <div className="contact-info__detail">
          <div className="contact-info__icon"><MapPin size={15} /></div>
          <div>
            <span className="contact-info__detail-label">Location</span>
            <span className="contact-info__detail-value">Aghroud Village, Bensergao, Agadir</span>
          </div>
        </div>
        <div className="contact-info__detail">
          <div className="contact-info__icon"><Clock size={15} /></div>
          <div>
            <span className="contact-info__detail-label">Departure Times</span>
            <span className="contact-info__detail-value">Daily at 6:30 pm &amp; 7:00 pm</span>
          </div>
        </div>
      </div>

      <a
        href="https://wa.me/212615726781?text=Hello%2C%20I%20have%20a%20question%20about%20your%20camel%20rides."
        target="_blank"
        rel="noreferrer"
        className="btn-whatsapp"
      >
        Open WhatsApp
      </a>
    </div>
  )
}

function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const ref = useScrollReveal()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const res = await submitContact(data)
      setWhatsappUrl(res.whatsapp_url)
      setSubmitted(true)
    } catch (err) {
      const msg = err?.response?.data?.detail
      setServerError(typeof msg === 'string' ? msg : 'Something went wrong. Please try again or reach us on WhatsApp.')
    }
  }

  return (
    <div className="contact-form-wrap fade-up d2" ref={ref}>
      {!submitted ? (
        <>
          <div className="contact-form-wrap__header">
            <span className="section-label">Send a Message</span>
          </div>
          <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="Your name" {...register('name', { required: 'Required', minLength: { value: 2, message: 'Too short' } })} />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            <div className="contact-form__row">
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" placeholder="your@email.com" {...register('email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Phone / WhatsApp</label>
                <input className="form-input" type="tel" placeholder="+33 6 12 34 56 78" {...register('phone')} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Message *</label>
              <textarea className="form-textarea" rows={5} placeholder="How can we help? Ask about our experiences, availability, or accessibility." {...register('message', { required: 'Required', minLength: { value: 10, message: 'Message too short' } })} />
              {errors.message && <span className="form-error">{errors.message.message}</span>}
            </div>

            {serverError && <div className="contact-form__error">{serverError}</div>}

            <button type="submit" className="btn-primary contact-form__submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </>
      ) : (
        <div className="contact-success">
          <CheckCircle size={44} strokeWidth={1.5} color="var(--green-deep)" />
          <h3>Message Received</h3>
          <p>Thank you for reaching out. We will reply to your email within a few hours. For a faster response, continue the conversation on WhatsApp.</p>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-whatsapp">Continue on WhatsApp</a>
        </div>
      )}
    </div>
  )
}

function MapSection() {
  const ref = useScrollReveal()
  return (
    <section className="contact-map fade-up" ref={ref}>
      <div className="container">
        <div className="contact-map__inner">
          <div className="contact-map__text">
            <span className="section-label">Find Us</span>
            <div className="divider-line" />
            <h3>Aghroud Village, Bensergao</h3>
            <p>Our ranch is ten minutes from the Agadir city centre. We handle all logistics — simply provide your hotel name when booking and your guide will meet you at reception.</p>
            <a href="https://maps.google.com/?q=Aghroud+Bensergao+Agadir+Morocco" target="_blank" rel="noreferrer" className="btn-outline">Open in Google Maps</a>
          </div>
          <div className="contact-map__map">
            <iframe title="Dar Souss Loisir" src="https://maps.google.com/maps?q=Aghroud+Bensergao+Agadir+Morocco&output=embed" width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen />
          </div>
        </div>
      </div>
    </section>
  )
}