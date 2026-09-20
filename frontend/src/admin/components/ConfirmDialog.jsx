export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, confirmLabel = 'Delete' }) {
  if (!open) return null;
  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-label={title}>
      <div style={dialogStyle}>
        <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: 'var(--color-palm)' }}>{description}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="icon-btn" onClick={onCancel}>Cancel</button>
          <button className="icon-btn icon-btn--danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15,35,33,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: '1.5rem',
};

const dialogStyle = {
  background: 'var(--color-white)',
  borderRadius: 'var(--radius-md)',
  padding: '1.75rem',
  maxWidth: '420px',
  width: '100%',
};
