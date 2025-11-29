import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHistory } from '../services/storageService';
import { DirectSolution } from '../types';
import { ChevronLeft, MessageCircle, Share2, BookOpen } from 'lucide-react';

const SolutionResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [solution, setSolution] = useState<DirectSolution | null>(null);

  useEffect(() => {
    const history = getHistory();
    const found = history.find(item => item.id === id && item.type === 'solution') as DirectSolution;
    if (found) {
      setSolution(found);
    } else {
      navigate('/'); // Not found
    }
  }, [id, navigate]);

  if (!solution) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-white dark:bg-gray-800 shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="mr-4 text-gray-600 dark:text-gray-300">
           <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white flex-1">Solution</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-2">Question</h2>
          <p className="text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
            {solution.question}
          </p>
        </div>

        {/* Answer Card */}
        <div className="bg-gradient-to-br from-indigo-500 to-primary p-6 rounded-2xl shadow-lg text-white">
          <h2 className="text-sm font-bold text-indigo-200 uppercase mb-2">Final Answer</h2>
          <p className="text-3xl font-bold">
            {solution.answer}
          </p>
        </div>

        {/* Steps */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Step-by-Step</h2>
          </div>
          
          <div className="space-y-4">
            {solution.steps && solution.steps.length > 0 ? (
              solution.steps.map((step, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No detailed steps provided.</p>
            )}
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex space-x-3">
         <button 
           onClick={() => navigate('/tutor', { state: { initialMessage: `I need more help understanding this: ${solution.question}` } })}
           className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors"
         >
           <MessageCircle size={20} />
           <span>Explain More</span>
         </button>
      </div>

    </div>
  );
};

export default SolutionResult;