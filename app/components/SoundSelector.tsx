'use client';

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { ChevronDown, Volume2 } from 'lucide-react';
import { SOUND_EFFECTS } from './constants';

interface SoundSelectorProps {
  selectedSoundId: string;
  onSoundChange: (soundId: string) => void;
  disabled?: boolean;
}

export const SoundSelector: React.FC<SoundSelectorProps> = ({
  selectedSoundId,
  onSoundChange,
  disabled = false,
}) => {
  const [soundOpen, setSoundOpen] = useState(false);
  const selectedSound = SOUND_EFFECTS.find((s) => s.id === selectedSoundId);

  const handleSoundSelect = (soundId: string) => {
    onSoundChange(soundId);
    setSoundOpen(false);
  };

  return (
    <DropdownMenu open={soundOpen} onOpenChange={setSoundOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30 text-white/90 h-auto"
          disabled={disabled}
        >
          <span className="flex items-center gap-2">
            <Volume2 size={14} />
            {selectedSound?.name || 'Select sound'}
          </span>
          <ChevronDown size={16} className="transition-transform" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-black/90 border-white/20 p-1"
      >
        {SOUND_EFFECTS.map((sound) => (
          <DropdownMenuItem
            key={sound.id}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log({ sound: sound.name });
              handleSoundSelect(sound.id);
            }}
            className={`cursor-pointer px-3 py-2 text-sm rounded-md flex items-center justify-between ${
              selectedSoundId === sound.id
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{sound.name}</span>
            {selectedSoundId === sound.id && (
              <span className="ml-2 text-xs">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
