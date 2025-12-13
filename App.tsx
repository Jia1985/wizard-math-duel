
import React, { useState } from 'react';
import { GameState, AnswerHistory } from './types';
import GameStart from './components/GameStart';
import GamePlay from './components/GamePlay';
import GameResult from './components/GameResult';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [gameHistory, setGameHistory] = useState<AnswerHistory[]>([]);

  const handleStart = () => {
    setGameHistory([]);
    setGameState('PLAYING');
  };

  const handleFinish = (history: AnswerHistory[]) => {
    setGameHistory(history);
    setGameState('FINISHED');
  };

  const handleRestart = () => {
    setGameState('START');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-x-hidden"> 
      {/* Magical Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        {/* Stars */}
        <div className="absolute top-[10%] left-[20%] w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
        <div className="absolute top-[30%] left-[80%] w-1.5 h-1.5 bg-blue-100 rounded-full animate-pulse shadow-[0_0_10px_white]" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-[70%] left-[10%] w-1 h-1 bg-amber-100 rounded-full animate-pulse shadow-[0_0_8px_gold]" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[15%] right-[15%] w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        {/* Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-900/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-900/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-[40%] left-[30%] w-64 h-64 bg-amber-900/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <main className="container mx-auto px-4">
        {gameState === 'START' && <GameStart onStart={handleStart} />}
        {gameState === 'PLAYING' && <GamePlay onFinish={handleFinish} />}
        {gameState === 'FINISHED' && <GameResult history={gameHistory} onRestart={handleRestart} />}
      </main>
    </div>
  );
};

export default App;