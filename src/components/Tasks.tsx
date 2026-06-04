import React, { useState, useMemo } from 'react';
import { CheckCircle2, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '@/src/lib/utils';
import { CalendarPicker } from './CalendarPicker';
import { AnimatePresence } from 'motion/react';

export const Tasks = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    // Get Monday of the current week
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const dayNames = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push({
        name: dayNames[i],
        date: d.getDate(),
        fullDate: d,
        active: d.toDateString() === selectedDate.toDateString()
      });
    }
    return days;
  }, [selectedDate]);

  const formattedDate = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', weekday: 'long' };
    return selectedDate.toLocaleDateString('zh-TW', options);
  }, [selectedDate]);

  // Simulated tasks that change slightly based on the date
  const tasks = useMemo(() => {
    const daySeed = selectedDate.getDate();
    const baseTasks = [
      { title: '設計 Lamemon 品牌識別系統', category: '設計', checked: daySeed % 2 === 0, color: 'bg-cyan-100 text-cyan-700' },
      { title: '撰寫冰晶藍主題專案提報', category: '專案', checked: daySeed % 3 === 0, color: 'bg-blue-100 text-blue-700' },
      { title: '回顧第四季度生產力目標', category: '策略', checked: false, color: 'bg-orange-100 text-orange-700' },
      { title: '下午 2 點每週團隊同步會議', category: '團隊', checked: false, color: 'bg-purple-100 text-purple-700' },
      { title: '完成每日玻璃擬態 UI 挑戰', category: '設計', checked: false, color: 'bg-cyan-100 text-cyan-700' },
    ];
    
    // Add a unique task for each day to show it's actually switching
    if (daySeed % 5 === 0) {
      baseTasks.push({ title: '特別任務：系統維護', category: '技術', checked: false, color: 'bg-slate-100 text-slate-700' });
    }

    return baseTasks;
  }, [selectedDate]);

  const completedCount = tasks.filter(t => t.checked).length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10 flex justify-between items-start">
        <div>
          <h2 className="text-5xl font-extrabold tracking-tight mb-2 text-slate-800">{formattedDate}</h2>
          <p className="text-slate-500 text-lg flex items-center gap-2">
            <CheckCircle2 className="text-cyan-600 w-5 h-5" />
            今天已完成 {tasks.length} 個任務中的 {completedCount} 個
          </p>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowCalendar(!showCalendar)}
            className={cn(
              "p-3 rounded-2xl glass-morphism transition-all border-white/40",
              showCalendar ? "bg-cyan-500 text-white shadow-lg shadow-cyan-200" : "text-cyan-600 hover:bg-cyan-50"
            )}
            title="選擇日期"
          >
            <CalendarIcon className="w-6 h-6" />
          </button>
          
          <AnimatePresence>
            {showCalendar && (
              <CalendarPicker 
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Calendar Strip */}
      <div className="mb-12 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 pb-2">
          {weekDays.map((day) => (
            <button 
              key={day.fullDate.getTime()}
              onClick={() => setSelectedDate(day.fullDate)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl transition-all",
                day.active 
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-200" 
                  : "glass-morphism text-slate-400 border-white/40 hover:bg-white/40"
              )}
            >
              <span className="text-[10px] font-bold uppercase">{day.name}</span>
              <span className="text-xl font-bold">{day.date}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <section className="space-y-4 mb-24">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">待辦清單</h3>
        {tasks.map((task, i) => (
          <label 
            key={i} 
            className="group flex items-center p-4 rounded-2xl glass-morphism cursor-pointer hover:bg-white/60 transition-all border-white/40"
          >
            <div className="relative flex items-center justify-center mr-4">
              <input 
                type="checkbox" 
                defaultChecked={task.checked}
                className="peer size-6 rounded-full border-2 border-cyan-400 text-cyan-400 focus:ring-cyan-500 focus:ring-offset-0 bg-transparent checked:bg-cyan-400"
              />
            </div>
            <span className={cn("text-lg font-medium text-slate-700", task.checked && "line-through text-slate-400")}>
              {task.title}
            </span>
            <span className={cn("ml-auto flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold", task.color)}>
              {task.category}
            </span>
          </label>
        ))}
      </section>

      {/* Add Task Input */}
      <footer className="fixed bottom-8 left-0 right-0 z-50 px-6">
        <div className="max-w-2xl mx-auto glass-morphism rounded-2xl p-2 shadow-2xl flex items-center gap-2 border border-white/60">
          <div className="flex-1 flex items-center px-4">
            <Plus className="text-cyan-600 mr-3 w-5 h-5" />
            <input 
              className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder:text-slate-400 py-3 text-slate-700" 
              placeholder="新增任務..." 
              type="text"
            />
          </div>
          <button className="w-12 h-12 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-200 hover:scale-105 transition-transform">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </footer>
    </div>
  );
};
