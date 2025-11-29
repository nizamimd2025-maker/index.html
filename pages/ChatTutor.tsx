import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { chatWithTutor } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';

const ChatTutor: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: "Hi! I'm your AI Tutor. Need help with a specific problem or concept?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle auto-send if navigated from quiz explanation
  useEffect(() => {
    if (location.state?.initialMessage) {
       handleSend(location.state.initialMessage);
       // Clear state to prevent loop
       window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if(scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Format history for API
      const historyForApi = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithTutor(historyForApi, textToSend);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I'm having trouble thinking right now.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Sorry, I couldn't connect to the server.",
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      
      {/* Messages List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 mx-2 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                 {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
               </div>
               <div 
                 className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none'
                 }`}
               >
                 {msg.text}
               </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="ml-12 bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none">
                <Loader2 size={16} className="animate-spin text-gray-400" />
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a follow-up..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 dark:text-white"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="ml-2 p-2 bg-primary text-white rounded-full disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatTutor;
