import { useState, useCallback, useEffect } from "react";
import Scanner from "./components/Scanner";
import ResultForm from "./components/ResultForm";
import ExportActions from "./components/ExportActions";
import { recognizeImage } from "./utils/ocr";
import { parseContactText } from "./utils/parser";
import { extractContactWithAI } from "./utils/llm";
import { extractContactWithOpenRouter } from "./utils/llm";
import "./App.css";

const EMPTY_CONTACT = {
	name: "",
	email: "",
	mobile: "",
	company: "",
	website: "",
	rawText: "",
};

export default function App() {
	const [view, setView] = useState("scan"); // 'scan' | 'result'
	const [isScanning, setIsScanning] = useState(false);
	const [progress, setProgress] = useState(null);
	const [contact, setContact] = useState(EMPTY_CONTACT);

	const [extractionMethod, setExtractionMethod] = useState("ocr"); // 'ocr' | 'ai' | 'openrouter'
	const [apiKey, setApiKey] = useState(
		() => localStorage.getItem("gemini_api_key") || "",
	);
	const [openrouterKey, setOpenrouterKey] = useState(
		() => localStorage.getItem("openrouter_api_key") || "",
	);

	useEffect(() => {
		localStorage.setItem("gemini_api_key", apiKey);
	}, [apiKey]);

	useEffect(() => {
		localStorage.setItem("openrouter_api_key", openrouterKey);
	}, [openrouterKey]);

	const handleScan = useCallback(
		async (file) => {
			setIsScanning(true);
			setProgress({ status: "Initializing...", progress: 0 });

			try {
				if (extractionMethod === "ai" && apiKey) {
					const parsed = await extractContactWithAI(file, apiKey, setProgress);
					setContact(parsed);
				} else if (extractionMethod === "openrouter" && openrouterKey) {
					const parsed = await extractContactWithOpenRouter(
						file,
						openrouterKey,
						setProgress,
					);
					setContact(parsed);
				} else {
					const text = await recognizeImage(file, (p) => {
						setProgress(p);
					});
					const parsed = parseContactText(text);
					setContact(parsed);
				}
				setView("result");
			} catch (err) {
				console.error("Scan failed:", err);
				alert(
					err.message || "Scan failed. Please try again with a clearer image.",
				);
			} finally {
				setIsScanning(false);
				setProgress(null);
			}
		},
		[extractionMethod, apiKey, openrouterKey],
	);

	const handleReset = useCallback(() => {
		setContact(EMPTY_CONTACT);
		setView("scan");
	}, []);

	return (
		<div className="app-shell">
			{/* App header — Oat .hstack for layout */}
			<nav className="app-header">
				<div className="hstack">
					<a href="/" className="unstyled">
						<h4>Business Card Scanner</h4>
					</a>
				</div>
			</nav>

			<main className="app-main">
				{view === "scan" && (
					<Scanner
						onScanComplete={handleScan}
						isScanning={isScanning}
						progress={progress}
						extractionMethod={extractionMethod}
						setExtractionMethod={setExtractionMethod}
						apiKey={apiKey}
						setApiKey={setApiKey}
						openrouterKey={openrouterKey}
						setOpenrouterKey={setOpenrouterKey}
					/>
				)}

				{view === "result" && (
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
