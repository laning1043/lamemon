import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface CalendarPickerProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedDate, onSelect, onClose }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  // Adjust for Monday start (0: Sun -> 6, 1: Mon -> 0)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthName = viewDate.toLocaleDateString('zh-TW', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const days = [];
  // Previous month days
  const prevMonthDays = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      month: 'prev',
      date: new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, prevMonthDays - i)
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      month: 'current',
      date: new Date(viewDate.getFullYear(), viewDate.getMonth(), i)
    });
  }

  // Next month days
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      month: 'next',
      date: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, i)
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className="absolute top-full right-0 mt-4 z-[100] w-80 glass-morphism rounded-3xl shadow-2xl border border-white/60 p-6 overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-slate-800">{monthName}</h4>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['一', '二', '三', '四', '五', '六', '日'].map(d => (
          <div key={d} className="text-[10px] font-bold text-slate-400 text-center py-2 uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const isSelected = d.date.toDateString() === selectedDate.toDateString();
          const isToday = d.date.toDateString() === new Date().toDateString();
          const isCurrentMonth = d.month === 'current';

          return (
            <button
              key={i}
              onClick={() => {
                onSelect(d.date);
                onClose();
              }}
              className={cn(
                "h-10 rounded-xl text-sm font-medium transition-all flex items-center justify-center relative",
                isSelected 
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-200" 
                  : isCurrentMonth 
                    ? "hover:bg-cyan-50 text-slate-700" 
                    : "text-slate-300",
                isToday && !isSelected && "after:content-[''] after:absolute after:bottom-1.5 after:w-1 after:h-1 after:bg-cyan-500 after:rounded-full"
              )}
            >
              {d.day}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
        <button 
          onClick={() => {
            onSelect(new Date());
            onClose();
          }}
          className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
        >
          回到今天
        </button>
        <button 
          onClick={onClose}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
        >
          取消
        </button>
      </div>
    </motion.div>
  );
};
