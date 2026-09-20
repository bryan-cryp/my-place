import { images } from '../config/images';

export default function About() {
  return (
    <>
      <section className="section" style={{ paddingTop: 'clamp(4rem, 8vw, 6rem)' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <p className="eyebrow">About My Place</p>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Your private beachfront home in Diani</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-palm)' }}>
            Welcome to My Place, a private beachfront villa designed for those who value space,
            serenity, and the natural rhythm of the Indian Ocean.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-palm)' }}>
            Located in Diani Beach, Kenya, this exclusive five-bedroom villa offers a peaceful
            escape surrounded by tropical gardens and ocean breezes.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-palm)' }}>
            Featuring a spacious layout, a private swimming pool, and elegant indoor and outdoor
            living areas, My Place is crafted for families, groups, honeymooners, and long-stay
            guests seeking a premium coastal experience.
          </p>
          <p style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--color-lagoon-dark)', marginTop: '2rem' }}>
            This is not a hotel.<br />This is your private beachfront home in Diani.
          </p>
        </div>
      </section>
      <img src={images.livingRoom} alt="My Place living area" style={{ width: '100%', maxHeight: '520px', objectFit: 'cover' }} />
    </>
  );
}
