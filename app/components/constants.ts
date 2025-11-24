import type { Theme } from './types';

export const SCENIC_THEMES: Theme[] = [
  {
    id: 'mountain-peak',
    bg: '/pexels-pixabay-247599.jpg',
    accent: 'stroke-cyan-200',
    textAccent: 'text-cyan-100',
    buttonBg: 'bg-cyan-500/20 hover:bg-cyan-500/40',
    overlay: 'bg-sky-950/30',
  },
  {
    id: 'deep-forest',
    bg: '/pexels-eberhardgross-691668.jpg',
    accent: 'stroke-emerald-300',
    textAccent: 'text-emerald-100',
    buttonBg: 'bg-emerald-500/20 hover:bg-emerald-500/40',
    overlay: 'bg-green-950/40',
  },
  {
    id: 'calm-ocean',
    bg: '/pexels-pixabay-257092.jpg',
    accent: 'stroke-teal-200',
    textAccent: 'text-teal-100',
    buttonBg: 'bg-teal-500/20 hover:bg-teal-500/40',
    overlay: 'bg-teal-950/20',
  },
  {
    id: 'rainy-glass',
    bg: '/pexels-jean-francois-frenel-2157629552-34845155.jpg',
    accent: 'stroke-slate-300',
    textAccent: 'text-slate-200',
    buttonBg: 'bg-slate-500/20 hover:bg-slate-500/40',
    overlay: 'bg-gray-950/50',
  },
  {
    id: 'starry-sky',
    bg: '/pexels-pixabay-355465.jpg',
    accent: 'stroke-indigo-300',
    textAccent: 'text-indigo-100',
    buttonBg: 'bg-indigo-500/20 hover:bg-indigo-500/40',
    overlay: 'bg-indigo-950/40',
  },
  {
    id: 'golden-sunset',
    bg: '/pexels-lum3n-44775-167699.jpg',
    accent: 'stroke-amber-300',
    textAccent: 'text-amber-100',
    buttonBg: 'bg-amber-500/20 hover:bg-amber-500/40',
    overlay: 'bg-orange-950/20',
  },
  {
    id: 'desert-sands',
    bg: '/pexels-pixabay-417173.jpg',
    accent: 'stroke-orange-300',
    textAccent: 'text-orange-100',
    buttonBg: 'bg-orange-500/20 hover:bg-orange-500/40',
    overlay: 'bg-orange-950/10',
  },
  {
    id: 'snowy-trees',
    bg: '/pexels-joyston-judah-331625-933054.jpg',
    accent: 'stroke-blue-200',
    textAccent: 'text-blue-100',
    buttonBg: 'bg-blue-500/20 hover:bg-blue-500/40',
    overlay: 'bg-slate-900/20',
  },
  {
    id: 'autumn-road',
    bg: '/pexels-kabita-darlami-2613403-32921242.jpg',
    accent: 'stroke-red-300',
    textAccent: 'text-red-100',
    buttonBg: 'bg-red-500/20 hover:bg-red-500/40',
    overlay: 'bg-red-950/20',
  },
  {
    id: 'soft-clouds',
    bg: '/pexels-bri-schneiter-28802-346529.jpg',
    accent: 'stroke-rose-200',
    textAccent: 'text-rose-100',
    buttonBg: 'bg-rose-500/20 hover:bg-rose-500/40',
    overlay: 'bg-rose-950/20',
  },
];

export const INITIAL_FOCUS_MINUTES = 25;
export const INITIAL_BREAK_MINUTES = 5;
