export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div
      style={{
        textAlign: align,
        maxWidth: align === 'center' ? '760px' : '100%',
        margin: align === 'center' ? '0 auto 2.5rem' : '0 0 2.5rem',
      }}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && (
        <p style={{ color: 'var(--color-muted)', maxWidth: align === 'center' ? 'none' : '55ch' }}>
          {description}
        </p>
      )}
    </div>
  );
}
