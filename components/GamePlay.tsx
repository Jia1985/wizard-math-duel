
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Hourglass, ArrowRight, Delete, Sparkles } from 'lucide-react';
import { Question, AnswerHistory } from '../types';
import { playSound } from '../services/audioService';

interface GamePlayProps {
  onFinish: (history: AnswerHistory[]) => void;
}

const GAME_DURATION = 30; // seconds

const GamePlay: React.FC<GamePlayProps> = ({ onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<AnswerHistory[]>([]);
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'wrong'>('none');
  
  const isGameActive = useRef(true);

  const generateQuestion = useCallback(() => {
    const factorA = Math.floor(Math.random() * 9) + 1;
    const factorB = Math.floor(Math.random() * 9) + 1;
    return {
      factorA,
      factorB,
      answer: factorA * factorB,
    };
  }, []);

  useEffect(() => {
    setCurrentQuestion(generateQuestion());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          isGameActive.current = false;
          onFinish(history);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [history, onFinish]);

  // Fallback for strict mode double invocations
  useEffect(() => {
    if (timeLeft === 0 && isGameActive.current) {
        isGameActive.current = false;
        onFinish(history);
    }
  }, [timeLeft, onFinish, history]);


  const handleInput = (num: number) => {
    if (inputValue.length >= 3) return; 
    playSound('click');
    setInputValue((prev) => prev + num.toString());
  };

  const handleBackspace = () => {
    playSound('click');
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleSubmit = useCallback(() => {
    if (!currentQuestion || inputValue === '') return;
    
    const userAns = parseInt(inputValue, 10);
    const isCorrect = userAns === currentQuestion.answer;

    setFeedbackState(isCorrect ? 'correct' : 'wrong');
    playSound(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => setFeedbackState('none'), 300);

    const newHistoryEntry: AnswerHistory = {
      question: currentQuestion,
      userAnswer: userAns,
      isCorrect,
      timeTaken: 0,
    };

    setHistory((prev) => [...prev, newHistoryEntry]);
    setInputValue('');
    setCurrentQuestion(generateQuestion());
  }, [currentQuestion, inputValue, generateQuestion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameActive.current) return;

      if (e.key >= '0' && e.key <= '9') {
        handleInput(parseInt(e.key));
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, currentQuestion, handleSubmit]);

  if (!currentQuestion) return null;

  // Magical feedback styling
  const bgGradient = 
    feedbackState === 'correct' ? 'ring-4 ring-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)]' :
    feedbackState === 'wrong' ? 'ring-4 ring-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]' :
    'ring-4 ring-amber-600/30';

  const progressPercent = (timeLeft / GAME_DURATION) * 100;

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 md:justify-center relative z-10">
      
      {/* Top Bar - Parchment Style */}
      <div className="flex justify-between items-center mb-6 bg-[#f5e6c8] p-3 rounded-lg shadow-lg border-2 border-amber-700/50 relative overflow-hidden">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] pointer-events-none"></div>
        
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-xl font-magical relative z-10">
          <Hourglass className={`w-6 h-6 ${timeLeft <= 5 ? 'text-red-600 animate-spin' : 'text-amber-700'}`} />
          <span className={`${timeLeft <= 5 ? 'text-red-600 animate-pulse' : ''}`}>{timeLeft}s</span>
        </div>
        <div className="text-amber-900/80 font-bold font-magical relative z-10">
          Score: <span className="text-amber-800 text-2xl">{history.filter(h => h.isCorrect).length}</span>
        </div>
      </div>

      {/* Magical Progress Bar */}
      <div className="w-full h-4 bg-slate-800/50 rounded-full mb-8 overflow-hidden border border-slate-600 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-amber-600 to-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.5)] transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Spell/Question Card */}
      <div className={`flex-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 mb-6 relative overflow-hidden bg-[#fdf6e3] text-amber-950 border-2 border-amber-800/40 ${bgGradient} ${feedbackState === 'wrong' ? 'animate-shake' : ''} ${feedbackState === 'correct' ? 'animate-bounce-short' : ''}`}>
         {/* Texture */}
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none"></div>
         
         {/* Corner Decorations */}
         <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800"></div>
         <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800"></div>
         <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800"></div>
         <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800"></div>

        {/* Full Equation on Single Line */}
        <div className="relative z-10 w-full flex items-center justify-center gap-2 sm:gap-2 md:gap-4 flex-wrap md:flex-nowrap px-2">
          {/* Equation Numbers */}
          <div className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-magical font-bold tracking-tight flex items-center gap-1 sm:gap-2 whitespace-nowrap drop-shadow-md">
            <span className="text-amber-900">{currentQuestion.factorA}</span>
            <span className="text-amber-700/50 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">×</span>
            <span className="text-amber-900">{currentQuestion.factorB}</span>
          </div>
          
          {/* Equals and Input */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 whitespace-nowrap">
            <div className="text-4xl sm:text-5xl md:text-7xl text-amber-900/40 font-magical font-bold">=</div>
            <div className={`h-14 sm:h-16 md:h-24 w-16 sm:w-20 md:w-[140px] px-2 sm:px-4 md:px-6 rounded-lg bg-[#fffdf5] border-4 ${inputValue ? 'border-amber-600 text-amber-900' : 'border-amber-200'} flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-magical font-bold shadow-inner flex-shrink-0`}>
              {inputValue}
              {inputValue === '' && <span className="w-1 h-8 sm:h-10 md:h-12 bg-amber-800/30 animate-pulse rounded-full" />}
            </div>
          </div>
        </div>
      </div>

      {/* Rune Numpad */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 h-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleInput(num)}
            className="bg-slate-800/80 backdrop-blur-md rounded-lg shadow-lg border border-slate-600 p-4 text-3xl font-magical font-bold text-amber-100 hover:bg-slate-700 hover:border-amber-400 hover:text-amber-300 transition-all active:scale-95"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          className="bg-red-900/80 backdrop-blur-md rounded-lg border border-red-700 p-4 flex items-center justify-center hover:bg-red-800 transition-all active:scale-95 group"
        >
          <Delete className="w-8 h-8 text-red-200 group-hover:text-white" />
        </button>
        <button
          onClick={() => handleInput(0)}
          className="bg-slate-800/80 backdrop-blur-md rounded-lg shadow-lg border border-slate-600 p-4 text-3xl font-magical font-bold text-amber-100 hover:bg-slate-700 hover:border-amber-400 hover:text-amber-300 transition-all active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleSubmit}
          className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg shadow-lg border border-amber-500 p-4 flex items-center justify-center hover:from-amber-500 hover:to-amber-700 transition-all active:scale-95 group"
        >
          <ArrowRight className="w-10 h-10 text-amber-50 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default GamePlay;