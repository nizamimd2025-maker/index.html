import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Type, Mic, BrainCircuit } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleInputSelect = (mode: 'camera' | 'voice' | 'type') => {
    navigate(`/input?mode=${mode}`);
  };

  return (
    <div className="flex flex-col h-full p-6 relative bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      
      {/* Hero Section */}
      <div className="mt-8 mb-10 text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-2 dark:text-white">SmartStudy AI</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Snap, Type, or Speak.<br />
          We'll handle the homework.
        </p>
      </div>

      {/* Main Actions */}
      <div className="flex-1 flex flex-col justify-center space-y-4 max-w-md mx-auto w-full">
        
        {/* Camera Action - Primary */}
        <button
          onClick={() => handleInputSelect('camera')}
          className="group relative flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-primary dark:text-indigo-400">
              <Camera size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold dark:text-white">Scan Homework</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Use your camera</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
            →
          </div>
        </button>

        {/* Secondary Actions Row */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleInputSelect('type')}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-transparent hover:border-secondary transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-secondary mb-3">
              <Type size={20} />
            </div>
            <span className="font-semibold text-sm dark:text-gray-200">Type</span>
          </button>

          <button
            onClick={() => handleInputSelect('voice')}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-transparent hover:border-teal-500 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-3">
              <Mic size={20} />
            </div>
            <span className="font-semibold text-sm dark:text-gray-200">Voice</span>
          </button>
        </div>

      </div>

      {/* Pro Teaser */}
      <div className="mt-auto mb-20 text-center">
        <button onClick={() => navigate('/settings')} className="text-xs font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
          Get Unlimited Access →
        </button>
      </div>
    </div>
  );
};

export default Home;
