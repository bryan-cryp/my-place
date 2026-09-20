import SectionHeading from '../components/SectionHeading';

const amenities = [
  'Private swimming pool',
  'Tropical landscaped gardens',
  'Secure gated property',
  'Outdoor lounging areas',
  'Outdoor dining space',
  'Housekeeping',
  'Easy beach access',
  'Airport transfers on request',
];

export default function Amenities() {
  return (
    <section className="section" style={{ paddingTop: 'clamp(4rem, 8vw, 6rem)' }}>
      <div className="container">
        <SectionHeading eyebrow="Amenities" title="Everything the villa offers" description="A short list of what comes standard with every stay at My Place." />
        <div className="grid grid--4">
          {amenities.map((item) => (
            <div className="card" key={item} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <span aria-hidden="true" style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-coral)' }} />
              <h3 style={{ fontSize: '1.05rem' }}>{item}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
