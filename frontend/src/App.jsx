import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

import SiteLayout from './layouts/SiteLayout';
import Home from './pages/Home';
import About from './pages/About';
import Villa from './pages/Villa';
import Amenities from './pages/Amenities';
import Gallery from './pages/Gallery';
import ExperienceDiani from './pages/ExperienceDiani';
import Location from './pages/Location';
import Stays from './pages/Stays';
import Policies from './pages/Policies';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import Login from './admin/pages/Login';
import DashboardLayout from './admin/components/DashboardLayout';
import ProtectedRoute from './admin/components/ProtectedRoute';
import Overview from './admin/pages/Overview';
import Bookings from './admin/pages/Bookings';
import Calendar from './admin/pages/Calendar';
import Inquiries from './admin/pages/Inquiries';
import GalleryAdmin from './admin/pages/GalleryAdmin';
import SettingsAdmin from './admin/pages/SettingsAdmin';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/villa" element={<Villa />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/experience-diani" element={<ExperienceDiani />} />
          <Route path="/location" element={<Location />} />
          <Route path="/stays" element={<Stays />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={(
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          )}
        >
          <Route index element={<Overview />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

        <Route path="*" element={<SiteLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
