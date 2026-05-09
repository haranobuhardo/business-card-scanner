import { downloadVCard, getWhatsAppUrl } from '../utils/vcf';

/**
 * ExportActions — VCF download + WhatsApp message buttons.
 */
export default function ExportActions({ contact, onReset }) {
  const waUrl = getWhatsAppUrl(contact);
  const hasPhone = !!(contact.phone || contact.mobile);
  const hasName = !!contact.name;

  function handleDownloadVcf() {
    downloadVCard(contact);
  }

  return (
    <section className="export-section">
      <div className="card export-card">
        <h2>Export</h2>

        <div className="export-buttons">
          <button
            id="download-vcf-button"
            onClick={handleDownloadVcf}
            disabled={!hasName}
            title={hasName ? 'Download VCF contact file' : 'Name is required'}
          >
            Download VCF
          </button>

          {waUrl ? (
            <a
              id="whatsapp-button"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              WhatsApp
            </a>
          ) : (
            <button id="whatsapp-button" disabled title="Phone number required">
              WhatsApp
            </button>
          )}
        </div>

        <hr />

        <button
          id="scan-another-button"
          className="btn-secondary"
          onClick={onReset}
        >
          Scan Another Card
        </button>
      </div>
    </section>
  );
}
