import { Link } from 'react-router-dom';
import { images } from '../config/images';
import { useVillaSettings } from '../hooks/useVillaSettings';
import WhatsAppButton from '../components/WhatsAppButton';
import SectionHeading from '../components/SectionHeading';

const amenities = [
  { title: 'Private swimming pool', copy: 'Cool off in your own secluded pool, surrounded by lush tropical planting and complete privacy.' },
  { title: 'Tropical gardens', copy: 'Soft landscaping, shaded corners, and ocean air create a calm, restorative setting.' },
  { title: 'Gated & secure', copy: 'An exclusive, private property with controlled access for peace of mind at all times.' },
  { title: 'Beach access', copy: 'A short walk to Diani’s sandy shoreline, with the freedom to enjoy the coast without the resort rush.' },
];

const stats = [
  { value: '5', label: 'Bedrooms' },
  { value: '4', label: 'Bathrooms' },
  { value: '1', label: 'Private pool' },
  { value: '∞', label: 'Slow luxury' },
];

export default function Home() {
  const { settings } = useVillaSettings();

  return (
    <>
      <section className="hero">
        <img src={images.hero} alt="Ocean view from My Place villa terrace" className="hero__image" />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <p className="eyebrow hero__eyebrow">Private beachfront villa • Diani Beach</p>
          <h1>Luxury beach living, designed for slowing down.</h1>
          <p className="hero__tagline">Wake to ocean air, long breakfasts, and an easy rhythm that feels entirely your own.</p>
          <p className="hero__intro">
            My Place is a five-bedroom sanctuary on the Indian Ocean, curated for family escapes,
            long weekends, and unforgettable coastal stays in Kenya.
          </p>
          <div className="hero__ctas">
            <Link to="/contact" className="btn btn--primary">Check Availability</Link>
            <Link to="/contact" className="btn btn--light">Book Your Stay</Link>
            <WhatsAppButton settings={settings} label="WhatsApp Us" />
          </div>

          <div className="hero__stats">
            {stats.map((stat) => (
              <div key={stat.label} className="hero__stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-panel">
          <div className="split-panel__content">
            <p className="eyebrow">Welcome</p>
            <h2>Private, seamless, and made for barefoot luxury.</h2>
            <p>
              My Place brings together open living spaces, warm natural textures, and a tranquil beachside setting.
              It is refined without feeling formal — a home designed to feel effortless, restful, and deeply personal.
            </p>
            <Link to="/about" className="btn btn--outline">Read our story</Link>
          </div>
          <div className="split-panel__media">
            <img src={images.villaExterior} alt="My Place villa exterior" />
          </div>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container">
          <SectionHeading
            eyebrow="Why stay here"
            title="Everything you need, nothing you don’t."
            description="From sunrise swims to evening dinners under the stars, every detail is shaped for comfort, privacy, and a slower, easier way of being by the sea."
            align="center"
          />
          <div className="grid grid--4 amenities-grid">
            {amenities.map((item) => (
              <div className="card amenity-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-panel split-panel--reverse">
          <div className="split-panel__media">
            <img src={images.pool} alt="Private villa pool" />
          </div>
          <div className="split-panel__content">
            <p className="eyebrow">The pool</p>
            <h2>A private pool that turns every day into a holiday.</h2>
            <p>
              The villa’s private pool sits within a lush garden setting, creating a secluded escape for dawn swims,
              quiet reading afternoons, and sunset evenings with friends and family.
            </p>
            <Link to="/villa" className="btn btn--outline">See the villa</Link>
          </div>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container">
          <SectionHeading eyebrow="Gallery" title="A look inside My Place" align="center" />
          <div className="grid grid--3 gallery-grid">
            {[images.livingRoom, images.bedroom, images.garden].map((src) => (
              <img key={src} src={src} alt="My Place villa interior" className="gallery-image" />
            ))}
          </div>
          <div className="cta-row">
            <Link to="/gallery" className="btn btn--outline">View full gallery</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-panel">
          <div className="split-panel__content">
            <p className="eyebrow">Experience Diani</p>
            <h2>Discover the coastline beyond your doorstep.</h2>
            <p>
              Diani Beach is celebrated for its powder-soft sand, reef breaks, and laid-back beach clubs — a perfect setting for surfing,
              snorkeling, sunset dinners, and relaxed afternoons in the sun.
            </p>
            <Link to="/experience-diani" className="btn btn--outline">Explore the area</Link>
          </div>
          <div className="split-panel__media">
            <img src={images.diani} alt="Diani Beach coastline" />
          </div>
        </div>
      </section>

      <section className="section section--lagoon" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>Ready to plan your stay?</h2>
          <p className="hero__cta-copy">
            Let us know your dates and group size, and we’ll help you arrange your next Diani escape.
          </p>
          <div className="hero__ctas hero__ctas--center">
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
          background: #0a1d1e;
        }

        .hero__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.9) contrast(1.02);
        }

        .hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(8, 20, 21, 0.75) 0%, rgba(8, 20, 21, 0.54) 30%, rgba(8, 20, 21, 0.26) 100%);
        }

        .hero__content {
          position: relative;
          color: var(--color-white);
          padding-top: 7rem;
          padding-bottom: 4rem;
          z-index: 1;
        }

        .hero__content h1 {
          color: var(--color-white);
          margin-bottom: 1rem;
          max-width: 760px;
        }

        .hero__eyebrow {
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.14em;
        }

        .hero__tagline {
          font-family: var(--font-display);
          font-size: clamp(1.2rem, 2vw, 1.8rem);
          color: var(--color-sand-soft);
          max-width: 52ch;
          margin-bottom: 1.1rem;
        }

        .hero__intro {
          max-width: 52ch;
          color: rgba(255,255,255,0.8);
          font-size: 1.04rem;
        }

        .hero__ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .hero__ctas--center {
          justify-content: center;
        }

        .hero__stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
          max-width: 700px;
        }

        .hero__stat {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          padding: 1.1rem 1rem;
          backdrop-filter: blur(8px);
        }

        .hero__stat strong {
          display: block;
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-family: var(--font-display);
          color: var(--color-gold);
          margin-bottom: 0.25rem;
        }

        .hero__stat span {
          color: rgba(255,255,255,0.75);
          font-size: 0.9rem;
        }

        .split-panel {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
        }

        .split-panel--reverse {
          grid-template-columns: 1fr 1.1fr;
        }

        .split-panel__media img {
          width: 100%;
          height: 100%;
          min-height: 440px;
          object-fit: cover;
          border-radius: 30px;
          box-shadow: var(--shadow-soft);
        }

        .split-panel__content {
          max-width: 600px;
        }

        .amenities-grid .card {
          min-height: 240px;
        }

        .amenity-card h3 {
          font-size: 1.35rem;
          margin-bottom: 0.75rem;
        }

        .amenity-card p {
          color: var(--color-muted);
          margin-bottom: 0;
        }

        .gallery-grid {
          margin-top: 2rem;
        }

        .gallery-image {
          width: 100%;
          height: 320px;
          object-fit: cover;
          border-radius: 24px;
          box-shadow: var(--shadow-soft);
        }

        .cta-row {
          display: flex;
          justify-content: center;
          margin-top: 2.25rem;
        }

        .hero__cta-copy {
          max-width: 580px;
          margin: 0 auto 1.5rem;
          color: rgba(255,255,255,0.8);
        }

        @media (max-width: 820px) {
          .split-panel,
          .split-panel--reverse {
            grid-template-columns: 1fr;
          }

          .split-panel__media img {
            min-height: 320px;
          }
        }
      `}</style>
    </>
  );
}
