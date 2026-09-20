import { images } from '../config/images';
import SectionHeading from '../components/SectionHeading';
import { Link } from 'react-router-dom';

const rooms = [
  { title: '5 bedrooms', copy: 'Generously sized rooms with natural light and ocean-facing breezes.' },
  { title: 'Living room', copy: 'A spacious, open living area designed for gathering and unwinding.' },
  { title: 'Dining area', copy: 'A relaxed indoor-outdoor dining space for long meals with family or friends.' },
  { title: 'Fully equipped kitchen', copy: 'Everything needed for guests who want to cook, host, or self-cater.' },
  { title: 'Swimming pool access', copy: 'Direct access to the villa\u2019s private pool from the main living areas.' },
  { title: 'Indoor/outdoor relaxation', copy: 'Shaded terraces and lounging spots that blur the line between inside and out.' },
];

export default function Villa() {
  return (
    <>
      <section className="section" style={{ paddingTop: 'clamp(4rem, 8vw, 6rem)' }}>
        <div className="container">
          <SectionHeading eyebrow="The Villa" title="A spacious layout, built for togetherness" description="Five bedrooms, generous living space, and a private pool — all designed around natural light and ocean breezes." />
          <div className="grid grid--3">
            {rooms.map((room) => (
              <div className="card" key={room.title}>
                <h3>{room.title}</h3>
                <p style={{ color: 'var(--color-palm)', fontSize: '0.95rem' }}>{room.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--deep">
        <div className="container grid grid--2" style={{ alignItems: 'center' }}>
          <img src={images.dining} alt="Villa dining area" style={{ borderRadius: 'var(--radius-md)' }} />
          <img src={images.bedroom} alt="Villa bedroom" style={{ borderRadius: 'var(--radius-md)' }} />
        </div>
      </section>

      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>See the whole villa</h2>
          <p style={{ maxWidth: '50ch', margin: '0 auto 1.5rem', color: 'var(--color-palm)' }}>
            Browse the full photo gallery, organised by room and space.
          </p>
          <Link to="/gallery" className="btn btn--primary">View Gallery</Link>
        </div>
      </section>
    </>
  );
}
