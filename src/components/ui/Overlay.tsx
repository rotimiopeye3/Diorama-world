import { Sun, Moon, Zap, Plus } from 'lucide-react';
import { useWorldStore } from '../../store/useWorldStore';
import { motion } from 'motion/react';

export function Overlay() {
  const { isDay, powerLevel, toggleDayNight, setPowerLevel, addCommit } = useWorldStore();

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-8">
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tighter text-white mix-blend-difference">
            DIORAMA <span className="text-teal-400">WORLD</span>
          </h1>
          <p className="text-xs font-mono text-white/50 uppercase tracking-[0.3em]">
            Technical Progression Metaphor
          </p>
        </div>

        <button
          onClick={toggleDayNight}
          className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95"
        >
          {isDay ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 pointer-events-auto">
        {/* Power Level Slider */}
        <div className="w-full md:w-64 space-y-4 bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-teal-400">
              <Zap size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Power Level</span>
            </div>
            <span className="text-xs font-mono text-white">{Math.round(powerLevel * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={powerLevel}
            onChange={(e) => setPowerLevel(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
        </div>

        {/* Commit Log / Actions */}
        <div className="flex flex-col items-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => addCommit(`Commit ${Math.floor(Math.random() * 1000)}`)}
            className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-black font-bold rounded-full shadow-lg shadow-teal-500/20 hover:bg-teal-400 transition-colors"
          >
            <Plus size={18} />
            GENERATE LEGACY
          </motion.button>
          
          <div className="text-right">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              System Status: Nominal
            </p>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              Environment: Production
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
