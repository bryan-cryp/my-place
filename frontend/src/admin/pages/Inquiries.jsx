import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../../services/api';
import { LoadingBlock, EmptyState, ErrorBanner } from '../../components/StateViews';
import ConfirmDialog from '../components/ConfirmDialog';

const statuses = ['new', 'read', 'contacted'];

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get('/inquiries', { params: { status: status || undefined, pageSize: 100 } })
      .then(({ data }) => setInquiries(data.inquiries))
      .catch((err) => setError(extractErrorMessage(err, 'Could not load inquiries.')))
      .finally(() => setLoading(false));
  }

  useEffect(load, [status]);

  async function updateStatus(id, newStatus) {
    try {
      const { data } = await api.put(`/inquiries/${id}`, { status: newStatus });
      setInquiries((prev) => prev.map((i) => (i.id === id ? data.inquiry : i)));
      if (selected?.id === id) setSelected(data.inquiry);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not update inquiry.'));
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/inquiries/${pendingDelete.id}`);
      setInquiries((prev) => prev.filter((i) => i.id !== pendingDelete.id));
      setSelected(null);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not delete inquiry.'));
    } finally {
      setPendingDelete(null);
    }
  }

  function openInquiry(inquiry) {
    setSelected(inquiry);
    if (inquiry.status === 'new') updateStatus(inquiry.id, 'read');
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.7rem', marginBottom: '1.5rem' }}>Inquiries</h1>
      <ErrorBanner message={error} />

      <div className="toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '0.55rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #cfc4a9' }}>
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{capitalize(s)}</option>)}
        </select>
      </div>

      {loading && <LoadingBlock lines={5} />}
      {!loading && inquiries.length === 0 && <EmptyState title="No inquiries" description="General contact messages will show up here." />}

      {!loading && inquiries.length > 0 && (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Subject</th><th>Received</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {inquiries.map((i) => (
                <tr key={i.id}>
                  <td><strong>{i.full_name}</strong><br /><span style={{ fontSize: '0.85rem', color: 'var(--color-palm)' }}>{i.email}</span></td>
                  <td>{i.subject || '—'}</td>
                  <td>{formatDate(i.created_at)}</td>
                  <td><span className={`badge badge--${i.status}`}>{capitalize(i.status)}</span></td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="icon-btn" onClick={() => openInquiry(i)}>View</button>
                    <button className="icon-btn icon-btn--danger" onClick={() => setPendingDelete(i)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,35,33,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 90 }}>
          <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: '2rem', maxWidth: '480px', width: '100%' }}>
            <h3>{selected.full_name}</h3>
            <p style={{ color: 'var(--color-palm)', fontSize: '0.92rem' }}>{selected.email}{selected.phone ? ` · ${selected.phone}` : ''}</p>
            {selected.subject && <p style={{ fontWeight: 500 }}>{selected.subject}</p>}
            <p style={{ color: 'var(--color-palm)' }}>{selected.message}</p>
            <div className="form-field">
              <label htmlFor="inqStatus">Status</label>
              <select id="inqStatus" value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)}>
                {statuses.map((s) => <option key={s} value={s}>{capitalize(s)}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="icon-btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this inquiry?"
        description={pendingDelete ? `This will permanently remove the message from ${pendingDelete.full_name}.` : ''}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function formatDate(d) { return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); }
