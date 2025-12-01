'use client';

import React from 'react';
import { SoundSelector } from './SoundSelector';

interface SoundSettingsProps {
  soundEnabled: boolean;
  selectedSoundId: string;
  onSoundEnabledChange: (enabled: boolean) => void;
  onSoundChange: (soundId: string) => void;
}

export const SoundSettings: React.FC<SoundSettingsProps> = ({
  soundEnabled,
  selectedSoundId,
  onSoundEnabledChange,
  onSoundChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/80">Timer sound effects</span>
        <button
          onClick={() => onSoundEnabledChange(!soundEnabled)}
          className={`w-10 h-5 rounded-full relative transition-colors ${
            soundEnabled ? 'bg-white' : 'bg-white/20'
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full bg-black absolute top-1 transition-all ${
              soundEnabled ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>

      {soundEnabled && (
        <div className="space-y-2">
          <label className="text-xs text-white/60 block font-medium">
            Ambient Sound
          </label>
          <SoundSelector
            selectedSoundId={selectedSoundId}
            onSoundChange={onSoundChange}
          />
        </div>
      )}
    </div>
  );
};
