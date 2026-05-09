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
  const re = /(?:\+?\d{1,4}[\s.-]?)?(?:\(?\d{2,5}\)?[\s.-]?)?(?:\d[\s.-]?){5,15}\d/g;
  const matches = text.match(re) || [];

  // Filter out short matches (< 7 digits) that are likely not phone numbers
  // and extract only numerical characters
  return matches
    .map((m) => m.replace(/\D/g, ''))
    .filter((m) => m.length >= 7);
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
    const originalTrimmed = line.trim();
    if (!originalTrimmed) continue;

    // Must have good alpha ratio on original line to avoid lines with many numbers/symbols
    const alphaRatio = originalTrimmed.replace(/[^a-zA-Z\s]/g, '').length / originalTrimmed.length;
    if (alphaRatio < 0.75) continue;

    // Remove garbage characters at ends
    const trimmed = originalTrimmed.replace(/^[^a-zA-Z]+/, '').replace(/[^a-zA-Z]+$/, '');
    if (trimmed.length < 5 || trimmed.length > 40) continue;

    // Skip lines that match known patterns
    const isSkip = skipPatterns.some((p) => p.test(trimmed));
    if (isSkip) continue;

    // Skip if line is a known value (company, email, etc.)
    const lowerTrimmed = trimmed.toLowerCase();
    if (knownValues.some((v) => v && lowerTrimmed.includes(v.toLowerCase()))) continue;

    const words = trimmed.split(/\s+/);
    // Ignore lines with too few or too many words
    if (words.length < 2 || words.length > 5) continue;

    // Ignore if too many single-letter words
    const singleLetterWords = words.filter(w => w.length === 1);
    if (singleLetterWords.length > 1) continue;

    // Title case check: Names usually have multiple words starting with capitals
    const titleCasedWords = words.filter(w => /^[A-Z]/.test(w));
    if (titleCasedWords.length >= 2 || (words.length === 2 && titleCasedWords.length === 1 && /^[A-Z]/.test(words[0]))) {
      // Clean trailing all-caps garbage like "LER" if the rest is properly title cased
      const properWords = words.filter(w => /^[A-Z][a-z]+$/.test(w));
      if (properWords.length >= 2 && /^[A-Z]+$/.test(words[words.length - 1])) {
          return words.slice(0, -1).join(' ');
      }
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
