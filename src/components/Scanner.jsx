import { useState, useRef } from 'react';

/**
 * Scanner component — handles image capture/upload and triggers OCR.
 *
 * Oat CSS components used:
 *   - <article class="card"> with <header> for card layout
 *   - Native <progress> (Oat styles it via progress.css)
 *   - <button class="large"> for scan action (gradient added via CSS)
 *   - <button class="icon small"> for reset overlay
 *
 * Custom (no Oat equivalent):
 *   - Upload drop zone (.upload-label / .upload-area)
 *   - Image preview (.preview-container)
 */
export default function Scanner({ onScanComplete, isScanning, progress }) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleScan() {
    if (selectedFile && onScanComplete) {
      onScanComplete(selectedFile);
    }
  }

  function handleReset() {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const progressPct = progress
    ? Math.round((progress.progress || 0) * 100)
    : 0;

  return (
    <section>
      {/* Oat card: <article class="card"> with <header> */}
      <article className="card">
        <header>
          <h3>Scan Business Card</h3>
          <p>Take a photo or upload an image of a business card</p>
        </header>

        {/* Upload area — custom (no Oat equivalent) */}
        <div className="upload-area">
          <input
            ref={fileInputRef}
            type="file"
            id="card-image-input"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            disabled={isScanning}
          />

          {!preview && (
            <label htmlFor="card-image-input" className="upload-label">
              <span className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </span>
              <span>Choose image or take photo</span>
            </label>
          )}
        </div>

        {/* Image preview — custom */}
        {preview && (
          <div className="preview-container">
            <img
              src={preview}
              alt="Business card preview"
              className="card-preview"
            />
            {!isScanning && (
              <button
                type="button"
                className="icon small btn-reset"
                onClick={handleReset}
                title="Remove image"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Progress — Oat native <progress> + gradient override */}
        {isScanning && (
          <div className="progress-section">
            <progress
              value={progressPct}
              max="100"
              id="scan-progress"
            ></progress>
            <div className="hstack justify-between mt-2">
              <small className="text-light">{progress?.status || 'Initializing OCR…'}</small>
              <small className="text-light">{progressPct}%</small>
            </div>
          </div>
        )}

        {/* Scan button — Oat <button class="large"> + gradient via CSS */}
        <div className="scan-actions">
          <button
            id="scan-button"
            className="large"
            onClick={handleScan}
            disabled={!selectedFile || isScanning}
          >
            {isScanning ? 'Scanning…' : 'Scan Card'}
          </button>
        </div>
      </article>
    </section>
  );
}
