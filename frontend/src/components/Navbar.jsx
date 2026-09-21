import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/villa', label: 'The Villa' },
  { to: '/amenities', label: 'Amenities' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/experience-diani', label: 'Experience Diani' },
  { to: '/location', label: 'Location' },
  { to: '/stays', label: 'Stays' },
  { to: '/policies', label: 'Policies' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          My Place
        </NavLink>

        <button
          className="navbar__toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setOpen(false)}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="navbar__cta btn btn--primary" onClick={() => setOpen(false)}>
            Check Availability
          </NavLink>
        </nav>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(28, 29, 26, 0.08);
        }

        .navbar__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          padding-bottom: 1rem;
        }

        .navbar__brand {
          font-family: var(--font-display);
          font-size: 1.45rem;
          text-decoration: none;
          color: var(--color-charcoal);
          letter-spacing: 0.02em;
        }

        .navbar__links {
          display: flex;
          align-items: center;
          gap: 1.4rem;
        }

        .navbar__links a {
          text-decoration: none;
          font-size: 0.9rem;
          color: var(--color-muted);
          transition: color 0.2s var(--ease);
        }

        .navbar__links a:hover,
        .navbar__links a.active {
          color: var(--color-sage-deep);
        }

        .navbar__cta {
          padding: 0.72rem 1.25rem;
          min-height: unset;
        }

        .navbar__toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem;
        }

        .navbar__toggle span {
          width: 22px;
          height: 2px;
          background: var(--color-charcoal);
          border-radius: 10px;
        }

        @media (max-width: 980px) {
          .navbar__toggle { display: flex; }

          .navbar__links {
            position: fixed;
            top: 68px;
            left: 0;
            right: 0;
            background: rgba(255,255,255,0.98);
            flex-direction: column;
            align-items: flex-start;
            padding: 1.5rem var(--gutter) 2rem;
            gap: 1rem;
            transform: translateY(-8px);
            opacity: 0;
            pointer-events: none;
            transition: all 0.2s var(--ease);
            border-bottom: 1px solid rgba(28,29,26,0.08);
          }

          .navbar__links.is-open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .navbar__cta { align-self: flex-start; }
        }
      `}</style>
    </header>
  );
}
