import { useState, useCallback } from 'react';
import Scanner from './components/Scanner';
import ResultForm from './components/ResultForm';
import ExportActions from './components/ExportActions';
import { recognizeImage } from './utils/ocr';
import { parseContactText } from './utils/parser';
import './App.css';

const EMPTY_CONTACT = {
  name: '',
  email: '',
  phone: '',
  mobile: '',
  company: '',
  website: '',
  rawText: '',
};

export default function App() {
  const [view, setView] = useState('scan'); // 'scan' | 'result'
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [contact, setContact] = useState(EMPTY_CONTACT);

  const handleScan = useCallback(async (file) => {
    setIsScanning(true);
    setProgress({ status: 'Initializing OCR…', progress: 0 });

    try {
      const text = await recognizeImage(file, (p) => {
        setProgress(p);
      });

      const parsed = parseContactText(text);
      setContact(parsed);
      setView('result');
    } catch (err) {
      console.error('OCR failed:', err);
      alert('Scan failed. Please try again with a clearer image.');
    } finally {
      setIsScanning(false);
      setProgress(null);
    }
  }, []);

  const handleReset = useCallback(() => {
    setContact(EMPTY_CONTACT);
    setView('scan');
  }, []);

  return (
    <div className="app-shell">
      {/* App header — Oat .hstack for layout */}
      <nav className="app-header">
        <div className="hstack" style={{ maxWidth: 650, margin: '0 auto' }}>
          <a href="/" className="unstyled" style={{ color: 'inherit' }}>
            <h4 style={{ margin: 0 }}>Business Card Scanner</h4>
          </a>
        </div>
      </nav>

      <main className="app-main">
        {view === 'scan' && (
          <Scanner
            onScanComplete={handleScan}
            isScanning={isScanning}
            progress={progress}
          />
        )}

        {view === 'result' && (
          <div className="result-container vstack">
            <ExportActions contact={contact} onReset={handleReset} />
            <ResultForm contact={contact} onChange={setContact} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <small>Business Card Scanner - Made by Hardo & Gemini</small>
      </footer>
    </div>
  );
}
