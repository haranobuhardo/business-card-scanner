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
export default function Scanner({ 
  onScanComplete, 
  isScanning, 
  progress,
  extractionMethod,
  setExtractionMethod,
  apiKey,
  setApiKey
}) {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }));
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          }, 'image/jpeg', 0.95);
        };
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('FileReader failed'));
      reader.readAsDataURL(file);
    });
  };

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleScan() {
    if (!selectedFile || !onScanComplete) return;
    
    setIsCompressing(true);
    let finalFile = selectedFile;
    try {
      finalFile = await compressImage(selectedFile);
    } catch (err) {
      console.error('Compression failed', err);
    } finally {
      setIsCompressing(false);
    }
    onScanComplete(finalFile);
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

        {/* Settings Area */}
        <div className="settings-area mt-6 mb-6" style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div className="hstack gap-4" style={{ marginBottom: extractionMethod === 'ai' ? '1rem' : 0 }}>
            <label className="hstack gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="method" 
                value="ocr" 
                checked={extractionMethod === 'ocr'}
                onChange={() => setExtractionMethod('ocr')}
              />
              <span>Fast OCR (Local)</span>
            </label>
            <label className="hstack gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="method" 
                value="ai" 
                checked={extractionMethod === 'ai'}
                onChange={() => setExtractionMethod('ai')}
              />
              <span>Smart AI (Gemma 4)</span>
            </label>
          </div>

          {extractionMethod === 'ai' && (
            <div className="api-key-input mt-2">
              <label data-field>
                <small>Google Gen AI API Key (Saved locally)</small>
                <input 
                  type="password" 
                  placeholder="AIzaSy..." 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

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
          <div className="preview-container" style={{ position: 'relative' }}>
            <img
              src={preview}
              alt="Business card preview"
              className="card-preview"
              style={{ opacity: isScanning ? 0.4 : 1, transition: 'opacity 0.2s' }}
            />
            {isScanning && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div aria-busy="true" data-spinner="large"></div>
              </div>
            )}
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
              <div className="hstack gap-2 align-center">
                <div aria-busy="true" data-spinner="small"></div>
                <small className="text-light">{progress?.status || 'Initializing…'}</small>
              </div>
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
            disabled={!selectedFile || isScanning || isCompressing || (extractionMethod === 'ai' && !apiKey)}
            // aria-busy={isCompressing || isScanning ? "true" : undefined}
            // data-spinner={isCompressing || isScanning ? "small" : undefined}
          >
            {isCompressing ? 'Compressing…' : isScanning ? 'Scanning…' : 'Scan Card'}
          </button>
        </div>
      </article>
    </section>
  );
}
