import { MutableRefObject } from 'react';

export const initAudio = (
  audioCtxRef: MutableRefObject<AudioContext | null>
): void => {
  if (!audioCtxRef.current) {
    const AudioContextClass =
      window.AudioContext ||
      (window as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      audioCtxRef.current = new AudioContextClass();
    }
  }
  if (audioCtxRef.current?.state === 'suspended') {
    audioCtxRef.current.resume();
  }
};

export const playAmbientSound = (
  audioCtxRef: MutableRefObject<AudioContext | null>,
  audioNodeRef: MutableRefObject<HTMLAudioElement | null>,
  soundPath: string
): void => {
  initAudio(audioCtxRef);

  // Use the DOM audio element passed via ref
  if (!audioNodeRef.current) {
    return; // Audio element not mounted yet
  }

  const audio = audioNodeRef.current;

  // Stop any existing playback
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;
  }

  // Set up and play the new sound
  audio.src = soundPath;
  audio.loop = true;
  audio.volume = 0.3;

  // Reset to start in case it was playing before
  audio.currentTime = 0;

  // Play with error handling
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => console.error('Audio playback failed:', err));
  }
};

export const stopAmbientSound = (
  audioNodeRef: MutableRefObject<HTMLAudioElement | null>
): void => {
  if (audioNodeRef.current) {
    // Fade out
    const currentVolume = audioNodeRef.current.volume;
    const fadeInterval = setInterval(() => {
      if (audioNodeRef.current && audioNodeRef.current.volume > 0.01) {
        audioNodeRef.current.volume = Math.max(
          0,
          audioNodeRef.current.volume - 0.05
        );
      } else {
        if (audioNodeRef.current) {
          audioNodeRef.current.pause();
          audioNodeRef.current.volume = currentVolume;
        }
        clearInterval(fadeInterval);
      }
    }, 50);
  }
};

export const playRain = (
  audioCtxRef: MutableRefObject<AudioContext | null>,
  rainNodeRef: MutableRefObject<AudioBufferSourceNode | null>,
  gainNodeRef: MutableRefObject<GainNode | null>
): void => {
  initAudio(audioCtxRef);
  const ctx = audioCtxRef.current!;
  if (rainNodeRef.current) return;

  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.15;

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noise.start();
  rainNodeRef.current = noise;
  gainNodeRef.current = gainNode;
};

export const stopRain = (
  audioCtxRef: MutableRefObject<AudioContext | null>,
  rainNodeRef: MutableRefObject<AudioBufferSourceNode | null>,
  gainNodeRef: MutableRefObject<GainNode | null>
): void => {
  if (rainNodeRef.current) {
    const ctx = audioCtxRef.current;
    if (gainNodeRef.current && ctx) {
      gainNodeRef.current.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.5
      );
    }
    setTimeout(() => {
      if (rainNodeRef.current) {
        rainNodeRef.current.stop();
        rainNodeRef.current.disconnect();
        rainNodeRef.current = null;
      }
    }, 500);
  }
};

export const playBell = (
  audioCtxRef: MutableRefObject<AudioContext | null>
): void => {
  initAudio(audioCtxRef);
  const ctx = audioCtxRef.current!;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 2);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 4);
};
