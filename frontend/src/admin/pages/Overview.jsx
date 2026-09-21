import { useEffect, useState } from 'react';
import api, { extractErrorMessage } from '../../services/api';
import { LoadingBlock, ErrorBanner } from '../../components/StateViews';

export default function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings/overview')
      .then(({ data: res }) => setData(res))
      .catch((err) => setError(extractErrorMessage(err, 'Could not load dashboard stats.')))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Dashboard Overview</h1>
          <p className="admin-page__subtitle">Quick insights into the villa operations.</p>
        </div>
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <div className="admin-card">
          <LoadingBlock lines={3} />
        </div>
      ) : data && (
        <div className="stat-grid">
          <StatCard label="Total bookings" value={data.bookings.total} />
          <StatCard label="Pending inquiries" value={data.bookings.pending} />
          <StatCard label="Confirmed bookings" value={data.bookings.confirmed} />
          <StatCard label="Cancelled bookings" value={data.bookings.cancelled} />
          <StatCard label="Upcoming stays" value={data.bookings.upcoming} />
          <StatCard label="New contact inquiries" value={data.pendingInquiries} />
          <StatCard label="Gallery images" value={data.galleryImages} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
    </div>
  );
}
