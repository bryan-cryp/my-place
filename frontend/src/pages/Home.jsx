import { Link } from 'react-router-dom';
import { images } from '../config/images';
import { useVillaSettings } from '../hooks/useVillaSettings';
import WhatsAppButton from '../components/WhatsAppButton';
import SectionHeading from '../components/SectionHeading';

const amenities = [
  { title: 'Private swimming pool', copy: 'Cool off in your own secluded pool, framed by tropical planting and complete privacy.' },
  { title: 'Tropical gardens', copy: 'Soft landscaping and shaded corners create an easy, restful atmosphere from morning to dusk.' },
  { title: 'Gated & secure', copy: 'A calm, exclusive setting that feels private and sheltered throughout your stay.' },
  { title: 'Beach access', copy: 'A short walk to Diani’s soft shoreline, with the coast close by and the villa still tranquil.' },
];

const stats = [
  { value: '5', label: 'Bedrooms' },
  { value: '4', label: 'Bathrooms' },
  { value: '1', label: 'Private pool' },
  { value: '∞', label: 'Slow mornings' },
];

export default function Home() {
  const { settings } = useVillaSettings();

  return (
    <>
      <section className="hero">
        <img src={images.hero} alt="Ocean view from My Place villa terrace" className="hero__image" />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <p className="eyebrow hero__eyebrow">Diani Beach, Kenya</p>
          <h1>Simple luxury by the sea.</h1>
          <p className="hero__tagline">A private beachfront villa designed for easy, beautiful days.</p>
          <p className="hero__intro">
            My Place is a five-bedroom home on the Indian Ocean, created for family stays,
            quiet escapes, and long afternoons that feel both restful and unforgettable.
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
            <h2>A private home, not a hotel room.</h2>
            <p>
              Thoughtfully designed for comfort and calm, My Place blends natural textures,
              open living spaces, and easy coastal living into a warm, welcoming beach retreat.
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
            title="Comfort that feels effortless."
            description="From sunrise swims to sunset dinners, every detail is arranged to make your time by the ocean feel quiet, natural, and unhurried."
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
            <h2>Everything you want, within reach.</h2>
            <p>
              The villa’s private pool sits in a secluded garden setting, offering a place to cool off,
              stretch out, and enjoy the coastal air without ever leaving the property.
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
            <h2>The coast is close, but the quiet remains.</h2>
            <p>
              Diani Beach offers white sand, blue water, reef breaks, sunsets, and a laid-back rhythm that matches the villa perfectly.
              You’re close to everything, but never in the middle of it.
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
            Tell us your dates and group size, and we’ll help you arrange your next Diani escape.
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
          min-height: 90vh;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          background: #d9d3c9;
        }

        .hero__image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.8) contrast(1.02);
        }

        .hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(16, 18, 15, 0.66) 0%, rgba(16, 18, 15, 0.42) 35%, rgba(16,18,15,0.2) 100%);
        }

        .hero__content {
          position: relative;
          color: var(--color-white);
          padding-top: 7rem;
          padding-bottom: 3.5rem;
          z-index: 1;
        }

        .hero__content h1 {
          color: var(--color-white);
          margin-bottom: 0.8rem;
          max-width: 650px;
        }

        .hero__eyebrow {
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.12em;
        }

        .hero__tagline {
          font-family: var(--font-display);
          font-size: clamp(1.16rem, 2vw, 1.75rem);
          color: #f8f1e8;
          max-width: 48ch;
          margin-bottom: 1rem;
        }

        .hero__intro {
          max-width: 52ch;
          color: rgba(255,255,255,0.82);
          font-size: 1.02rem;
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
          max-width: 620px;
        }

        .hero__stat {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 1rem 0.8rem;
        }

        .hero__stat strong {
          display: block;
          font-size: clamp(1.5rem, 2.8vw, 2rem);
          font-family: var(--font-display);
          color: #f3e8d6;
          margin-bottom: 0.2rem;
        }

        .hero__stat span {
          color: rgba(255,255,255,0.75);
          font-size: 0.85rem;
        }

        .split-panel {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
        }

        .split-panel--reverse {
          grid-template-columns: 1fr 1.05fr;
        }

        .split-panel__media img {
          width: 100%;
          height: 100%;
          min-height: 420px;
          object-fit: cover;
          border-radius: 30px;
          box-shadow: var(--shadow-soft);
        }

        .split-panel__content {
          max-width: 600px;
        }

        .amenities-grid .card {
          min-height: 230px;
        }

        .amenity-card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.7rem;
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
          border-radius: 22px;
          box-shadow: var(--shadow-soft);
        }

        .cta-row {
          display: flex;
          justify-content: center;
          margin-top: 2.25rem;
        }

        .hero__cta-copy {
          max-width: 560px;
          margin: 0 auto 1.5rem;
          color: rgba(28, 29, 26, 0.74);
        }

        @media (max-width: 820px) {
          .split-panel,
          .split-panel--reverse {
            grid-template-columns: 1fr;
          }

          .split-panel__media img {
            min-height: 310px;
          }
        }
      `}</style>
    </>
  );
}
