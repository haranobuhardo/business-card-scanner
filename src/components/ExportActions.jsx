import { downloadVCard, getWhatsAppUrl } from "../utils/vcf";

/**
 * ExportActions — VCF download + WhatsApp message buttons.
 *
 * Components:
 *   - <article class="card"> with <header>
 *   - <button> styled via .btn-vcf
 *   - <a class="button"> styled via .btn-whatsapp
 *   - <button class="outline w-100">
 *   - <hr>
 */
export default function ExportActions({ contact, onReset }) {
	const waUrl = getWhatsAppUrl(contact);
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
					{/* VCF download button */}
					<button
						id="download-vcf-button"
						className="btn-vcf"
						onClick={handleDownloadVcf}
						disabled={!hasName}
						title={hasName ? "Download VCF contact file" : "Name is required"}
					>
						Download VCF
					</button>

					{/* WhatsApp share link/button */}
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
						<button
							id="whatsapp-button"
							className="btn-whatsapp"
							disabled
							title="Phone number required"
						>
							WhatsApp
						</button>
					)}
				</div>

				{/* Divider */}
				<hr />

				{/* Outline button — scan another */}
				<button
					id="scan-another-button"
					className="outline w-100"
					onClick={onReset}
				>
					Scan Another Card
				</button>
			</article>
		</section>
	);
}
