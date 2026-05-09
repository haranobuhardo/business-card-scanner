import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

/**
 * Converts a File object to a base64 string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // FileReader returns "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      // We need just the base64 part
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Extracts business card info using Gemma 4 via Google Gen AI API
 */
export async function extractContactWithAI(file, apiKey, onProgress) {
  if (onProgress) {
    onProgress({ status: 'Preparing image...', progress: 0.1 });
  }

  const base64Image = await fileToBase64(file);
  const mimeType = file.type || 'image/jpeg';

  let timerInterval;
  if (onProgress) {
    let seconds = 0.0;
    onProgress({ status: 'Analyzing with Gemma 4...', progress: 0.4 });
    timerInterval = setInterval(() => {
      seconds = seconds + 0.1;
      onProgress({ status: `Analyzing with Gemma 4... (${seconds.toFixed(1)}s)`, progress: 0.4 });
    }, 100);
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
You are an expert contact information extractor. Extract the details from the provided business card image.
CRITICAL INSTRUCTIONS:
1. Pay close attention to distinguishing personal contact info vs company contact info.
2. If there are multiple emails, the one with the person's name is their email, the generic one (like info@, support@) is the company email. Return the person's email in 'email'.
3. If there are multiple phone numbers, prioritize the direct line or mobile number for 'mobile' and the general office number for 'phone'.
4. Format intelligently: lowercase all emails, remove all spaces/dashes from phone numbers and format them in clean international format (e.g. +62812345678), fix obvious OCR typos, and trim all whitespace.
5. Do NOT hallucinate. If a field is not present, leave it as an empty string.

Return ONLY a valid JSON object matching exactly this structure (no markdown code blocks, just raw JSON).
EXAMPLE:
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "mobile": "+1987654321",
  "company": "Example Corp",
  "website": "www.example.com",
  "rawText": "Name: John Doe. Company: Example Corp. Phone: +1234567890. Mobile: +1987654321. Email: john.doe@example.com. Website: www.example.com."
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH
        },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            mobile: { type: Type.STRING },
            company: { type: Type.STRING },
            website: { type: Type.STRING },
            rawText: { type: Type.STRING }
          }
        }
      }
    });

    if (timerInterval) clearInterval(timerInterval);

    if (onProgress) {
      onProgress({ status: 'Parsing results...', progress: 0.9 });
    }

    const text = response.text;
    
    // Clean up Gemma 4 CoT artifacts
    let cleanText = text;
    if (cleanText.includes('<|thought|>')) {
      cleanText = cleanText.split('<|thought|>')[0];
    }
    
    // Extract JSON block from potential surrounding text
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No JSON object found in response");
    }
    
    let jsonStr = cleanText.substring(firstBrace, lastBrace + 1);
    
    // Fix Gemma escaping bug where it escapes quotes for the next keys (e.g. \",\"rawText\":\"...)
    jsonStr = jsonStr.replace(/\\"/g, '"');
    
    console.log("Raw Output:", text);
    console.log("Parsed JSON:", JSON.parse(jsonStr));
    
    return JSON.parse(jsonStr);
  } catch (error) {
    if (timerInterval) clearInterval(timerInterval);
    console.error("AI Extraction Error:", error);
    throw new Error("Failed to extract data using AI. Please check your API key and try again.");
  }
}
