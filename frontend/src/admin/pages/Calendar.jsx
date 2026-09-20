import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../../services/api';
import { LoadingBlock, EmptyState, ErrorBanner, SuccessBanner } from '../../components/StateViews';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [pendingDelete, setPendingDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get('/availability/calendar')
      .then(({ data }) => setEvents(data.events))
      .catch((err) => setError(extractErrorMessage(err, 'Could not load the calendar.')))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAddBlock(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.startDate || !form.endDate) {
      setError('Start and end dates are required.');
      return;
    }
    try {
      await api.post('/availability', form);
      setForm({ startDate: '', endDate: '', reason: '' });
      setSuccess('Dates blocked.');
      load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not block those dates.'));
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/availability/${pendingDelete.id}`);
      load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not remove that block. Booking-based dates can only be changed from the Bookings tab.'));
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.7rem', marginBottom: '1.5rem' }}>Calendar &amp; Availability</h1>
      <ErrorBanner message={error} />
      <SuccessBanner message={success} />

      <div className="card" style={{ marginBottom: '2rem', maxWidth: '640px' }}>
        <h3>Block dates manually</h3>
        <p style={{ color: 'var(--color-palm)', fontSize: '0.9rem' }}>
          Use this for maintenance, owner stays, or any period the villa should not be bookable.
        </p>
        <form onSubmit={handleAddBlock}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="startDate">Start date</label>
              <input id="startDate" type="date" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="form-field">
              <label htmlFor="endDate">End date</label>
              <input id="endDate" type="date" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="reason">Reason (optional)</label>
            <input id="reason" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} placeholder="e.g. Owner stay" />
          </div>
          <button type="submit" className="btn btn--primary">Add Block</button>
        </form>
      </div>

      <h3>Occupied &amp; blocked dates</h3>
      {loading && <LoadingBlock lines={4} />}
      {!loading && events.length === 0 && <EmptyState title="No blocked or booked dates" description="The calendar is fully open." />}
      {!loading && events.length > 0 && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Reason / Guest</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={`${ev.source}-${ev.id}`}>
                  <td>{formatDate(ev.start_date)}</td>
                  <td>{formatDate(ev.end_date)}</td>
                  <td>{ev.reason || '—'}</td>
                  <td>
                    <span className={`badge ${ev.source === 'booking' ? 'badge--confirmed' : 'badge--pending'}`}>
                      {ev.source === 'booking' ? 'Booking' : 'Manual block'}
                    </span>
                  </td>
                  <td>
                    {ev.source === 'blocked' ? (
                      <button className="icon-btn icon-btn--danger" onClick={() => setPendingDelete(ev)}>Remove</button>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-palm)' }}>Manage in Bookings</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remove this block?"
        description="These dates will become available for booking again."
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function formatDate(d) { return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); }
