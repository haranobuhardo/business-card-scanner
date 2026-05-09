/**
 * VCard 3.0 generation and download utility.
 */

/**
 * Generate a VCard 3.0 string from contact data.
 * @param {object} contact - { name, email, phone, mobile, company, website }
 * @returns {string} VCard formatted string
 */
export function generateVCard(contact) {
  const { name, email, phone, mobile, company, website } = contact;

  // Split name into first/last for structured name field
  const nameParts = (name || '').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name || 'Unknown'}`,
    `N:${lastName};${firstName};;;`,
  ];

  if (company) lines.push(`ORG:${company}`);
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${email}`);
  if (phone) lines.push(`TEL;TYPE=WORK,VOICE:${phone}`);
  if (mobile && mobile !== phone) lines.push(`TEL;TYPE=CELL:${mobile}`);
  if (website) {
    const url = website.startsWith('http') ? website : `https://${website}`;
    lines.push(`URL:${url}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Download a VCard as .vcf file.
 * @param {object} contact - Contact data
 */
export function downloadVCard(contact) {
  const vcardStr = generateVCard(contact);
  const blob = new Blob([vcardStr], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${(contact.name || 'contact').replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate WhatsApp message URL.
 * @param {object} contact - { name, phone }
 * @param {string} template - Message template with {name} placeholder
 * @returns {string|null} wa.me URL or null if no phone
 */
export function getWhatsAppUrl(contact, template = 'Hello {name}!') {
  const phone = contact.mobile || contact.phone;
  if (!phone) return null;
  
  // Strip non-digit chars for wa.me (keep leading +)
  const cleanPhone = phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
  const message = template.replace(/\{name\}/g, contact.name || 'there');
  const encoded = encodeURIComponent(message);
  
  console.log(cleanPhone)
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
