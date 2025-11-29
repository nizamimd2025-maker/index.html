import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHistory, updateItemInHistory } from '../services/storageService';
import { Quiz, QuestionType } from '../types';
import { CheckCircle, XCircle, ChevronRight, RefreshCcw, MessageCircle } from 'lucide-react';

const QuizPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const history = getHistory();
    const found = history.find(q => q.id === id);
    if (found) {
      setQuiz(found);
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer);
    setShowResult(true);
    
    if (quiz) {
      const isCorrect = answer.toLowerCase().trim() === quiz.questions[currentIndex].correctAnswer.toLowerCase().trim();
      
      const updatedQuestions = [...quiz.questions];
      updatedQuestions[currentIndex] = {
        ...updatedQuestions[currentIndex],
        userAnswer: answer,
        isCorrect
      };

      const newScore = isCorrect ? score + 1 : score;
      setScore(newScore);
      
      const updatedQuiz = { ...quiz, questions: updatedQuestions };
      setQuiz(updatedQuiz);
      updateItemInHistory(updatedQuiz);
    }
  };

  const handleNext = () => {
    if (quiz && currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      // End of quiz
      if(quiz) {
        updateItemInHistory({ ...quiz, completed: true, score: score });
        navigate(`/history`); // Or a summary page, simpler to go to history for now
      }
    }
  };

  if (!quiz) return <div>Loading...</div>;

  const currentQ = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-6">
      
      {/* Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-6">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Question {currentIndex + 1} of {quiz.questions.length}
        </span>
        <h3 className="text-xl font-bold mt-2 mb-6 dark:text-white leading-relaxed">
          {currentQ.text}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.type === QuestionType.MCQ && currentQ.options?.map((option, idx) => {
            let optionClass = "w-full p-4 rounded-xl border-2 text-left transition-all font-medium dark:text-gray-200 ";
            
            if (showResult) {
              if (option === currentQ.correctAnswer) {
                optionClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
              } else if (option === selectedOption) {
                optionClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
              } else {
                optionClass += "border-gray-200 dark:border-gray-700 opacity-50";
              }
            } else {
              optionClass += "border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-indigo-50 dark:hover:bg-indigo-900/30";
            }

            return (
              <button 
                key={idx}
                disabled={showResult}
                onClick={() => handleAnswer(option)}
                className={optionClass}
              >
                {option}
              </button>
            );
          })}

          {currentQ.type !== QuestionType.MCQ && !showResult && (
             <div className="flex flex-col space-y-4">
               <input 
                  type="text" 
                  className="p-4 border border-gray-300 rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Type your answer..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAnswer(e.currentTarget.value);
                  }}
               />
               <p className="text-xs text-gray-400">Press Enter to submit</p>
             </div>
          )}

          {currentQ.type !== QuestionType.MCQ && showResult && (
             <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
               <p className="text-sm text-gray-500">You answered:</p>
               <p className="font-bold text-lg dark:text-white mb-2">{currentQ.userAnswer}</p>
               <p className="text-sm text-gray-500">Correct Answer:</p>
               <p className="font-bold text-lg text-green-600">{currentQ.correctAnswer}</p>
             </div>
          )}
        </div>

        {/* Explanation Card */}
        {showResult && (
          <div className="mt-6 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center space-x-2 mb-3">
                {currentQ.isCorrect ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                <span className={`font-bold ${currentQ.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {currentQ.isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
             </div>
             <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
               {currentQ.explanation}
             </p>
             <button 
               onClick={() => navigate('/tutor', { state: { initialMessage: `Can you explain why the answer to "${currentQ.text}" is "${currentQ.correctAnswer}"?` } })}
               className="mt-4 flex items-center text-primary text-sm font-semibold hover:underline"
             >
               <MessageCircle size={16} className="mr-1" /> Ask Tutor for help
             </button>
          </div>
        )}

      </div>

      {/* Footer Nav */}
      <div className="mt-4 pt-4 border-t dark:border-gray-700">
        <button
          onClick={handleNext}
          disabled={!showResult}
          className="w-full bg-primary disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center transition-all"
        >
          {isLastQuestion ? "Finish Quiz" : "Next Question"}
          <ChevronRight size={20} className="ml-2" />
        </button>
      </div>

    </div>
  );
};

export default QuizPlayer;