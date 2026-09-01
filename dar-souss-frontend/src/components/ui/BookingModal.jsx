import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, CheckCircle } from 'lucide-react'
import { submitBooking } from '../../services/api'
import './BookingModal.css'

export default function BookingModal({ pkg, onClose }) {
  const [step, setStep] = useState('form')
  const [serverError, setServerError] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [totalPrice, setTotalPrice] = useState(pkg.prices.adult)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { adults: 1, children: 0, infants: 0 }
  })

  const adults   = parseInt(watch('adults')   || 0)
  const children = parseInt(watch('children') || 0)
  const infants  = parseInt(watch('infants')  || 0)

  useEffect(() => {
    setTotalPrice(Math.round((adults * pkg.prices.adult + children * pkg.prices.child) * 100) / 100)
  }, [adults, children, infants, pkg.prices])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const res = await submitBooking({ ...data, package: pkg.id, adults: parseInt(data.adults), children: parseInt(data.children), infants: parseInt(data.infants) })
      setWhatsappUrl(res.whatsapp_url)
      setStep('success')
    } catch (err) {
  const detail = err?.response?.data?.detail

  if (Array.isArray(detail)) {
    const messages = detail.map(error => {
      const field = error.loc?.[error.loc.length - 1] || 'field'
      return `${field}: ${error.msg}`
    })

    setServerError(messages.join(' | '))
  } else {
    setServerError(
      typeof detail === 'string'
        ? detail
        : 'Something went wrong. Please try again.'
    )
  }
}
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box bm">
        <div className="bm__header">
          <div>
            <p className="bm__pkg-label">{pkg.name}</p>
            <h3 className="bm__title">Book Your Experience</h3>
          </div>
          <button className="bm__close" onClick={onClose}><X size={18} /></button>
        </div>

        {step === 'form' ? (
          <form className="bm__form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <p className="bm__section">Your Details</p>
            <div className="bm__row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="John Smith" {...register('name', { required: 'Required', minLength: { value: 2, message: 'Too short' } })} />
                {errors.name && <span className="form-error">{errors.name.message}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" placeholder="john@example.com" {...register('email', { required: 'Required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>
            </div>
            <div className="bm__row">
              <div className="form-group">
                <label className="form-label">Phone / WhatsApp</label>
                <input className="form-input" type="tel" placeholder="+33 6 12 34 56 78" {...register('phone')} />
              </div>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input className="form-input" type="date" min={minDate} {...register('date', { required: 'Required' })} />
                {errors.date && <span className="form-error">{errors.date.message}</span>}
              </div>
            </div>

            <p className="bm__section">Guests</p>
            <div className="bm__guests">
              {[
                { key: 'adults',   label: 'Adults',   sub: `€${pkg.prices.adult} each`, min: 1 },
                { key: 'children', label: 'Children', sub: `€${pkg.prices.child} each`, min: 0 },
                { key: 'infants',  label: 'Infants',  sub: 'Free (sit with parent)',    min: 0 },
              ].map(g => (
                <div key={g.key} className="bm__guest-row">
                  <div>
                    <span className="bm__guest-label">{g.label}</span>
                    <span className="bm__guest-sub">{g.sub}</span>
                  </div>
                  <input className="form-input bm__count" type="number" min={g.min} max={15} {...register(g.key, { min: g.min })} />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Special Notes</label>
              <textarea className="form-textarea" rows={3} placeholder="Dietary requirements, accessibility needs..." {...register('special_notes')} />
            </div>

            <div className="bm__summary">
              <span className="bm__summary-label">Estimated Total</span>
              <span className="bm__summary-price">€{totalPrice.toFixed(2)}</span>
            </div>

            {serverError && <div className="bm__error">{serverError}</div>}

            <button type="submit" className="btn-primary bm__submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Sending...' : 'Confirm Booking Request'}</span>
            </button>
            <p className="bm__disclaimer">We will confirm your reservation by email within a few hours.</p>
          </form>
        ) : (
          <div className="bm__success">
            <CheckCircle size={48} strokeWidth={1.5} color="var(--green-deep)" />
            <h3>Booking Request Sent</h3>
            <p>Thank you! We have received your request for <strong>{pkg.name}</strong> and will confirm by email shortly.</p>
            <div className="bm__success-actions">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-whatsapp">Confirm on WhatsApp</a>
              <button className="btn-outline" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}