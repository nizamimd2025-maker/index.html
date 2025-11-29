import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODELS = {
  FLASH: 'gemini-2.5-flash',
};

/**
 * Helper to clean JSON string from Markdown code blocks
 */
const cleanJSON = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

/**
 * Extracts text from a base64 image string.
 */
export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  try {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: MODELS.FLASH,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: "Perform OCR on this image. Extract all legible text precisely. Return only the extracted text, no markdown code blocks."
          }
        ]
      }
    });

    return response.text || "No text found.";
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to extract text from image.");
  }
};

/**
 * Analyzes input text and generates either a Single Question Solution OR a Quiz.
 */
export const processHomeworkInput = async (text: string, forceQuizMode: boolean = false): Promise<any> => {
  try {
    const systemInstruction = `
      You are an expert AI homework helper. Analyze the user's input.
      
      LOGIC:
      1. If 'forceQuizMode' is TRUE, ALWAYS generate a Quiz (mode: 'quiz').
      2. If 'forceQuizMode' is FALSE:
         - Detect if the input is a SINGLE, specific question (e.g., "1+1", "What is mitochondria?", "Solve x^2=4").
         - If SINGLE question -> return mode: 'single_question'.
         - If MULTIPLE questions, notes, or a broad topic request -> return mode: 'quiz'.

      OUTPUT FORMAT (JSON ONLY):
      
      Option A (Single Question):
      {
        "mode": "single_question",
        "data": {
          "question": "The canonical text of the question",
          "answer": "The final direct answer",
          "steps": ["Step 1 explanation", "Step 2 explanation", ...]
        }
      }

      Option B (Quiz):
      {
        "mode": "quiz",
        "data": {
          "title": "Short topic title",
          "questions": [
            {
              "id": "q1",
              "type": "mcq" | "short_answer" | "true_false",
              "text": "Question text",
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // Required for MCQ
              "correctAnswer": "Exact answer text",
              "explanation": "Why this is correct"
            }
          ]
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: MODELS.FLASH,
      contents: `forceQuizMode: ${forceQuizMode}\nInput: "${text.substring(0, 5000)}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mode: { type: Type.STRING, enum: ["single_question", "quiz"] },
            data: { 
              type: Type.OBJECT,
              properties: {
                // Shared / Union fields
                question: { type: Type.STRING },
                answer: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                
                title: { type: Type.STRING },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      type: { type: Type.STRING },
                      text: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const rawText = response.text || "{}";
    const cleanedText = cleanJSON(rawText);
    const parsed = JSON.parse(cleanedText);
    
    // Ensure data object exists to prevent crashes
    if (!parsed.data) {
      parsed.data = {};
    }

    return parsed;
  } catch (error) {
    console.error("Parsing Error:", error);
    throw new Error("Failed to process request.");
  }
};

/**
 * Chat with the tutor.
 */
export const chatWithTutor = async (history: { role: string, parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: MODELS.FLASH,
      config: {
        systemInstruction: "You are a helpful, encouraging, and patient AI homework tutor for a teenager. Keep answers concise but clear. Use emojis occasionally.",
      },
      history: history as any
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw new Error("Failed to get response from tutor.");
  }
};