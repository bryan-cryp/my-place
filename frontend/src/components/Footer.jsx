import { Link } from 'react-router-dom';
import { useVillaSettings } from '../hooks/useVillaSettings';
import WhatsAppButton from './WhatsAppButton';

export default function Footer() {
  const { settings } = useVillaSettings();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <p className="footer__brand">My Place</p>
          <p className="footer__tagline">Private beachfront villa living in Diani Beach, Kenya.</p>
          <WhatsAppButton settings={settings} label="Chat on WhatsApp" />
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/villa">The Villa</Link></li>
            <li><Link to="/amenities">Amenities</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/experience-diani">Experience Diani</Link></li>
          </ul>
        </div>

        <div>
          <h4>Plan Your Stay</h4>
          <ul>
            <li><Link to="/stays">Stays</Link></li>
            <li><Link to="/policies">Policies &amp; House Rules</Link></li>
            <li><Link to="/contact">Booking &amp; Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            {settings?.contact_email && <li>{settings.contact_email}</li>}
            {settings?.contact_phone && <li>{settings.contact_phone}</li>}
            <li>Diani Beach, Kenya</li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} My Place, Diani Beach.</span>
        <Link to="/admin/login">Admin</Link>
      </div>

      <style>{`
        .footer {
          background: linear-gradient(180deg, #091719 0%, #0d1e21 100%);
          color: rgba(255,255,255,0.8);
          padding: 3.5rem 0 1.5rem;
        }

        .footer h4 {
          color: var(--color-white);
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 700;
          margin-bottom: 1rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .footer__brand {
          font-family: var(--font-display);
          font-size: 1.8rem;
          color: var(--color-white);
          margin: 0 0 0.3rem;
        }

        .footer__tagline {
          max-width: 30ch;
          margin-bottom: 1.3rem;
          font-size: 0.94rem;
          color: rgba(255,255,255,0.7);
        }

        .footer__grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 2rem;
        }

        .footer ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          font-size: 0.92rem;
        }

        .footer a {
          text-decoration: none;
          color: inherit;
        }

        .footer a:hover {
          color: var(--color-gold);
        }

        .footer__bottom {
          margin-top: 2.5rem;
          padding-top: 1.4rem;
          border-top: 1px solid rgba(255,255,255,0.12);
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.6);
        }

        @media (max-width: 760px) {
          .footer__grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </footer>
  );
}
