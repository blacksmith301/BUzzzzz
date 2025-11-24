import React from 'react';
import { HAPTIC_CUES } from '../constants';

interface TimelineProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ currentTime, duration, onSeek }) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    // clamp between 0 and duration
    const newTime = Math.max(0, Math.min(duration, (clickX / rect.width) * duration));
    onSeek(newTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-1 select-none">
      
      <div 
        className="relative h-8 bg-zinc-900/80 backdrop-blur rounded-lg border border-zinc-800 cursor-pointer overflow-hidden group touch-none transition-all duration-200 hover:h-10"
        onClick={handleTrackClick}
      >
        {/* Background Grid / Tick Marks */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #71717a 0px, transparent 1px, transparent 5%)' }}></div>

        {/* Haptic Cues Visualizers */}
        {HAPTIC_CUES.map((cue) => {
            const startPct = duration > 0 ? (cue.startTime / duration) * 100 : 0;
            const widthPct = duration > 0 ? ((cue.endTime - cue.startTime) / duration) * 100 : 0;
            const isActive = currentTime >= cue.startTime && currentTime < cue.endTime;

            return (
                <div 
                    key={cue.id}
                    className={`absolute top-1.5 bottom-1.5 rounded-sm transition-all duration-200 border-l border-r border-black/20 ${
                        isActive 
                        ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] z-10' 
                        : 'bg-cyan-800/50 hover:bg-cyan-700/70'
                    }`}
                    style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                    title={cue.label}
                />
            );
        })}

        {/* Playhead Line */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
          style={{ left: `${progressPercent}%` }}
        />
        
        {/* Playhead Knob */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md z-20 pointer-events-none scale-0 group-hover:scale-100 transition-transform"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};