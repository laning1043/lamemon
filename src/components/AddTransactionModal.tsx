import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Utensils, Coffee, ArrowUpCircle, ArrowDownCircle, Cat, MoreHorizontal } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: any) => void;
}

export const AddTransactionModal = ({ isOpen, onClose, onAdd }: AddTransactionModalProps) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('餐錢');
  const [account, setAccount] = useState('wallet');
  const [time, setTime] = useState(new Date().toISOString().slice(0, 16));

  const categories = [
    { name: '餐錢', icon: Utensils, color: 'bg-cyan-50 text-cyan-500' },
    { name: '點心飲料', icon: Coffee, color: 'bg-blue-50 text-blue-500' },
    { name: '收入', icon: ArrowUpCircle, color: 'bg-green-50 text-green-500', isIncome: true },
    { name: '匯出', icon: ArrowDownCircle, color: 'bg-blue-50 text-blue-500' },
    { name: '可可', icon: Cat, color: 'bg-orange-50 text-orange-500' },
    { name: '其他', icon: MoreHorizontal, color: 'bg-slate-50 text-slate-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !title) return;

    const selectedCategory = categories.find(c => c.name === category);
    
    onAdd({
      title,
      category,
      account,
      amount: selectedCategory?.isIncome ? parseFloat(amount) : -parseFloat(amount),
      icon: selectedCategory?.icon,
      color: selectedCategory?.color,
      isIncome: selectedCategory?.isIncome,
      time: new Date(time)
    });

    setAmount('');
    setTitle('');
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
            className="w-full max-w-lg relative"
          >
            <GlassCard className="p-8 shadow-2xl border border-white/60">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">新增交易</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">項目名稱</label>
                  <input
                    autoFocus
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例如：午餐、薪資..."
                    className="w-full bg-white/50 border-none rounded-xl p-4 text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">金額</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/50 border-none rounded-xl p-4 text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">時間</label>
                    <input
                      type="datetime-local"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-white/50 border-none rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">帳戶</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setAccount('wallet')}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                        account === 'wallet'
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                          : 'border-transparent bg-white/30 text-slate-500 hover:bg-white/50'
                      }`}
                    >
                      錢包
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccount('taishin')}
                      className={`flex-1 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                        account === 'taishin'
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                          : 'border-transparent bg-white/30 text-slate-500 hover:bg-white/50'
                      }`}
                    >
                      台新小查罐
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">分類</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setCategory(cat.name)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          category === cat.name
                            ? 'border-cyan-500 bg-cyan-50/50'
                            : 'border-transparent bg-white/30 hover:bg-white/50'
                        }`}
                      >
                        <cat.icon className={`w-5 h-5 ${category === cat.name ? 'text-cyan-600' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-bold ${category === cat.name ? 'text-cyan-700' : 'text-slate-500'}`}>
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-cyan-200 hover:bg-cyan-600 transition-all mt-4"
                >
                  確認新增
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
