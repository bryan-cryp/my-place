import { useVillaSettings } from '../hooks/useVillaSettings';
import SectionHeading from '../components/SectionHeading';
import { LoadingBlock } from '../components/StateViews';

const defaultPolicies = {
  booking: [
    'Reservations are confirmed upon deposit payment.',
    'Balance is due before arrival or at check-in, as agreed.',
  ],
  cancellation: [
    'Free cancellation up to 14 days before arrival.',
    '50% charge for cancellations 7–13 days before arrival.',
    'No refund within 7 days of arrival or for no-shows.',
  ],
  houseRules: [
    'No parties or loud gatherings.',
    'Quiet hours: 10:00 PM – 8:00 AM.',
    'Only registered guests are allowed on the property.',
    'No smoking inside the villa.',
    'Children must be supervised at all times.',
  ],
  poolSafety: [
    'Pool use is at guests\u2019 own risk.',
    'There is no lifeguard on duty.',
    'Children must be supervised near the pool.',
  ],
  damages: [
    'Guests are responsible for any damage caused during their stay.',
    'A security deposit may be required.',
  ],
  liability:
    'Management is not responsible for loss of belongings, injuries, or weather-related disruptions. Guests are encouraged to have travel insurance.',
};

function PolicyGroup({ title, items }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-palm)', fontSize: '0.95rem' }}>
        {items.map((item) => <li key={item} style={{ marginBottom: '0.4rem' }}>{item}</li>)}
      </ul>
    </div>
  );
}

export default function Policies() {
  const { settings, loading } = useVillaSettings();
  const policies = (settings?.policies && Object.keys(settings.policies).length ? settings.policies : defaultPolicies);

  return (
    <section className="section" style={{ paddingTop: 'clamp(4rem, 8vw, 6rem)' }}>
      <div className="container">
        <SectionHeading eyebrow="Policies" title="Policies &amp; House Rules" description="Please read these before booking — they apply to every stay at My Place." />

        <div className="grid grid--3" style={{ marginBottom: '1rem' }}>
          <div className="card">
            <h3>Check-in</h3>
            <p style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', margin: 0 }}>
              {loading ? '—' : settings?.check_in_time || '2:00 PM'}
            </p>
          </div>
          <div className="card">
            <h3>Check-out</h3>
            <p style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', margin: 0 }}>
              {loading ? '—' : settings?.check_out_time || '10:00 AM'}
            </p>
          </div>
        </div>

        {loading ? <LoadingBlock lines={4} /> : (
          <div className="grid grid--3" style={{ marginTop: '2rem' }}>
            <PolicyGroup title="Booking &amp; Payment" items={policies.booking || defaultPolicies.booking} />
            <PolicyGroup title="Cancellation" items={policies.cancellation || defaultPolicies.cancellation} />
            <PolicyGroup title="House Rules" items={policies.houseRules || defaultPolicies.houseRules} />
            <PolicyGroup title="Pool Safety" items={policies.poolSafety || defaultPolicies.poolSafety} />
            <PolicyGroup title="Damages" items={policies.damages || defaultPolicies.damages} />
            <div className="card">
              <h3>Liability</h3>
              <p style={{ color: 'var(--color-palm)', fontSize: '0.95rem' }}>
                {policies.liability || defaultPolicies.liability}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
