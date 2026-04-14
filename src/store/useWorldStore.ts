import { create } from 'zustand';

interface WorldState {
  isDay: boolean;
  powerLevel: number;
  commits: string[];
  activeBiome: 'all' | 'volcano' | 'snow' | 'ocean';
  toggleDayNight: () => void;
  setPowerLevel: (level: number) => void;
  addCommit: (message: string) => void;
  setActiveBiome: (biome: 'all' | 'volcano' | 'snow' | 'ocean') => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  isDay: true,
  powerLevel: 0.5,
  commits: ['Initial Commit', 'Added 3D Scene', 'Implemented Shaders'],
  activeBiome: 'all',
  toggleDayNight: () => set((state) => ({ isDay: !state.isDay })),
  setPowerLevel: (level) => set({ powerLevel: level }),
  addCommit: (message) => set((state) => ({ commits: [...state.commits, message] })),
  setActiveBiome: (biome) => set({ activeBiome: biome }),
}));
