import { images } from '../config/images';
import SectionHeading from '../components/SectionHeading';

const activities = [
  'Swimming', 'Snorkelling', 'Kite surfing', 'Water sports',
  'Beach clubs', 'Restaurants', 'Cultural experiences', 'Nature excursions',
];

export default function ExperienceDiani() {
  return (
    <>
      <section className="section" style={{ paddingTop: 'clamp(4rem, 8vw, 6rem)' }}>
        <div className="container grid grid--2" style={{ alignItems: 'center' }}>
          <div>
            <p className="eyebrow">Experience Diani</p>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>One of East Africa's finest coastlines</h1>
            <p style={{ color: 'var(--color-palm)' }}>
              Diani Beach is known for its powder-white sand, coral reef, and relaxed pace.
              My Place sits close enough to enjoy everything the area offers, while staying
              private and quiet.
            </p>
          </div>
          <img src={images.diani} alt="Diani Beach" style={{ borderRadius: 'var(--radius-md)' }} />
        </div>
      </section>

      <section className="section section--deep">
        <div className="container">
          <SectionHeading eyebrow="Nearby activities" title="Things to do around Diani" />
          <div className="grid grid--4">
            {activities.map((activity) => (
              <div className="card" key={activity}>
                <h3 style={{ fontSize: '1.05rem' }}>{activity}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
