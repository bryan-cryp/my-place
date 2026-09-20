/**
 * Renders a WhatsApp CTA using the villa's configured number (from villa_settings
 * in the database, editable by the admin) rather than a hardcoded number.
 */
export default function WhatsAppButton({ settings, label = 'Chat on WhatsApp', message, className = '' }) {
  const number = settings?.whatsapp_number?.replace(/\D/g, '');
  if (!number) return null;

  const text = encodeURIComponent(
    message || 'Hello, I would like to enquire about staying at My Place in Diani Beach.',
  );

  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn--whatsapp ${className}`}
    >
      {label}
    </a>
  );
}
