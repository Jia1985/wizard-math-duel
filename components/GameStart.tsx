
import React, { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { playSound } from '../services/audioService';

interface GameStartProps {
  onStart: () => void;
}

const GameStart: React.FC<GameStartProps> = ({ onStart }) => {
  // Primary: High quality still of the trio studying
  const [imgSrc, setImgSrc] = useState('https://static1.srcdn.com/wordpress/wp-content/uploads/2019/07/Harry-Potter-Ron-Weasley-Hermione-Granger-Studying.jpg?w=800&q=80');
  const [imgErrorCount, setImgErrorCount] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleStartClick = () => {
    playSound('start');
    onStart();
  };

  const handleImageError = () => {
    setImgErrorCount(prev => prev + 1);
    if (imgErrorCount === 0) {
        // First fallback: Another angle of the scene
        setImgSrc('https://images.ctfassets.net/usf1vwtuqyxm/3d3e6k2c3e6k/5256565/3b3d3e6k2c3e6k/harry-potter-ron-weasley-hermione-granger-1563294346.jpg?w=800&q=80');
    } else {
        // Final fallback: Reliable Unsplash thematic image
        setImgSrc('https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800');
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-5xl mx-auto relative z-10">
      
      <div className="text-center mb-10 animate-bounce-short">
        <div className="flex items-center justify-center mb-4">
             <Wand2 className="w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 text-amber-400 mr-2 sm:mr-3 md:mr-4 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-magical px-2">
                Wizarding Math Duel
            </h1>
            <Wand2 className="w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 text-amber-400 ml-2 sm:ml-3 md:ml-4 animate-pulse transform scale-x-[-1]" />
        </div>        <p className="text-base sm:text-lg md:text-2xl font-serif italic tracking-wide text-amber-100/80 px-4">
          "Challenge your Arithmancy in 30 seconds!"
        </p>
      </div>

      {/* Hero Image Section */}
      <div className="w-full max-w-4xl mx-auto mb-16 relative group rounded-xl overflow-hidden shadow-[0_0_40px_rgba(217,119,6,0.2)] border-4 border-amber-900/60 bg-black">
        {/* Texture Overlay */}
        <div className="absolute inset-0 z-10 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/old-paper.png')] mix-blend-overlay pointer-events-none"></div>
        
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
            {isImageLoading && (
              <div className="absolute inset-0 bg-slate-800/50 flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin"></div>
                  <p className="text-amber-100/60 text-sm font-serif">Loading spell...</p>
                </div>
              </div>
            )}
            <img 
                src={imgSrc} 
                onError={handleImageError}
                onLoad={handleImageLoad}
                alt="Harry, Ron, and Hermione studying arithmancy" 
                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105 opacity-90"
                loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            
            {/* Math Overlays - Mimicking the chalkboard effect */}
            <div className="absolute top-[15%] right-[15%] transform rotate-3 opacity-60 pointer-events-none hidden md:block">
                <span className="font-magical text-amber-100/40 text-4xl drop-shadow-lg" style={{ fontFamily: 'cursive' }}>7 × 8 = ?</span>
            </div>
             <div className="absolute top-[35%] right-[8%] transform -rotate-6 opacity-50 pointer-events-none hidden md:block">
                <span className="font-magical text-amber-100/40 text-3xl drop-shadow-lg" style={{ fontFamily: 'cursive' }}>12 × 5 = ?</span>
            </div>
             <div className="absolute top-[60%] right-[20%] transform rotate-2 opacity-40 pointer-events-none hidden md:block">
                <span className="font-magical text-amber-100/40 text-3xl drop-shadow-lg" style={{ fontFamily: 'cursive' }}>13 × 4 = ?</span>
            </div>
        </div>

        {/* Caption */}
        <div className="absolute bottom-4 left-0 w-full text-center z-20 px-4 pointer-events-none">
            <p className="text-amber-100/90 font-serif italic text-lg md:text-xl drop-shadow-md">
                "The study of numbers demands concentration and precision..."
            </p>
        </div>
      </div>

      <button
        onClick={handleStartClick}
        className="group relative inline-flex items-center justify-center px-8 md:px-16 py-6 overflow-hidden font-display font-bold text-amber-100 rounded-lg shadow-[0_0_20px_rgba(217,119,6,0.5)] bg-red-900 border-2 border-amber-500 hover:bg-red-800 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20"></span>
        <span className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/40 to-transparent"></span>
        <Sparkles className="w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3 text-amber-300 animate-spin-slow" />
        <span className="text-sm md:text-xl tracking-widest uppercase drop-shadow-md relative z-10">Cast Start Spell</span>
      </button>

      <div className="mt-8 text-slate-400 text-lg font-serif italic flex items-center">
        <span className="mr-2">✨</span> Wands at the ready! <span className="ml-2">✨</span>
      </div>
    </div>
  );
};

export default GameStart;
