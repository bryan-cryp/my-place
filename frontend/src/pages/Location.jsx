import { useVillaSettings } from '../hooks/useVillaSettings';
import SectionHeading from '../components/SectionHeading';
import { LoadingBlock } from '../components/StateViews';

export default function Location() {
  const { settings, loading } = useVillaSettings();

  return (
    <section className="section" style={{ paddingTop: 'clamp(4rem, 8vw, 6rem)' }}>
      <div className="container">
        <SectionHeading eyebrow="Location" title="Diani Beach, Kenya" />

        {loading ? (
          <LoadingBlock lines={2} />
        ) : (
          <p style={{ color: 'var(--color-palm)', fontSize: '1.05rem', maxWidth: '60ch' }}>
            {settings?.location_info || 'Diani Beach, Kenya — approximately 45 minutes from Ukunda Airstrip.'}
          </p>
        )}

        <div
          role="img"
          aria-label="Map placeholder — replace with a Google Maps embed of the villa's location"
          style={{
            marginTop: '2rem',
            height: '380px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-sand-deep)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-palm)',
            border: '1px dashed #cfc4a9',
          }}
        >
          Google Maps embed goes here
        </div>

        <div className="grid grid--3" style={{ marginTop: '2.5rem' }}>
          <div className="card">
            <h3>Getting here</h3>
            <p style={{ color: 'var(--color-palm)', fontSize: '0.95rem' }}>
              The villa is roughly 45 minutes from Ukunda Airstrip by road.
            </p>
          </div>
          <div className="card">
            <h3>Airport transfers</h3>
            <p style={{ color: 'var(--color-palm)', fontSize: '0.95rem' }}>
              Transfers can be arranged on request — just let us know when you book.
            </p>
          </div>
          <div className="card">
            <h3>Nearby attractions</h3>
            <p style={{ color: 'var(--color-palm)', fontSize: '0.95rem' }}>
              Beach clubs, dive centres, and restaurants are all a short drive from the villa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
