import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Camera, Mic, X, Loader2, StopCircle, Sparkles, ListChecks } from 'lucide-react';
import { extractTextFromImage, processHomeworkInput } from '../services/geminiService';
import { saveToHistory } from '../services/storageService';
import { Quiz, DirectSolution } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const InputHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'type'; // 'camera', 'voice', 'type'

  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Voice Recognition
  useEffect(() => {
    if (mode === 'voice') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
          setInputText(transcript);
        };
        
        recognitionRef.current.start();
      } else {
        setStatusMessage("Voice recognition not supported in this browser.");
      }
    }
  }, [mode]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setIsProcessing(true);
        setStatusMessage("Scanning text...");
        try {
          const extractedText = await extractTextFromImage(base64);
          setInputText(extractedText);
          setStatusMessage("");
        } catch (err) {
          setStatusMessage("Failed to extract text. Please try again.");
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processInput = async (forceQuiz: boolean) => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setStatusMessage(forceQuiz ? "Creating quiz..." : "Analyzing question...");

    try {
      const result = await processHomeworkInput(inputText, forceQuiz);
      const id = generateId();

      // Ensure result.data exists before accessing properties
      const data = result.data || {};

      if (result.mode === 'single_question') {
        const solution: DirectSolution = {
          id,
          type: 'solution',
          title: (data.question || "Question").substring(0, 30) + "...",
          createdAt: Date.now(),
          question: data.question || "Unknown Question",
          answer: data.answer || "No answer provided",
          steps: data.steps || []
        };
        saveToHistory(solution);
        navigate(`/solution/${id}`);
      } else {
        const quiz: Quiz = {
          id,
          type: 'quiz',
          title: data.title || "Generated Quiz",
          createdAt: Date.now(),
          questions: data.questions || [],
          completed: false
        };
        saveToHistory(quiz);
        navigate(`/quiz/${id}`);
      }

    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to process. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <X size={24} className="text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-lg font-semibold capitalize dark:text-white">{mode} Input</h2>
        <div className="w-8"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
        
        {/* Camera Preview */}
        {mode === 'camera' && !imagePreview && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Camera size={48} className="text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Tap to take photo or upload</p>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* Image Display */}
        {imagePreview && (
          <div className="relative h-48 rounded-xl overflow-hidden shadow-md shrink-0">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => { setImagePreview(null); setInputText(''); }}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Voice Visualization */}
        {mode === 'voice' && isListening && (
           <div className="h-24 flex items-center justify-center space-x-1">
             <div className="w-2 h-8 bg-primary animate-pulse"></div>
             <div className="w-2 h-12 bg-secondary animate-pulse delay-75"></div>
             <div className="w-2 h-6 bg-primary animate-pulse delay-150"></div>
           </div>
        )}

        {/* Text Editor */}
        <div className="flex-1 flex flex-col">
           <label className="text-sm font-medium text-gray-500 mb-2 dark:text-gray-400 flex items-center justify-between">
              <span>{imagePreview ? "Extracted Text (Editable)" : "Your Question"}</span>
              {mode === 'voice' && (
                <button onClick={toggleListening} className={`${isListening ? 'text-red-500' : 'text-primary'}`}>
                  {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
                </button>
              )}
           </label>
           <textarea
             className="w-full flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-primary focus:outline-none"
             placeholder={mode === 'type' ? "Type your question here (e.g. 1 + 1, or a list of questions)" : "Waiting for input..."}
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
           ></textarea>
        </div>

      </div>

      {/* Action Bar */}
      <div className="mt-6 flex flex-col space-y-3">
        {statusMessage && (
           <p className="text-center text-sm text-primary mb-2 flex items-center justify-center">
             {isProcessing && <Loader2 size={14} className="animate-spin mr-2" />}
             {statusMessage}
           </p>
        )}
        
        <button
          onClick={() => processInput(false)}
          disabled={!inputText || isProcessing}
          className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center space-x-2"
        >
          <Sparkles size={20} />
          <span>Get Answer</span>
        </button>

        <button
          onClick={() => processInput(true)}
          disabled={!inputText || isProcessing}
          className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
        >
          <ListChecks size={20} />
          <span>Generate Quiz</span>
        </button>
      </div>
    </div>
  );
};

export default InputHandler;