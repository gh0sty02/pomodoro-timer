# Pomodoro Timer

A beautiful, feature-rich Pomodoro timer built with **Next.js 16**, **TypeScript**, **React**, and **Tailwind CSS**. Helps you manage work and break sessions with scenic background images and ambient sound effects.

## ✨ Features

- **Classic Pomodoro Workflow**: 25-minute focus sessions followed by 5-minute breaks
- **Customizable Timers**: Adjust focus and break durations on the fly
- **Random Scenic Backgrounds**: 10 high-quality local images that randomize on each session
- **Ambient Sound Effects**:
  - Calming rain sound during active timers
  - Bell chime on session completion
  - Toggle sound on/off anytime
- **Time Tracking**: Accumulates total focus time across sessions
- **Cycle Completion Modal**: Shows when a focus+break cycle completes, preventing auto-restart
- **Fullscreen Mode**: Immersive distraction-free experience
- **Theme Colors**: Each background image has coordinated accent colors
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd pomodoro

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```
## 🎨 Background Images

10 high-resolution scenic images (7301×4873 px) from Pexels:

- Mountain landscapes
- Nature scenes
- Scenic vistas

Each image includes coordinated accent colors for UI elements.

## 🔊 Audio Features

### Rain Sound

- Generated using Web Audio API noise synthesis
- Lowpass filter for realistic effect
- Smooth fade-in/out

### Bell Chime

- Oscillator-based sound
- Frequency sweep for realistic bell tone
- Plays on focus/break completion

### Sound Toggle

- Enable/disable anytime
- Preference persists during session

## ⌨️ Usage

### Basic Controls

- **Play/Pause**: Start or pause the active timer
- **Reset**: Reset current timer to initial duration
- **+10 Min**: Add 10 minutes to current session
- **Next**: Switch between focus and break views

### Settings

- **Edit Duration**: Click timer to customize focus/break minutes
- **Fullscreen**: Immersive distraction-free mode
- **Sound Toggle**: Enable/disable audio effects
- **Hide Seconds**: Show only minutes in timer display
- **Menu**: Access settings and controls


## 📝 License

Open source - feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions welcome! Feel free to submit issues or pull requests.

---

**Happy focusing! 🍅**
