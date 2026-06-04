import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Search, Filter, Wallet, Utensils, Coffee, ArrowUpCircle, ArrowDownCircle, Cat, MoreHorizontal, Plus } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '@/src/lib/utils';
import { AddTransactionModal } from './AddTransactionModal';

export const Accounting = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState<'wallet' | 'taishin'>('wallet');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const [transactions, setTransactions] = useState([
    {
      date: '2024-10-24',
      items: [
        { title: '清爽檸檬沙拉', category: '餐錢', amount: -380, icon: Utensils, color: 'bg-cyan-50 text-cyan-500', account: 'wallet' },
        { title: '珍珠奶茶', category: '點心飲料', amount: -65, icon: Coffee, color: 'bg-blue-50 text-blue-500', account: 'wallet' },
        { title: '可可罐頭', category: '可可', amount: -450, icon: Cat, color: 'bg-orange-50 text-orange-500', account: 'wallet' },
      ]
    },
    {
      date: '2024-10-23',
      items: [
        { title: '接案收入', category: '收入', amount: 35000, icon: ArrowUpCircle, color: 'bg-green-50 text-green-500', isIncome: true, account: 'wallet' },
        { title: '匯出至儲蓄帳戶', category: '匯出', amount: -10000, icon: ArrowDownCircle, color: 'bg-blue-50 text-blue-500', account: 'wallet' },
        { title: '雜項支出', category: '其他', amount: -200, icon: MoreHorizontal, color: 'bg-slate-50 text-slate-500', account: 'wallet' },
      ]
    }
  ]);

  const filteredTransactions = useMemo(() => {
    return transactions.map(group => {
      const filteredItems = group.items.filter(item => {
        const matchesAccount = item.account === activeAccount;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesTime = true;
        if (activeAccount === 'wallet') {
          matchesTime = group.date.startsWith(selectedMonth);
        } else {
          matchesTime = group.date.startsWith(selectedYear);
        }

        return matchesAccount && matchesSearch && matchesTime;
      });

      return { ...group, items: filteredItems };
    }).filter(group => group.items.length > 0);
  }, [transactions, activeAccount, searchQuery, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    filteredTransactions.forEach(group => {
      group.items.forEach(item => {
        if (item.amount > 0) {
          totalIncome += item.amount;
        } else {
          totalExpense += Math.abs(item.amount);
          categoryTotals[item.category] = (categoryTotals[item.category] || 0) + Math.abs(item.amount);
        }
      });
    });

    const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: name === '餐錢' ? '#00BCD4' : 
             name === '點心飲料' ? '#81D4FA' : 
             name === '匯出' ? '#B2EBF2' : 
             name === '可可' ? '#FFCC80' : '#E0E0E0'
    }));

    return {
      balance: totalIncome - totalExpense,
      totalExpense,
      chartData
    };
  }, [filteredTransactions]);

  const handleAddTransaction = (newTx: any) => {
    const dateStr = newTx.time.toISOString().split('T')[0];
    setTransactions(prev => {
      const existingGroupIndex = prev.findIndex(g => g.date === dateStr);
      if (existingGroupIndex > -1) {
        const newGroups = [...prev];
        newGroups[existingGroupIndex] = {
          ...newGroups[existingGroupIndex],
          items: [newTx, ...newGroups[existingGroupIndex].items]
        };
        return newGroups;
      } else {
        return [{ date: dateStr, items: [newTx] }, ...prev].sort((a, b) => b.date.localeCompare(a.date));
      }
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return `今天, ${date.getMonth() + 1}月${date.getDate()}日`;
    if (dateStr === yesterday.toISOString().split('T')[0]) return `昨天, ${date.getMonth() + 1}月${date.getDate()}日`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Account Switcher */}
      <div className="flex gap-4 mb-12">
        <button
          onClick={() => setActiveAccount('wallet')}
          className={cn(
            "flex-1 py-6 rounded-3xl border-2 transition-all group relative overflow-hidden",
            activeAccount === 'wallet'
              ? "border-cyan-500 bg-cyan-50 shadow-xl shadow-cyan-100"
              : "border-white/40 bg-white/20 hover:bg-white/40"
          )}
        >
          <div className="relative z-10 flex flex-col items-center gap-2">
            <Wallet className={cn("w-8 h-8", activeAccount === 'wallet' ? "text-cyan-600" : "text-slate-400")} />
            <span className={cn("text-lg font-black", activeAccount === 'wallet' ? "text-cyan-900" : "text-slate-500")}>錢包</span>
          </div>
        </button>
        <button
          onClick={() => setActiveAccount('taishin')}
          className={cn(
            "flex-1 py-6 rounded-3xl border-2 transition-all group relative overflow-hidden",
            activeAccount === 'taishin'
              ? "border-cyan-500 bg-cyan-50 shadow-xl shadow-cyan-100"
              : "border-white/40 bg-white/20 hover:bg-white/40"
          )}
        >
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">台</div>
            <span className={cn("text-lg font-black", activeAccount === 'taishin' ? "text-cyan-900" : "text-slate-500")}>台新小查罐</span>
          </div>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Transaction History */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h2 className="text-4xl font-black text-slate-800">交易歷史</h2>
              <p className="text-slate-500">
                {activeAccount === 'wallet' ? `${selectedMonth} 的消費紀錄` : `${selectedYear} 的儲蓄紀錄`}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜尋項目或分類..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/40 border-none rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </div>
              {activeAccount === 'wallet' ? (
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 bg-white/40 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-cyan-500"
                />
              ) : (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 bg-white/40 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-cyan-500"
                >
                  {['2023', '2024', '2025', '2026'].map(y => (
                    <option key={y} value={y}>{y}年</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((group, i) => (
                <div key={i}>
                  <h3 className="text-xs font-bold text-slate-400 mb-4 px-1">{formatDate(group.date)}</h3>
                  <div className="space-y-3">
                    {group.items.map((item, j) => (
                      <div key={j} className="bg-white/40 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/60 transition-all cursor-pointer">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.color)}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{item.title}</h4>
                          <p className="text-xs text-slate-400">{item.category}</p>
                        </div>
                        <div className={cn("text-lg font-black", item.amount > 0 ? "text-green-500" : "text-red-400")}>
                          {item.amount > 0 ? '+' : '-'}${Math.abs(item.amount).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold">找不到符合條件的交易</p>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Sidebar */}
        <div className="w-full lg:w-96 space-y-8">
          <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-8">本月支出</h3>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-xs font-bold text-slate-400">總支出</div>
                <div className="text-3xl font-black text-slate-800">${stats.totalExpense.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              {stats.chartData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-600">{item.name} (${item.value.toLocaleString()})</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="bg-cyan-500 rounded-2xl p-8 text-white shadow-xl shadow-cyan-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold opacity-80 mb-1">目前餘額</div>
              <div className="text-4xl font-black">${stats.balance.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
               <Wallet className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-cyan-500 text-white rounded-2xl shadow-2xl shadow-cyan-200 flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <Plus className="w-8 h-8" />
      </button>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTransaction} 
      />
    </div>
  );
};
