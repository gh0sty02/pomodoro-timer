export type ViewMode = 'focus' | 'break';
export type ActiveMode = 'focus' | 'break' | null;

export interface TimerState {
  timeLeft: number; // in milliseconds
  duration: number; // in minutes
  initialTime: number; // in milliseconds
}

export interface TimersState {
  focus: TimerState;
  break: TimerState;
}

export interface Theme {
  id: string;
  bg: string;
  accent: string;
  textAccent: string;
  buttonBg: string;
  overlay: string;
}

export interface AudioContextRefs {
  audioCtx: AudioContext | null;
  rainNode: AudioBufferSourceNode | null;
  gainNode: GainNode | null;
}
