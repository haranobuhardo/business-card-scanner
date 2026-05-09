/**
 * ResultForm — editable form showing parsed contact fields + raw OCR text.
 */
export default function ResultForm({ contact, onChange }) {
  function handleChange(field, value) {
    onChange({ ...contact, [field]: value });
  }

  return (
    <section className="result-section">
      <div className="card result-card">
        <h2>✏️ Extracted Contact</h2>
        <p className="result-subtitle">Review and edit the parsed fields</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <label htmlFor="field-name">Name</label>
            <input
              id="field-name"
              type="text"
              placeholder="Full Name"
              value={contact.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />

            <label htmlFor="field-company">Company</label>
            <input
              id="field-company"
              type="text"
              placeholder="Company Name"
              value={contact.company}
              onChange={(e) => handleChange('company', e.target.value)}
            />

            <label htmlFor="field-email">Email</label>
            <input
              id="field-email"
              type="email"
              placeholder="email@example.com"
              value={contact.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />

            <label htmlFor="field-phone">Phone</label>
            <input
              id="field-phone"
              type="tel"
              placeholder="+62 812 3456 7890"
              value={contact.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />

            <label htmlFor="field-mobile">Mobile</label>
            <input
              id="field-mobile"
              type="tel"
              placeholder="+62 812 3456 7890"
              value={contact.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
            />

            <label htmlFor="field-website">Website</label>
            <input
              id="field-website"
              type="url"
              placeholder="www.example.com"
              value={contact.website}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </fieldset>
        </form>

        <details className="raw-text-details">
          <summary>🔤 Raw OCR Text</summary>
          <textarea
            id="raw-ocr-text"
            readOnly
            value={contact.rawText}
            rows={6}
          />
        </details>
      </div>
    </section>
  );
}
