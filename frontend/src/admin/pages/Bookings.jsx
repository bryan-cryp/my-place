import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../../services/api';
import { LoadingBlock, EmptyState, ErrorBanner } from '../../components/StateViews';
import ConfirmDialog from '../components/ConfirmDialog';

const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get('/bookings', { params: { status: status || undefined, search: search || undefined, pageSize: 100 } })
      .then(({ data }) => setBookings(data.bookings))
      .catch((err) => setError(extractErrorMessage(err, 'Could not load bookings.')))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [status]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    load();
  }

  async function updateStatus(id, newStatus) {
    try {
      const { data } = await api.put(`/bookings/${id}`, { status: newStatus });
      setBookings((prev) => prev.map((b) => (b.id === id ? data.booking : b)));
      if (selected?.id === id) setSelected(data.booking);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not update booking status.'));
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/bookings/${pendingDelete.id}`);
      setBookings((prev) => prev.filter((b) => b.id !== pendingDelete.id));
      setSelected(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not delete booking.'));
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Bookings</h1>
          <p className="admin-page__subtitle">Manage reservations, guest details, and booking status.</p>
        </div>
      </div>

      <ErrorBanner message={error} />

      <form onSubmit={handleSearchSubmit} className="toolbar">
        <input
          type="search"
          placeholder="Search by name, email, or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{capitalize(s)}</option>)}
        </select>
        <button type="submit" className="icon-btn">Search</button>
      </form>

      {loading && <div className="admin-card"><LoadingBlock lines={5} /></div>}

      {!loading && bookings.length === 0 && (
        <div className="admin-card">
          <EmptyState title="No bookings found" description="Try a different search or clear the filters." />
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="data-table-wrapper admin-card" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Dates</th>
                <th>Guests</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong>{b.full_name}</strong><br />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-palm)' }}>{b.email}</span>
                  </td>
                  <td>{formatDate(b.check_in)} → {formatDate(b.check_out)}</td>
                  <td>{b.adults} adults, {b.children} children</td>
                  <td>{formatBookingType(b.booking_type)}</td>
                  <td>
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={`badge badge--${b.status}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{capitalize(s)}</option>)}
                    </select>
                  </td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn" onClick={() => setSelected(b)}>View</button>
                    <button className="icon-btn icon-btn--danger" onClick={() => setPendingDelete(b)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <BookingDetailModal
          booking={selected}
          onClose={() => setSelected(null)}
          onSaveNotes={async (notes) => {
            try {
              const { data } = await api.put(`/bookings/${selected.id}`, { adminNotes: notes });
              setBookings((prev) => prev.map((b) => (b.id === selected.id ? data.booking : b)));
              setSelected(data.booking);
            } catch (err) {
              setError(extractErrorMessage(err, 'Could not save notes.'));
            }
          }}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this booking?"
        description={pendingDelete ? `This will permanently remove the request from ${pendingDelete.full_name}.` : ''}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function BookingDetailModal({ booking, onClose, onSaveNotes }) {
  const [notes, setNotes] = useState(booking.admin_notes || '');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,35,33,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 90 }}>
      <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: '2rem', maxWidth: '520px', width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 18px 40px rgba(28,29,26,0.12)' }}>
        <h3>{booking.full_name}</h3>
        <p style={{ color: 'var(--color-palm)', fontSize: '0.92rem' }}>
          {booking.email} · {booking.phone}{booking.whatsapp_number ? ` · WA: ${booking.whatsapp_number}` : ''}
        </p>
        <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', fontSize: '0.92rem', margin: '1rem 0' }}>
          <dt style={{ color: 'var(--color-palm)' }}>Check-in</dt><dd style={{ margin: 0 }}>{formatDate(booking.check_in)}</dd>
          <dt style={{ color: 'var(--color-palm)' }}>Check-out</dt><dd style={{ margin: 0 }}>{formatDate(booking.check_out)}</dd>
          <dt style={{ color: 'var(--color-palm)' }}>Guests</dt><dd style={{ margin: 0 }}>{booking.adults} adults, {booking.children} children</dd>
          <dt style={{ color: 'var(--color-palm)' }}>Type</dt><dd style={{ margin: 0 }}>{formatBookingType(booking.booking_type)}</dd>
          <dt style={{ color: 'var(--color-palm)' }}>Airport transfer</dt><dd style={{ margin: 0 }}>{booking.airport_transfer ? 'Yes' : 'No'}</dd>
        </dl>
        {booking.message && (
          <>
            <p style={{ fontWeight: 500, marginBottom: '0.3rem' }}>Message</p>
            <p style={{ color: 'var(--color-palm)' }}>{booking.message}</p>
          </>
        )}
        <div className="form-field">
          <label htmlFor="notes">Admin notes</label>
          <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button className="icon-btn" onClick={onClose}>Close</button>
          <button className="btn btn--primary" onClick={() => onSaveNotes(notes)}>Save Notes</button>
        </div>
      </div>
    </div>
  );
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function formatDate(d) { return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); }
function formatBookingType(t) { return t.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()); }
