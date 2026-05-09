/**
 * Tesseract.js OCR worker management.
 * Creates a reusable worker for text recognition.
 */
import { createWorker } from 'tesseract.js';

let workerInstance = null;

/**
 * Get or create a Tesseract worker (singleton).
 * @param {function} logger - Progress callback (optional)
 * @returns {Promise<object>} Tesseract worker
 */
export async function getWorker(logger) {
  if (workerInstance) return workerInstance;

  const opts = {};
  if (logger) opts.logger = logger;

  workerInstance = await createWorker('eng', 1, opts);
  return workerInstance;
}

/**
 * Recognize text from an image file.
 * @param {File|Blob|string} image - Image to OCR
 * @param {function} onProgress - Progress callback ({ status, progress })
 * @returns {Promise<string>} Recognized text
 */
export async function recognizeImage(image, onProgress) {
  const worker = await getWorker(onProgress || undefined);

  const { data } = await worker.recognize(image, {
    rotateAuto: true,
  });

  return data.text;
}

/**
 * Terminate the worker and free resources.
 */
export async function terminateWorker() {
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
  }
}
