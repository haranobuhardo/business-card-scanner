import { downloadVCard, getWhatsAppUrl } from '../utils/vcf';

/**
 * ExportActions — VCF download + WhatsApp message buttons.
 *
 * Oat CSS components used:
 *   - <article class="card"> with <header>
 *   - <button> (native Oat button, gradient via CSS .btn-vcf)
 *   - <a class="button"> (Oat styled anchor-as-button, gradient via CSS .btn-whatsapp)
 *   - <button class="outline w-100"> (Oat outline button)
 *   - <hr> (Oat native styled)
 */
export default function ExportActions({ contact, onReset }) {
  const waUrl = getWhatsAppUrl(contact);
  const hasPhone = !!(contact.phone || contact.mobile);
  const hasName = !!contact.name;

  function handleDownloadVcf() {
    downloadVCard(contact);
  }

  return (
    <section>
      {/* Oat card with header */}
      <article className="card">
        <header>
          <h3>Export</h3>
        </header>

        <div className="export-buttons mt-4">
          {/* Oat <button> + gradient via .btn-vcf */}
          <button
            id="download-vcf-button"
            className="btn-vcf"
            onClick={handleDownloadVcf}
            disabled={!hasName}
            title={hasName ? 'Download VCF contact file' : 'Name is required'}
          >
            Download VCF
          </button>

          {/* Oat <a class="button"> + gradient via .btn-whatsapp */}
          {waUrl ? (
            <a
              id="whatsapp-button"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button btn-whatsapp"
            >
              WhatsApp
            </a>
          ) : (
              <button id="whatsapp-button" className="btn-whatsapp" disabled title="Phone number required">
              WhatsApp
            </button>
          )}
        </div>

        {/* Oat native <hr> */}
        <hr />

        {/* Oat outline button with w-full utility */}
        <button
          id="scan-another-button"
          className="outline w-full"
          onClick={onReset}
        >
          Scan Another Card
        </button>
      </article>
    </section>
  );
}
