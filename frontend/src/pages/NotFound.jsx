import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center', paddingTop: 'clamp(5rem, 10vw, 8rem)' }}>
      <div className="container">
        <h1>Page not found</h1>
        <p style={{ color: 'var(--color-palm)', margin: '0 auto 1.5rem' }}>
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/" className="btn btn--primary">Back to Home</Link>
      </div>
    </section>
  );
}
