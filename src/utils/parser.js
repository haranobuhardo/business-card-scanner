/**
 * Contact field extraction from OCR text using regex + heuristics.
 * Replaces the outdated Javascript-BCR-Library with a modern approach.
 */

/**
 * Extract email addresses from text.
 */
function extractEmails(text) {
  const re = /[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/g;
  return text.match(re) || [];
}

/**
 * Extract phone numbers from text.
 * Handles international formats: +62 812 ..., (021) 555-1234, etc.
 */
function extractPhones(text) {
  const re = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/g;
  const matches = text.match(re) || [];

  // Filter out short matches (< 7 digits) that are likely not phone numbers
  return matches
    .map((m) => m.trim())
    .filter((m) => m.replace(/\D/g, '').length >= 7);
}

/**
 * Extract URLs/websites from text.
 */
function extractUrls(text) {
  const re = /(?:https?:\/\/)?(?:www\.)?[\w.-]+\.[a-zA-Z]{2,}(?:\/[\w./-]*)?/gi;
  const matches = text.match(re) || [];

  // Filter out emails that might match as URLs
  return matches.filter(
    (m) => !m.includes('@') && m.includes('.')
  );
}

/**
 * Extract company name from text lines.
 * Looks for common company suffixes.
 */
function extractCompany(lines, emailDomain) {
  const suffixes =
    /\b(inc|corp|ltd|llc|gmbh|co|company|group|solutions|technologies|tech|consulting|services|agency|studio|labs|enterprises|foundation|associates|partners|pte|pvt|llp|s\.?a\.?|s\.?r\.?l\.?|cv|pt|tbk)\b/i;

  for (const line of lines) {
    if (suffixes.test(line)) {
      return line.trim();
    }
  }

  // Fallback: try to derive from email domain
  if (emailDomain) {
    const parts = emailDomain.split('.');
    if (parts.length >= 2 && !['gmail', 'yahoo', 'hotmail', 'outlook', 'icloud', 'proton', 'protonmail'].includes(parts[0].toLowerCase())) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
  }

  return '';
}

/**
 * Extract name from text lines using heuristics.
 * Name is typically the first line that isn't an email, phone, URL, or company.
 */
function extractName(lines, knownValues) {
  const skipPatterns = [
    /[\w.+-]+@[\w.-]+/,           // email
    /(?:\+?\d[\d\s.-]{6,})/,     // phone
    /(?:https?:\/\/|www\.)/i,     // url
    /\b(?:tel|fax|phone|mobile|email|web|address|p\.?o\.?\s*box)\b/i, // labels
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 2 || trimmed.length > 60) continue;

    // Skip lines that match known patterns
    const isSkip = skipPatterns.some((p) => p.test(trimmed));
    if (isSkip) continue;

    // Skip if line is a known value (company, email, etc.)
    const lowerTrimmed = trimmed.toLowerCase();
    if (knownValues.some((v) => v && lowerTrimmed.includes(v.toLowerCase()))) continue;

    // Name lines usually have 2-4 words, mostly alphabetic
    const words = trimmed.split(/\s+/);
    const alphaRatio = trimmed.replace(/[^a-zA-Z\s]/g, '').length / trimmed.length;
    if (words.length >= 1 && words.length <= 5 && alphaRatio > 0.7) {
      return trimmed;
    }
  }

  return '';
}

/**
 * Parse OCR text into structured contact fields.
 * @param {string} rawText - Raw OCR output
 * @returns {object} Parsed contact info
 */
export function parseContactText(rawText) {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const emails = extractEmails(rawText);
  const phones = extractPhones(rawText);
  const urls = extractUrls(rawText);

  const email = emails[0] || '';
  const emailDomain = email ? email.split('@')[1] : '';
  const company = extractCompany(lines, emailDomain);

  // Remove company and URLs from known values so name extraction can skip them
  const knownValues = [company, email, ...urls];
  const name = extractName(lines, knownValues);

  return {
    name,
    email,
    phone: phones[0] || '',
    mobile: phones[1] || phones[0] || '',
    company,
    website: urls[0] || '',
    rawText,
  };
}
