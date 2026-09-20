import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../../services/api';
import { LoadingBlock, ErrorBanner, SuccessBanner } from '../../components/StateViews';

export default function SettingsAdmin() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => setForm(data.settings))
      .catch((err) => setError(extractErrorMessage(err, 'Could not load villa settings.')))
      .finally(() => setLoading(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const { data } = await api.put('/settings', form);
      setForm(data.settings);
      setSuccess('Villa settings updated.');
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save settings.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingBlock lines={5} />;
  if (!form) return <ErrorBanner message={error || 'Settings could not be loaded.'} />;

  return (
    <div>
      <h1 style={{ fontSize: '1.7rem', marginBottom: '1.5rem' }}>Villa Settings</h1>
      <ErrorBanner message={error} />
      <SuccessBanner message={success} />

      <form onSubmit={handleSubmit} style={{ maxWidth: '680px' }}>
        <div className="form-field">
          <label htmlFor="villa_description">Villa description</label>
          <textarea id="villa_description" rows={4} value={form.villa_description || ''} onChange={(e) => update('villa_description', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="contact_email">Contact email</label>
            <input id="contact_email" type="email" value={form.contact_email || ''} onChange={(e) => update('contact_email', e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="contact_phone">Contact phone</label>
            <input id="contact_phone" value={form.contact_phone || ''} onChange={(e) => update('contact_phone', e.target.value)} />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="whatsapp_number">WhatsApp number (international format, no + or spaces)</label>
          <input id="whatsapp_number" value={form.whatsapp_number || ''} onChange={(e) => update('whatsapp_number', e.target.value)} placeholder="254700000000" />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="check_in_time">Check-in time</label>
            <input id="check_in_time" value={form.check_in_time || ''} onChange={(e) => update('check_in_time', e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="check_out_time">Check-out time</label>
            <input id="check_out_time" value={form.check_out_time || ''} onChange={(e) => update('check_out_time', e.target.value)} />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="location_info">Location information</label>
          <textarea id="location_info" rows={2} value={form.location_info || ''} onChange={(e) => update('location_info', e.target.value)} />
        </div>

        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
