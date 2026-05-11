/**
 * ResultForm — editable form showing parsed contact fields + raw OCR text.
 *
 * Oat CSS components used:
 *   - <article class="card"> with <header>
 *   - <label data-field> wrapping label text + <input> (Oat form pattern)
 *   - <details> / <summary> (Oat accordion pattern)
 *   - <textarea> inside details (Oat native + custom glass override)
 */
export default function ResultForm({ contact, onChange }) {
	function handleChange(field, value) {
		onChange({ ...contact, [field]: value });
	}

	return (
		<section className="result-section">
			{/* Oat card with header */}
			<article className="card">
				<header>
					<h3>Extracted Contact</h3>
					<p>Review and edit the parsed fields</p>
				</header>

				{/* Oat form: <label data-field> wraps label text + input */}
				<form onSubmit={(e) => e.preventDefault()} className="mt-4">
					<label data-field>
						Name
						<input
							id="field-name"
							type="text"
							placeholder="Full Name"
							value={contact.name}
							onChange={(e) => handleChange("name", e.target.value)}
						/>
					</label>

					<label data-field>
						Company
						<input
							id="field-company"
							type="text"
							placeholder="Company Name"
							value={contact.company}
							onChange={(e) => handleChange("company", e.target.value)}
						/>
					</label>

					<label data-field>
						Email
						<input
							id="field-email"
							type="email"
							placeholder="email@example.com"
							value={contact.email}
							onChange={(e) => handleChange("email", e.target.value)}
						/>
					</label>

					<label data-field>
						Mobile
						<input
							id="field-mobile"
							type="tel"
							placeholder="+62 812 3456 7890"
							value={contact.mobile}
							onChange={(e) => handleChange("mobile", e.target.value)}
						/>
					</label>

					<label data-field>
						Website
						<input
							id="field-website"
							type="url"
							placeholder="www.example.com"
							value={contact.website}
							onChange={(e) => handleChange("website", e.target.value)}
						/>
					</label>
				</form>

				{/* Oat native <details>/<summary> accordion */}
				<details className="raw-text-details mt-4">
					<summary>Raw OCR Text</summary>
					<textarea
						id="raw-ocr-text"
						readOnly
						value={contact.rawText}
						rows={6}
					/>
				</details>
			</article>
		</section>
	);
}
