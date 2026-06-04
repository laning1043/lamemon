import React from 'react';
import { X, Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEventModal = ({ isOpen, onClose }: AddEventModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] px-6"
          >
            <div className="glass-morphism rounded-3xl p-8 shadow-2xl border-white/60">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800">新增事件</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">標題</label>
                  <input 
                    type="text" 
                    placeholder="正在發生什麼事？"
                    className="w-full bg-white/30 border border-white/50 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">開始時間</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        defaultValue="10:00 AM"
                        className="w-full bg-white/30 border border-white/50 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">結束時間</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        defaultValue="11:30 AM"
                        className="w-full bg-white/30 border border-white/50 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">重複</label>
                  <div className="relative">
                    <select className="w-full bg-white/30 border border-white/50 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-slate-700 appearance-none">
                      <option>不重複</option>
                      <option>每日</option>
                      <option>每週</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">分類</label>
                  <div className="flex gap-2">
                    {[
                      { label: '工作', color: 'bg-cyan-400', active: true },
                      { label: '個人', color: 'bg-orange-400' },
                      { label: '健康', color: 'bg-yellow-400' },
                    ].map(cat => (
                      <button 
                        key={cat.label}
                        className={cn(
                          "flex-1 py-2 rounded-xl flex items-center justify-center gap-2 border transition-all",
                          cat.active ? "bg-white/60 border-cyan-400 text-slate-800" : "bg-white/20 border-white/50 text-slate-500"
                        )}
                      >
                        <div className={cn("w-2 h-2 rounded-full", cat.color)} />
                        <span className="text-xs font-bold">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    onClick={onClose}
                    className="py-4 rounded-2xl font-bold text-slate-600 bg-white/40 hover:bg-white/60 transition-all border border-white/50"
                  >
                    取消
                  </button>
                  <button className="py-4 rounded-2xl font-bold text-cyan-900 bg-cyan-200 hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-100">
                    儲存事件
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
