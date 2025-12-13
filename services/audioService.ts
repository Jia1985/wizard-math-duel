
let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const playSound = (type: 'correct' | 'wrong' | 'start' | 'finish' | 'click') => {
  const ctx = getCtx();
  if (!ctx) return;
  
  // Resume context if suspended (browser policy)
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  const gainNode = ctx.createGain();
  // Add reverb-like decay for magical feel
  gainNode.connect(ctx.destination);

  const playOsc = (freq: number, wave: OscillatorType, startTime: number, duration: number, vol: number = 0.1) => {
    const osc = ctx.createOscillator();
    osc.type = wave;
    osc.frequency.value = freq;
    osc.connect(gainNode);
    
    osc.start(now + startTime);
    osc.stop(now + startTime + duration);
  };

  switch (type) {
    case 'correct':
      // Magical Sparkle (High pitched sine waves playing an arpeggio)
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      
      // A shimmery chord
      playOsc(880, 'sine', 0, 0.4);   // A5
      playOsc(1108, 'sine', 0.05, 0.4); // C#6
      playOsc(1318, 'sine', 0.1, 0.4);  // E6
      playOsc(1760, 'sine', 0.15, 0.4); // A6
      break;
      
    case 'wrong':
      // Spell fizzle (Low noise/sawtooth)
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      const oscWrong = ctx.createOscillator();
      oscWrong.type = 'sawtooth';
      oscWrong.frequency.setValueAtTime(100, now);
      oscWrong.frequency.linearRampToValueAtTime(50, now + 0.3);
      oscWrong.connect(gainNode);
      oscWrong.start(now);
      oscWrong.stop(now + 0.3);
      break;
      
    case 'start':
      // Wand Swish (Filter sweep + rising tone)
      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      const oscStart = ctx.createOscillator();
      oscStart.type = 'sine';
      oscStart.frequency.setValueAtTime(200, now);
      oscStart.frequency.exponentialRampToValueAtTime(1200, now + 0.6);
      oscStart.connect(gainNode);
      oscStart.start(now);
      oscStart.stop(now + 0.6);
      break;
      
    case 'finish':
      // Grand Fanfare (Trumpet-like saw/triangle mix)
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
      
      // Majestic Chord
      playOsc(293.66, 'triangle', 0, 1.5); // D4
      playOsc(369.99, 'triangle', 0.1, 1.5); // F#4
      playOsc(440.00, 'triangle', 0.2, 1.5); // A4
      playOsc(587.33, 'triangle', 0.3, 2.0); // D5
      break;

    case 'click':
      // Parchment tick / Wood block sound
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      playOsc(400, 'sine', 0, 0.05);
      break;
  }
};