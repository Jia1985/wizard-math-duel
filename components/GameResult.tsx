import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, Scroll } from 'lucide-react';
import { AnswerHistory } from '../types';
import { getTeacherFeedback } from '../services/geminiService';
import { playSound } from '../services/audioService';

interface GameResultProps {
  history: AnswerHistory[];
  onRestart: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ history, onRestart }) => {
  const [aiFeedback, setAiFeedback] = useState<string>('Owl post arriving...');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const total = history.length;
  const correctCount = history.filter(h => h.isCorrect).length;
  const errorCount = total - correctCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  
  const errors = history.filter(h => !h.isCorrect);

  useEffect(() => {
    playSound('finish');
    
    if (total > 0) {
      setLoadingFeedback(true);
      getTeacherFeedback(correctCount, total, accuracy)
        .then((msg) => {
          if (msg) setAiFeedback(msg);
        })
        .finally(() => setLoadingFeedback(false));
    }
  }, [correctCount, total, accuracy]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-2xl mx-auto animate-bounce-short relative z-10">
      {/* Result Card - Parchment Style */}
      <div className="bg-[#f5e6c8] w-full rounded-sm shadow-2xl p-6 mb-6 text-center border-4 border-double border-amber-900 relative overflow-hidden">
        {/* Texture */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] pointer-events-none"></div>
        {/* Trophy Section */}
        <div className="relative inline-block mb-2 mt-2 group cursor-default">
            {/* Owl Image */}
            <img 
              src="/owl-v2.png" 
              alt="Magical Owl" 
              className="w-40 h-40 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
            />
        </div>
        
        <h2 className="text-4xl font-magical font-bold text-amber-900 mb-2 tracking-tight drop-shadow-sm">Wands Down!</h2>
        
        {/* Feedback Section */}
        <div className="min-h-[4.5rem] flex items-center justify-center mb-6 px-6 py-2 relative z-10">
           {loadingFeedback ? (
             <div className="flex space-x-2">
                <div className="w-2 h-2 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
             </div>
           ) : (
             <p className="text-xl font-serif text-amber-900/90 italic leading-relaxed">
                "{aiFeedback}"
             </p>
           )}
        </div>

        {/* Stats Seals */}
        <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
          <div className="bg-emerald-900/10 p-4 rounded-lg border border-emerald-800/30 flex flex-col items-center justify-center">
            <div className="text-emerald-900 text-xs font-serif uppercase font-bold tracking-widest mb-1">Precision</div>
            <div className="text-4xl font-magical font-bold text-emerald-800">{accuracy}%</div>
          </div>
          <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-800/30 flex flex-col items-center justify-center">
             <div className="text-blue-900 text-xs font-serif uppercase font-bold tracking-widest mb-1">Marks</div>
             <div className="text-4xl font-magical font-bold text-blue-900">{correctCount}<span className="text-xl font-sans opacity-60">/{total}</span></div>
          </div>
        </div>
      </div>

      {/* Details Scroll */}
      <div className="bg-[#fffdf5] w-full rounded-sm shadow-xl p-6 mb-8 border border-amber-200 relative">
        <h3 className="text-xl font-magical font-bold text-slate-800 mb-4 flex items-center border-b border-slate-200 pb-2">
          <Scroll className="w-5 h-5 mr-2 text-amber-700" />
          O.W.L. Summary
        </h3>
        
        <div className="space-y-3 mb-6 font-serif">
          <div className="flex justify-between items-center p-2 border-b border-dashed border-slate-300">
             <span className="text-slate-600 font-medium">Total Charms Cast</span>
             <span className="font-bold text-slate-800 text-lg">{total}</span>
          </div>
          <div className="flex justify-between items-center p-2 border-b border-dashed border-red-200 bg-red-50/50">
             <span className="text-red-700 font-medium flex items-center"><XCircle className="w-4 h-4 mr-2"/> Backfires (Errors)</span>
             <span className="font-bold text-red-800 text-lg">{errorCount}</span>
          </div>
        </div>

        {/* Errors Review - Only show if there are errors */}
        {errors.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1 font-serif">Mismatched Spells</p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {errors.map((h, i) => (
                <div key={i} className="flex justify-between items-center text-sm p-3 rounded bg-red-50 border border-red-100">
                  <span className="font-magical font-bold text-slate-700 text-lg">{h.question.factorA} × {h.question.factorB}</span>
                  <div className="flex items-center space-x-3 font-serif">
                    <span className="text-red-400 line-through text-lg">{h.userAnswer}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2 rounded text-lg">{h.question.answer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onRestart}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-amber-50 font-display font-bold py-4 rounded shadow-lg border-2 border-amber-700 hover:from-amber-600 hover:to-amber-700 hover:text-white transition-all flex items-center justify-center text-xl tracking-wide uppercase"
      >
        <RefreshCw className="w-5 h-5 mr-3" />
        Rematch
      </button>

    </div>
  );
};

export default GameResult;
