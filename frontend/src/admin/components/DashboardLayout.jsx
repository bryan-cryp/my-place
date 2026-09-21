import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/calendar', label: 'Calendar' },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/settings', label: 'Villa Settings' },
];

export default function DashboardLayout() {
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <span className="admin-sidebar__brand">My Place</span>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="admin-nav__logout">
            <button
              className="icon-btn"
              onClick={handleLogout}
              style={{ width: '100%', color: '#f8f3ee', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.03)' }}
            >
              Log out
            </button>
          </div>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <button className="icon-btn admin-mobile-toggle" onClick={() => setSidebarOpen((o) => !o)}>
            Menu
          </button>
          <span className="topbar-meta">
            Signed in as {admin?.fullName || admin?.email}
          </span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
