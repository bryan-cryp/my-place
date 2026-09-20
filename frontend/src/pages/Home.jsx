import { Link } from 'react-router-dom';
import { images } from '../config/images';
import { useVillaSettings } from '../hooks/useVillaSettings';
import WhatsAppButton from '../components/WhatsAppButton';
import SectionHeading from '../components/SectionHeading';

const amenities = [
  { title: 'Private swimming pool', copy: 'A quiet pool framed by tropical planting, open whenever you are.' },
  { title: 'Tropical gardens', copy: 'Landscaped grounds that soften the heat and screen the villa from the road.' },
  { title: 'Gated & secure', copy: 'A private, gated property with restricted access for registered guests only.' },
  { title: 'Beach access', copy: 'A short, easy walk to the sand — no resort crowds in between.' },
];

export default function Home() {
  const { settings } = useVillaSettings();

  return (
    <>
      <section className="hero">
        <img src={images.hero} alt="Ocean view from My Place villa terrace" className="hero__image" />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <p className="eyebrow" style={{ color: 'var(--color-sand)' }}>Diani Beach, Kenya</p>
          <h1>My Place</h1>
          <p className="hero__tagline">Private Beachfront Villa Living in Diani Beach, Kenya</p>
          <p className="hero__intro">
            A five-bedroom home on the Indian Ocean, built for slow mornings, long lunches,
            and days that end at the water. This is not a hotel — it's your villa in Diani.
          </p>
          <div className="hero__ctas">
            <Link to="/contact" className="btn btn--primary">Check Availability</Link>
            <Link to="/contact" className="btn btn--light">Book Your Stay</Link>
            <WhatsAppButton settings={settings} label="WhatsApp Us" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <p className="eyebrow">Welcome</p>
            <h2>A private home, not a hotel room</h2>
            <p style={{ color: 'var(--color-palm)' }}>
              My Place is a private beachfront villa designed for those who value space, serenity,
              and the natural rhythm of the Indian Ocean. Located in Diani Beach, the villa offers
              a peaceful escape surrounded by tropical gardens and ocean breezes — with a spacious
              layout and a private pool built for families, groups, honeymooners, and long-stay guests.
            </p>
            <Link to="/about" className="btn btn--outline">Read our story</Link>
          </div>
          <img src={images.villaExterior} alt="My Place villa exterior" style={{ borderRadius: 'var(--radius-md)' }} />
        </div>
      </section>

      <section className="section section--deep">
        <div className="container">
          <SectionHeading eyebrow="Why stay here" title="Space to breathe, ocean at the door" description="Everything about My Place is built around distance from the crowd and closeness to the water." />
          <div className="grid grid--4">
            {amenities.map((item) => (
              <div className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p style={{ color: 'var(--color-palm)', fontSize: '0.95rem' }}>{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <img src={images.pool} alt="Private villa pool" style={{ borderRadius: 'var(--radius-md)', order: 1 }} />
          <div style={{ order: 0 }}>
            <p className="eyebrow">The pool</p>
            <h2>A private pool, entirely your own</h2>
            <p style={{ color: 'var(--color-palm)' }}>
              No shared loungers, no queue for the water. The villa's pool sits within its own
              garden, open to guests at any hour, day or night.
            </p>
            <Link to="/villa" className="btn btn--outline">See the villa</Link>
          </div>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container">
          <SectionHeading eyebrow="Gallery" title="A look inside My Place" />
          <div className="grid grid--3">
            {[images.livingRoom, images.bedroom, images.garden].map((src) => (
              <img key={src} src={src} alt="My Place villa interior" style={{ borderRadius: 'var(--radius-md)', height: '260px', objectFit: 'cover' }} />
            ))}
          </div>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/gallery" className="btn btn--outline">View full gallery</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <p className="eyebrow">Experience Diani</p>
            <h2>Beyond the villa gates</h2>
            <p style={{ color: 'var(--color-palm)' }}>
              Diani Beach is one of East Africa's most celebrated stretches of coastline —
              known for its white sand, coral reef, kite surfing, and relaxed beach clubs.
              My Place sits close enough to enjoy it all, far enough to stay quiet.
            </p>
            <Link to="/experience-diani" className="btn btn--outline">Explore the area</Link>
          </div>
          <img src={images.diani} alt="Diani Beach coastline" style={{ borderRadius: 'var(--radius-md)' }} />
        </div>
      </section>

      <section className="section section--lagoon" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>Ready to plan your stay?</h2>
          <p style={{ maxWidth: '54ch', margin: '0 auto 1.75rem', color: 'rgba(246,241,231,0.85)' }}>
            Tell us your dates and group size — we'll confirm availability and walk you through booking.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn--primary">Check Availability</Link>
            <WhatsAppButton settings={settings} label="Chat on WhatsApp" />
          </div>
        </div>
      </section>

      <style>{`
        .hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .hero__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(10,32,32,0.82) 5%, rgba(10,32,32,0.25) 55%, rgba(10,32,32,0.15) 100%);
        }
        .hero__content {
          position: relative;
          color: var(--color-white);
          padding-bottom: 5rem;
          padding-top: 8rem;
        }
        .hero__content h1 {
          color: var(--color-white);
          margin-bottom: 0.2rem;
        }
        .hero__tagline {
          font-family: var(--font-display);
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          color: var(--color-sand);
          margin-bottom: 1.25rem;
        }
        .hero__intro { max-width: 46ch; color: rgba(246,241,231,0.9); }
        .hero__ctas { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.5rem; }
        @media (max-width: 820px) {
          .container[style] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
