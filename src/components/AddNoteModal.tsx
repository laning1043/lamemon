import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (note: { title: string; content: string; category: string }) => void;
  categories: string[];
}

export const AddNoteModal = ({ isOpen, onClose, onAdd, categories }: AddNoteModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('未分類');
  const [newCategory, setNewCategory] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    onAdd({ 
      title, 
      content, 
      category: isAddingNew ? newCategory : category 
    });
    setTitle('');
    setContent('');
    setCategory('未分類');
    setNewCategory('');
    setIsAddingNew(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl relative"
          >
            <GlassCard className="p-8 shadow-2xl border border-white/60">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">新增備忘錄</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">分類</label>
                  <div className="flex gap-2">
                    {!isAddingNew ? (
                      <select
                        value={category}
                        onChange={(e) => {
                          if (e.target.value === 'new') {
                            setIsAddingNew(true);
                          } else {
                            setCategory(e.target.value);
                          }
                        }}
                        className="flex-1 bg-white/50 border-none rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-cyan-500 transition-all font-bold"
                      >
                        {categories.filter(c => c !== '全部').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="new">+ 新增分類...</option>
                      </select>
                    ) : (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="輸入新分類名稱..."
                          className="flex-1 bg-white/50 border-none rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-cyan-500 transition-all font-bold"
                        />
                        <button 
                          type="button"
                          onClick={() => setIsAddingNew(false)}
                          className="px-4 text-slate-400 hover:text-slate-600 font-bold"
                        >
                          取消
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">主題</label>
                  <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="輸入備忘錄主題..."
                    className="w-full bg-white/50 border-none rounded-xl p-4 text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-cyan-500 transition-all text-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">內文</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="在此輸入詳細內容..."
                    rows={8}
                    className="w-full bg-white/50 border-none rounded-xl p-4 text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-cyan-500 transition-all resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-600 transition-all mt-4"
                >
                  儲存備忘錄
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
