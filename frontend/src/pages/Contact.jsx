import { useState } from 'react';
import api, { extractErrorMessage } from '../services/api';
import { useVillaSettings } from '../hooks/useVillaSettings';
import WhatsAppButton from '../components/WhatsAppButton';
import { ErrorBanner, SuccessBanner } from '../components/StateViews';

const initialForm = {
  fullName: '', email: '', phone: '', whatsappNumber: '',
  checkIn: '', checkOut: '', adults: 2, children: 0,
  bookingType: 'holiday', airportTransfer: false, message: '',
};

const bookingTypeLabels = {
  holiday: 'Holiday',
  honeymoon: 'Honeymoon',
  family_stay: 'Family stay',
  group_stay: 'Group stay',
  long_stay: 'Long stay',
  other: 'Other',
};

export default function Contact() {
  const { settings } = useVillaSettings();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.checkIn) next.checkIn = 'Check-in date is required.';
    if (!form.checkOut) next.checkOut = 'Check-out date is required.';
    if (form.checkIn && form.checkOut && new Date(form.checkOut) <= new Date(form.checkIn)) {
      next.checkOut = 'Check-out must be after check-in.';
    }
    if (Number(form.adults) < 1) next.adults = 'At least 1 adult is required.';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    try {
      await api.post('/bookings', form);
      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setServerError(extractErrorMessage(err, 'We could not submit your request. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section" style={{ paddingTop: 'clamp(4rem, 8vw, 6rem)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem' }}>
        <div>
          <p className="eyebrow">Contact &amp; Booking</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>Request availability</h1>
          <p style={{ color: 'var(--color-palm)', marginBottom: '2rem' }}>
            Share your dates and a few details — we'll get back to you to confirm availability and next steps.
          </p>

          <SuccessBanner message={success ? "Thank you — your request has been received. We'll be in touch shortly." : ''} />
          <ErrorBanner message={serverError} />

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="fullName">Full name</label>
                <input id="fullName" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="phone">Phone number</label>
                <input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="whatsappNumber">WhatsApp number (optional)</label>
                <input id="whatsappNumber" value={form.whatsappNumber} onChange={(e) => update('whatsappNumber', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="checkIn">Check-in date</label>
                <input id="checkIn" type="date" value={form.checkIn} onChange={(e) => update('checkIn', e.target.value)} />
                {errors.checkIn && <span className="form-error">{errors.checkIn}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="checkOut">Check-out date</label>
                <input id="checkOut" type="date" value={form.checkOut} onChange={(e) => update('checkOut', e.target.value)} />
                {errors.checkOut && <span className="form-error">{errors.checkOut}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="adults">Adults</label>
                <input id="adults" type="number" min="1" value={form.adults} onChange={(e) => update('adults', e.target.value)} />
                {errors.adults && <span className="form-error">{errors.adults}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="children">Children</label>
                <input id="children" type="number" min="0" value={form.children} onChange={(e) => update('children', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="bookingType">Booking type</label>
                <select id="bookingType" value={form.bookingType} onChange={(e) => update('bookingType', e.target.value)}>
                  {Object.entries(bookingTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="airportTransfer">Airport transfer required?</label>
                <select
                  id="airportTransfer"
                  value={form.airportTransfer ? 'yes' : 'no'}
                  onChange={(e) => update('airportTransfer', e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="message">Message (optional)</label>
              <textarea id="message" rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} />
            </div>

            <button type="submit" className="btn btn--primary" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Sending…' : 'Submit Request'}
            </button>
          </form>
        </div>

        <aside>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>Prefer to chat directly?</h3>
            <p style={{ color: 'var(--color-palm)', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              Message us on WhatsApp for a quick response.
            </p>
            <WhatsAppButton settings={settings} label="Chat on WhatsApp" />
          </div>
          <div className="card">
            <h3>Contact details</h3>
            <p style={{ color: 'var(--color-palm)', fontSize: '0.95rem', margin: 0 }}>
              {settings?.contact_email || 'info@myplacediani.example'}<br />
              {settings?.contact_phone || ''}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
