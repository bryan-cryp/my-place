import { useEffect, useState } from 'react';
import api from '../services/api';

/**
 * Loads the villa's public-facing settings (contact info, WhatsApp number,
 * check-in/out times, policies) so the frontend never hardcodes them.
 */
export function useVillaSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get('/settings')
      .then(({ data }) => { if (active) setSettings(data.settings); })
      .catch(() => { if (active) setSettings(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { settings, loading };
}
