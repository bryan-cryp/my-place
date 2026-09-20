import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';

const stayTypes = [
  { title: 'Short stays', copy: 'A few nights by the ocean — ideal for a quick escape from the city.' },
  { title: 'Long stays', copy: 'Extended stays for guests who want to settle in and slow down.' },
  { title: 'Weekend getaways', copy: 'A relaxed weekend base for couples or small groups.' },
  { title: 'Family holidays', copy: 'Space for everyone, with a private pool and secure grounds.' },
  { title: 'Group vacations', copy: 'Five bedrooms make My Place a natural fit for groups travelling together.' },
  { title: 'Long-term stays', copy: 'For guests looking to base themselves in Diani for weeks or months.' },
];

export default function Stays() {
  return (
    <section className="section" style={{ paddingTop: 'clamp(4rem, 8vw, 6rem)' }}>
      <div className="container">
        <SectionHeading eyebrow="Stays" title="A fit for every kind of trip" description="Whatever brings you to Diani, My Place can be shaped to the length and pace of your stay." />
        <div className="grid grid--3">
          {stayTypes.map((stay) => (
            <div className="card" key={stay.title}>
              <h3>{stay.title}</h3>
              <p style={{ color: 'var(--color-palm)', fontSize: '0.95rem' }}>{stay.copy}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '2.5rem' }}>
          <Link to="/contact" className="btn btn--primary">Request Availability</Link>
        </div>
      </div>
    </section>
  );
}
