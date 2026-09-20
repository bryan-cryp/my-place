export function LoadingBlock({ lines = 3 }) {
  return (
    <div aria-busy="true" aria-live="polite">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '1.1rem', marginBottom: '0.6rem', width: `${100 - i * 12}%` }} />
      ))}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <h3 style={{ marginBottom: '0.4rem' }}>{title}</h3>
      {description && <p style={{ marginBottom: action ? '1rem' : 0 }}>{description}</p>}
      {action}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return <div className="alert alert--error" role="alert">{message}</div>;
}

export function SuccessBanner({ message }) {
  if (!message) return null;
  return <div className="alert alert--success" role="status">{message}</div>;
}
