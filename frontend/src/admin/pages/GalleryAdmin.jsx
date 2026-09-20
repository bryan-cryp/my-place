import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../../services/api';
import { LoadingBlock, EmptyState, ErrorBanner, SuccessBanner } from '../../components/StateViews';
import ConfirmDialog from '../components/ConfirmDialog';

const categories = ['villa', 'bedrooms', 'pool', 'gardens', 'beach', 'living areas', 'outdoor spaces', 'diani'];
const emptyForm = { title: '', category: categories[0], imageUrl: '', displayOrder: 0 };

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  function load() {
    setLoading(true);
    api.get('/gallery')
      .then(({ data }) => setImages(data.images))
      .catch((err) => setError(extractErrorMessage(err, 'Could not load gallery images.')))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await api.put(`/gallery/${editingId}`, form);
        setSuccess('Image updated.');
      } else {
        await api.post('/gallery', form);
        setSuccess('Image added.');
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save the image.'));
    }
  }

  function startEdit(img) {
    setEditingId(img.id);
    setForm({ title: img.title, category: img.category, imageUrl: img.image_url, displayOrder: img.display_order });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function confirmDelete() {
    try {
      await api.delete(`/gallery/${pendingDelete.id}`);
      setImages((prev) => prev.filter((i) => i.id !== pendingDelete.id));
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not delete image.'));
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.7rem', marginBottom: '1.5rem' }}>Gallery Management</h1>
      <ErrorBanner message={error} />
      <SuccessBanner message={success} />

      <div className="card" style={{ marginBottom: '2rem', maxWidth: '640px' }}>
        <h3>{editingId ? 'Edit image' : 'Add a new image'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select id="category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="displayOrder">Display order</label>
              <input id="displayOrder" type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="imageUrl">Image URL</label>
            <input id="imageUrl" type="url" placeholder="https://…" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} required />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn--primary">{editingId ? 'Save Changes' : 'Add Image'}</button>
            {editingId && <button type="button" className="icon-btn" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      {loading && <LoadingBlock lines={4} />}
      {!loading && images.length === 0 && <EmptyState title="No images yet" description="Add your first villa photo above." />}

      {!loading && images.length > 0 && (
        <div className="grid grid--3">
          {images.map((img) => (
            <div className="card" key={img.id}>
              <img src={img.image_url} alt={img.title} style={{ height: '160px', width: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1rem' }}>{img.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-palm)', marginBottom: '0.75rem' }}>{img.category} · order {img.display_order}</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="icon-btn" onClick={() => startEdit(img)}>Edit</button>
                <button className="icon-btn icon-btn--danger" onClick={() => setPendingDelete(img)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this image?"
        description={pendingDelete ? `"${pendingDelete.title}" will be removed from the gallery.` : ''}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
