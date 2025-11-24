export const formatTime = (
  ms: number,
  hideSeconds: boolean = false
): string => {
  const totalSeconds = Math.ceil(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (hideSeconds) return `${mins}`;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

export const formatTotalTime = (totalMins: number): string => {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export interface CircleMetrics {
  radius: number;
  normalizedRadius: number;
  circumference: number;
  visibleArcLength: number;
  gapLength: number;
  currentProgressArc: number;
  rotation: number;
}

export const calculateCircleMetrics = (
  initialTime: number,
  timeLeft: number
): CircleMetrics => {
  const radius = 290;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const visibleDegrees = 260;
  const visibleArcLength = circumference * (visibleDegrees / 360);
  const gapLength = circumference * ((360 - visibleDegrees) / 360);

  const timeElapsed = initialTime - timeLeft;
  const progressFraction = Math.max(0, Math.min(1, timeElapsed / initialTime));
  const currentProgressArc = visibleArcLength * progressFraction;
  const rotation = 90 + (360 - visibleDegrees) / 2;

  return {
    radius,
    normalizedRadius,
    circumference,
    visibleArcLength,
    gapLength,
    currentProgressArc,
    rotation,
  };
};

export const fetchGeminiTip = async (apiKey: string): Promise<string> => {
  const prompt =
    'Give me a single, very short (max 10 words), abstract nature metaphor for patience and focus. No quotes.';

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await response.json();
    const tip =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'The mountain waits for no one.';
    return tip;
  } catch {
    return 'Silence is the root of everything.';
  }
};
