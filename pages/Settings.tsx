import React, { useState, useEffect } from 'react';
import { getStoredTheme, setStoredTheme, getProStatus, setProStatus as saveProStatus } from '../services/storageService';
import { Moon, Sun, Shield, CreditCard, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState(getStoredTheme());
  const [isPro, setIsPro] = useState(getProStatus());

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setStoredTheme(newTheme);
  };

  const handleSubscribe = () => {
    // Mock subscription logic
    const confirm = window.confirm("Confirm subscription for $5.00/month? (Mock Payment)");
    if (confirm) {
      setIsPro(true);
      saveProStatus(true);
      alert("Welcome to Pro!");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold dark:text-white">Settings</h2>

      {/* Subscription Card */}
      <div className={`p-6 rounded-2xl ${isPro ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} text-white shadow-lg`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{isPro ? "Pro Plan Active" : "Go Pro"}</h3>
            <p className="text-indigo-100 text-sm opacity-90">
              {isPro ? "You have unlimited access." : "Unlimited scans, No ads, Faster AI."}
            </p>
          </div>
          {isPro ? <Shield size={32} className="opacity-80"/> : <CreditCard size={32} className="opacity-80"/>}
        </div>
        
        {!isPro && (
          <div>
            <div className="text-2xl font-bold mb-4">$5.00 <span className="text-sm font-normal opacity-80">/ month</span></div>
            <button 
              onClick={handleSubscribe}
              className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-opacity-90 transition-colors"
            >
              Subscribe Now
            </button>
            <p className="text-[10px] text-center mt-2 opacity-70">Monthly subscription only. Cancel anytime.</p>
          </div>
        )}
      </div>

      {/* General Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Preferences</h3>
        
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
             {theme === 'light' ? <Sun size={20} className="text-orange-500" /> : <Moon size={20} className="text-indigo-400" />}
             <span className="font-medium dark:text-gray-200">Dark Mode</span>
          </div>
          <button 
            onClick={handleThemeToggle}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${theme === 'dark' ? 'translate-x-6' : ''}`}></div>
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 opacity-50 cursor-not-allowed">
           <div className="flex items-center space-x-3">
             <span className="font-medium text-gray-400">Notifications</span>
           </div>
           <span className="text-xs text-gray-400">Coming soon</span>
        </div>
      </div>

      <div className="pt-8 text-center text-xs text-gray-400">
        <p>SmartStudy AI v1.0.0</p>
        <p className="mt-1">Built with Gemini API</p>
      </div>

    </div>
  );
};

export default Settings;
