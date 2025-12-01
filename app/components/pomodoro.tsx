'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  MoreHorizontal,
  Check,
  Plus,
  Maximize,
  Minimize,
  Brain,
  Coffee,
} from 'lucide-react';
import {
  SCENIC_THEMES,
  INITIAL_FOCUS_MINUTES,
  INITIAL_BREAK_MINUTES,
  SOUND_EFFECTS,
} from './constants';
import {
  playRain,
  stopRain,
  playBell,
  initAudio,
  playAmbientSound,
  stopAmbientSound,
} from './audioEngine';
import { formatTime, formatTotalTime, calculateCircleMetrics } from './utils';
import type { TimersState, ViewMode, ActiveMode } from './types';
import { SoundSettings } from './SoundSettings';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/app/components/ui/dropdown-menu';

const PomodoroTimer: React.FC = () => {
  // --- State ---
  const [timers, setTimers] = useState<TimersState>({
    focus: {
      timeLeft: INITIAL_FOCUS_MINUTES * 60 * 1000,
      duration: INITIAL_FOCUS_MINUTES,
      initialTime: INITIAL_FOCUS_MINUTES * 60 * 1000,
    },
    break: {
      timeLeft: INITIAL_BREAK_MINUTES * 60 * 1000,
      duration: INITIAL_BREAK_MINUTES,
      initialTime: INITIAL_BREAK_MINUTES * 60 * 1000,
    },
  });

  const [viewMode, setViewMode] = useState<ViewMode>('focus');
  const [activeMode, setActiveMode] = useState<ActiveMode>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [totalFocusTime, setTotalFocusTime] = useState<number>(0);
  const [cycleCompleted, setCycleCompleted] = useState<boolean>(false);

  // UI & Settings State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<string>('25');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedSoundId, setSelectedSoundId] = useState<string>('default');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const [hideSeconds, setHideSeconds] = useState<boolean>(false);

  const currentTheme = SCENIC_THEMES[themeIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRandomizedTheme = useRef<boolean>(false);

  // Audio Engine Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  // --- Event Handlers ---

  const switchViewMode = useCallback(
    (mode: ViewMode): void => {
      setViewMode(mode);
      setCustomMinutes(timers[mode].duration.toString());
      setIsEditing(false);
    },
    [timers]
  );

  const startActiveTimer = useCallback((): void => {
    setActiveMode(viewMode);

    const currentTimer = timers[viewMode];
    let startFrom = currentTimer.timeLeft;

    if (startFrom <= 1000) {
      startFrom = currentTimer.initialTime;
      setTimers((prev) => ({
        ...prev,
        [viewMode]: { ...prev[viewMode], timeLeft: startFrom },
      }));
    }

    setEndTime(Date.now() + startFrom);

    if (soundEnabled) {
      initAudio(audioCtxRef);

      if (selectedSoundId === 'default') {
        // Play synthetic rain sound
        if (rainNodeRef.current) {
          stopRain(audioCtxRef, rainNodeRef, gainNodeRef);
        }
        playRain(audioCtxRef, rainNodeRef, gainNodeRef);
      } else {
        // Play selected ambient sound file
        const selectedSound = SOUND_EFFECTS.find((s) => s.id === selectedSoundId);
        if (selectedSound && selectedSound.path && ambientAudioRef.current) {
          playAmbientSound(audioCtxRef, ambientAudioRef, selectedSound.path);
        }
      }
    }
  }, [viewMode, timers, soundEnabled, selectedSoundId]);

  const pauseActiveTimer = useCallback((): void => {
    setActiveMode(null);
    setEndTime(null);
    stopRain(audioCtxRef, rainNodeRef, gainNodeRef);
    stopAmbientSound(ambientAudioRef);
  }, []);

  // Handle sound selection change - switch immediately if timer is running
  const handleSoundChange = useCallback(
    async (newSoundId: string): Promise<void> => {
      const previousSoundId = selectedSoundId;
      setSelectedSoundId(newSoundId);

      // If a timer is currently active and sound is enabled, switch to the new sound immediately
      if (activeMode && soundEnabled) {
        if (newSoundId === 'default') {
          // Switching to default - stop ambient sound and start rain
          await stopAmbientSound(ambientAudioRef);
          if (rainNodeRef.current) {
            stopRain(audioCtxRef, rainNodeRef, gainNodeRef);
          }
          playRain(audioCtxRef, rainNodeRef, gainNodeRef);
        } else {
          // Switching to a non-default sound
          const selectedSound = SOUND_EFFECTS.find((s) => s.id === newSoundId);
          if (selectedSound && selectedSound.path) {
            if (previousSoundId === 'default') {
              // Coming from default - stop rain and start ambient sound
              stopRain(audioCtxRef, rainNodeRef, gainNodeRef);
              playAmbientSound(audioCtxRef, ambientAudioRef, selectedSound.path);
            } else {
              // Switching between ambient sounds - stop current and play new
              await stopAmbientSound(ambientAudioRef);
              playAmbientSound(audioCtxRef, ambientAudioRef, selectedSound.path);
            }
          }
        }
      }
    },
    [activeMode, soundEnabled, selectedSoundId, audioCtxRef]
  );

  const toggleTimer = useCallback((): void => {
    if (activeMode === viewMode) {
      pauseActiveTimer();
    } else {
      startActiveTimer();
    }
  }, [activeMode, viewMode, pauseActiveTimer, startActiveTimer]);

  const resetTimer = useCallback((): void => {
    pauseActiveTimer();
    // Reset both focus and break timers to their initial values
    setTimers({
      focus: {
        timeLeft: INITIAL_FOCUS_MINUTES * 60 * 1000,
        duration: INITIAL_FOCUS_MINUTES,
        initialTime: INITIAL_FOCUS_MINUTES * 60 * 1000,
      },
      break: {
        timeLeft: INITIAL_BREAK_MINUTES * 60 * 1000,
        duration: INITIAL_BREAK_MINUTES,
        initialTime: INITIAL_BREAK_MINUTES * 60 * 1000,
      },
    });
    // Return to focus timer
    setViewMode('focus');
    setThemeIndex((prev) => (prev + 1) % SCENIC_THEMES.length);
  }, [pauseActiveTimer]);

  const addTenMinutes = useCallback((): void => {
    const addedMs = 10 * 60 * 1000;
    setTimers((prev) => ({
      ...prev,
      [viewMode]: {
        ...prev[viewMode],
        timeLeft: prev[viewMode].timeLeft + addedMs,
        initialTime: prev[viewMode].initialTime + addedMs,
      },
    }));

    if (activeMode === viewMode && endTime) {
      setEndTime((prev) => (prev ? prev + addedMs : null));
    }
  }, [viewMode, activeMode, endTime]);

  const handleCustomSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const minutes = parseInt(customMinutes);
      if (!isNaN(minutes) && minutes > 0) {
        const ms = minutes * 60 * 1000;

        if (activeMode === viewMode) {
          pauseActiveTimer();
        }

        setTimers((prev) => ({
          ...prev,
          [viewMode]: {
            timeLeft: ms,
            initialTime: ms,
            duration: minutes,
          },
        }));

        setIsEditing(false);
      }
    },
    [customMinutes, activeMode, viewMode, pauseActiveTimer]
  );

  const resetCycle = useCallback((): void => {
    setCycleCompleted(false);
    setViewMode('focus');
    setCustomMinutes(INITIAL_FOCUS_MINUTES.toString());
    setTimers({
      focus: {
        timeLeft: INITIAL_FOCUS_MINUTES * 60 * 1000,
        duration: INITIAL_FOCUS_MINUTES,
        initialTime: INITIAL_FOCUS_MINUTES * 60 * 1000,
      },
      break: {
        timeLeft: INITIAL_BREAK_MINUTES * 60 * 1000,
        duration: INITIAL_BREAK_MINUTES,
        initialTime: INITIAL_BREAK_MINUTES * 60 * 1000,
      },
    });
    setThemeIndex((prev) => (prev + 1) % SCENIC_THEMES.length);
  }, []);

  const toggleFullScreen = useCallback((): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // --- Effects ---

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (activeMode && endTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;

        if (remaining <= 0) {
          // Timer finished
          if (soundEnabled) playBell(audioCtxRef);

          if (activeMode === 'focus') {
            const minsCompleted = Math.floor(timers.focus.initialTime / 60000);
            setTotalFocusTime((prev) => prev + minsCompleted);
          }

          // Reset current timer but don't auto-start
          setTimers((prev) => ({
            ...prev,
            [activeMode]: {
              ...prev[activeMode],
              timeLeft: prev[activeMode].initialTime,
            },
          }));

          // Check if we just completed a break timer (end of cycle)
          if (activeMode === 'break') {
            // Cycle completed - don't switch, just stop
            setActiveMode(null);
            setEndTime(null);
            stopRain(audioCtxRef, rainNodeRef, gainNodeRef);
            setCycleCompleted(true);
          } else {
            // Focus timer finished, switch to break
            const nextMode = 'break';
            setViewMode(nextMode);
            setCustomMinutes(timers[nextMode].duration.toString());

            // Stop the active timer
            setActiveMode(null);
            setEndTime(null);
            stopRain(audioCtxRef, rainNodeRef, gainNodeRef);
          }
        } else {
          setTimers((prev) => ({
            ...prev,
            [activeMode]: { ...prev[activeMode], timeLeft: remaining },
          }));
        }
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeMode, endTime, soundEnabled, timers]);

  // Randomize theme after hydration (client-side only)
  useEffect(() => {
    if (!hasRandomizedTheme.current) {
      hasRandomizedTheme.current = true;
      // eslint-disable-next-line
      setThemeIndex(Math.floor(Math.random() * SCENIC_THEMES.length));
    }
  }, []);

  // --- Render Helpers ---

  const currentTimer = timers[viewMode];
  const circleMetrics = calculateCircleMetrics(
    currentTimer.initialTime,
    currentTimer.timeLeft
  );

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden text-white transition-all duration-1000 bg-black"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, Pretendard, "Helvetica Neue", Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .timer-display {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          transform: translateZ(0);
        }
        [style*="backgroundImage"] {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          background-attachment: fixed;
        }
      `}</style>

      {/* Hidden audio element for ambient sound */}
      <audio ref={ambientAudioRef} preload="auto" />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${currentTheme.bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${currentTheme.overlay} backdrop-blur-[1px]`}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40" />

      {/* HEADER BAR */}
      <div className="absolute top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 backdrop-blur-md bg-black/20 border-b border-white/5 shadow-2xl">
        {/* Top Left */}
        <div className="flex items-center gap-3">
          <div
            className={`p-1.5 rounded-lg bg-white/10 ${currentTheme.textAccent}`}
          >
            <RotateCcw size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold leading-tight">
              Total Focus
            </span>
            <span className="text-lg font-bold tracking-tight leading-tight">
              {formatTotalTime(totalFocusTime)}
            </span>
          </div>
        </div>

        {/* Top Middle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-6 bg-black/40 backdrop-blur-xl rounded-full px-5 py-1.5 border border-white/10 shadow-lg hover:bg-black/50 transition-colors">
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            {activeMode === 'focus' || (!activeMode && viewMode === 'focus') ? (
              <Brain
                size={16}
                className={`text-cyan-300 ${
                  activeMode === 'focus' ? 'animate-pulse' : ''
                }`}
              />
            ) : (
              <Coffee
                size={16}
                className={`text-amber-300 ${
                  activeMode === 'break' ? 'animate-pulse' : ''
                }`}
              />
            )}
            <span className="text-xs font-bold tracking-wide uppercase">
              {activeMode
                ? activeMode === 'focus'
                  ? 'Focusing'
                  : 'Break'
                : viewMode === 'focus'
                ? 'Focus'
                : 'Break'}
            </span>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleTimer}
              className="hover:text-white/80 transition-colors flex items-center justify-center w-6 h-6"
            >
              {activeMode === viewMode ? (
                <Pause size={18} className="fill-white" />
              ) : (
                <Play size={18} className="fill-white" />
              )}
            </button>
          </div>
        </div>

        {/* Top Right */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Toggle Full Screen"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      {/* Cycle Completion Modal */}
      {cycleCompleted && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => resetCycle()}
        >
          <div
            className="bg-black/40 border border-white/10 backdrop-blur-xl p-8 rounded-3xl max-w-sm w-full mx-4 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <RotateCcw
              className={`mx-auto mb-4 animate-pulse ${currentTheme.textAccent}`}
              size={40}
            />
            <p className="text-3xl font-bold text-white mb-4">
              Cycle Complete!
            </p>
            <p className="text-lg text-white/80 mb-8">
              Great work! You completed one focus session and a break.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => resetCycle()}
                className="flex-1 bg-white/20 hover:bg-white/30 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-colors"
              >
                Start New Cycle
              </button>
              <button
                onClick={() => setCycleCompleted(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Center UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-16">
        <div className="relative flex items-center justify-center">
          {/* SVG Ring */}
          <svg
            height={circleMetrics.radius * 2}
            width={circleMetrics.radius * 2}
            className="drop-shadow-2xl"
            style={{ transform: `rotate(${circleMetrics.rotation}deg)` }}
          >
            <circle
              stroke="white"
              strokeWidth={12}
              strokeOpacity="0.15"
              fill="transparent"
              r={circleMetrics.normalizedRadius}
              cx={circleMetrics.radius}
              cy={circleMetrics.radius}
              strokeDasharray={`${circleMetrics.visibleArcLength} ${circleMetrics.gapLength}`}
              strokeLinecap="round"
            />
            <circle
              className="stroke-white"
              strokeWidth={12}
              strokeDasharray={`${circleMetrics.currentProgressArc} ${circleMetrics.circumference}`}
              strokeLinecap="round"
              fill="transparent"
              r={circleMetrics.normalizedRadius}
              cx={circleMetrics.radius}
              cy={circleMetrics.radius}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center -mt-5">
            {/* Tabs */}
            <div className="flex items-center gap-8 mb-4">
              <button
                onClick={() => switchViewMode('focus')}
                className={`text-lg font-bold tracking-wider uppercase transition-all duration-300 border-b-2 pb-1 ${
                  viewMode === 'focus'
                    ? 'text-white border-white'
                    : 'text-white/40 border-transparent hover:text-white/70'
                }`}
              >
                Focus
              </button>
              <button
                onClick={() => switchViewMode('break')}
                className={`text-lg font-bold tracking-wider uppercase transition-all duration-300 border-b-2 pb-1 ${
                  viewMode === 'break'
                    ? 'text-white border-white'
                    : 'text-white/40 border-transparent hover:text-white/70'
                }`}
              >
                Break
              </button>
            </div>

            {/* Timer Digits */}
            <div className="flex items-center justify-center relative pl-8">
              {isEditing ? (
                <form
                  onSubmit={handleCustomSubmit}
                  className="flex flex-col items-center animate-fade-in"
                >
                  <input
                    type="number"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="text-[10rem] font-bold bg-transparent border-b border-white/30 focus:border-white outline-none text-center w-80 text-white placeholder-white/30 drop-shadow-md mb-2 leading-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none timer-display"
                    autoFocus
                  />
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                    >
                      Set
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  className="group cursor-pointer flex items-center justify-center"
                  onClick={() => {
                    setIsEditing(true);
                    setCustomMinutes(currentTimer.duration.toString());
                  }}
                >
                  <span
                    className={`text-[10rem] leading-none font-bold tracking-tighter drop-shadow-2xl tabular-nums timer-display`}
                  >
                    {formatTime(currentTimer.timeLeft, hideSeconds)}
                  </span>
                </div>
              )}

              <div className="relative ml-4 -mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                      <MoreHorizontal size={32} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-72 bg-black/90 border-white/20"
                  >
                    <DropdownMenuLabel className="flex items-center gap-2 px-2 py-1.5">
                      <div className="w-3 h-3 rounded-full border border-white/50 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      </div>
                      <span className="font-medium text-white text-sm">
                        Pomodoro
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem
                      onClick={() => {
                        if (activeMode) {
                          setTimers((p) => ({
                            ...p,
                            [activeMode]: { ...p[activeMode], timeLeft: 0 },
                          }));
                          setEndTime(Date.now());
                        }
                      }}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                      <Check size={16} /> Complete timer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        resetTimer();
                      }}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                      <RotateCcw size={16} /> Restart timer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={addTenMinutes}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                      <Plus size={16} /> Add 10 minutes
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/10" />

                    <div className="px-3 py-2">
                      <SoundSettings
                        soundEnabled={soundEnabled}
                        selectedSoundId={selectedSoundId}
                        onSoundEnabledChange={setSoundEnabled}
                        onSoundChange={handleSoundChange}
                      />
                    </div>

                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem
                      onClick={() => setHideSeconds(!hideSeconds)}
                      className="cursor-pointer flex items-center justify-between px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                      <span>Hide seconds</span>
                      <div
                        className={`w-8 h-4 rounded-full relative transition-colors ${
                          hideSeconds ? 'bg-white' : 'bg-white/20'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full bg-black absolute top-0.5 transition-all ${
                            hideSeconds ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="text-3xl font-bold text-white mb-8 uppercase">
              {viewMode === 'focus' ? 'Focus Timer' : 'Break Timer'}
            </div>

            <div className="flex items-center justify-center gap-6 z-20">
              <button
                onClick={toggleTimer}
                className={`
                  w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl
                  bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300
                  hover:scale-105 shadow-2xl group ring-1 ring-white/10
                `}
              >
                {activeMode === viewMode ? (
                  <Pause
                    size={24}
                    className="fill-white text-white"
                    strokeWidth={0}
                  />
                ) : (
                  <Play
                    size={24}
                    className="fill-white text-white ml-1"
                    strokeWidth={0}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
