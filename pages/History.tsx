import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/storageService';
import { HistoryItem } from '../types';
import { ChevronRight, Calendar, Award, BookOpen, BrainCircuit } from 'lucide-react';

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleItemClick = (item: HistoryItem) => {
    if (item.type === 'solution') {
      navigate(`/solution/${item.id}`);
    } else {
      navigate(`/quiz/${item.id}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Recent Activity</h2>
      
      {history.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">No activity yet.</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 text-primary font-semibold hover:underline"
          >
            Ask a question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3 flex-1 overflow-hidden">
                <div className={`mt-1 p-2 rounded-lg ${item.type === 'solution' ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600'} dark:bg-gray-700 dark:text-gray-300`}>
                   {item.type === 'solution' ? <BookOpen size={16} /> : <BrainCircuit size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 truncate">
                    {item.type === 'solution' ? item.question : item.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                     <span className="flex items-center">
                       <Calendar size={12} className="mr-1" />
                       {new Date(item.createdAt).toLocaleDateString()}
                     </span>
                     {item.type === 'quiz' && item.completed && (
                       <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                         <Award size={12} className="mr-1" />
                         Score: {item.score}/{item.questions.length}
                       </span>
                     )}
                     {item.type === 'solution' && (
                       <span className="text-indigo-500 font-medium">Solved</span>
                     )}
                  </div>
                </div>
              </div>
              <div className="text-gray-300 ml-2">
                <ChevronRight size={20} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;