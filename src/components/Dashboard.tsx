import React from 'react';
import { Cloud, CheckCircle2, ArrowUpRight, Plus } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <GlassCard className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500/10 p-1.5 rounded-lg">
                <div className="w-4 h-4 bg-cyan-500 rounded-sm" />
              </div>
              <h3 className="font-bold text-slate-700">今日行程</h3>
            </div>
            <span className="text-xs font-bold text-cyan-600 bg-cyan-50 py-1 px-3 rounded-full">10月24日</span>
          </div>
          
          <div className="space-y-4">
            {[
              { time: '09:00', end: '10:30', title: '設計衝刺啟動會議', location: '戰略會議室 • 遠端', color: 'bg-white/60' },
              { time: '12:00', end: '13:00', title: '與團隊午餐', location: '綠意露台咖啡廳', color: 'bg-cyan-50/60', active: true },
              { time: '15:00', end: '16:00', title: '應用程式作品集審查', location: 'Microsoft Teams', color: 'bg-white/60' },
            ].map((item, i) => (
              <div key={i} className={cn("p-4 rounded-2xl flex gap-4", item.color)}>
                <div className="text-xs font-bold text-slate-400 w-12 pt-1">
                  <div>{item.time}</div>
                  <div className="mt-4 opacity-50">{item.end}</div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    {item.active && <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />}
                    {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Todos */}
        <GlassCard className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-cyan-600 w-5 h-5" />
              <h3 className="font-bold text-slate-700">待辦事項</h3>
            </div>
            <button className="text-xs font-bold text-slate-400 hover:text-cyan-600 transition-colors">查看全部</button>
          </div>
          
          <div className="space-y-3">
            {[
              { title: '完成玻璃擬態 UI 組件', project: '專案: Lamemon 核心', checked: true, icon: 'flag' },
              { title: '準備月度支出報告', project: '財務 • 期限今日', checked: false, icon: 'alert' },
              { title: '審閱備忘錄模組反饋', project: '反饋 • 明日', checked: false, icon: 'clock' },
            ].map((item, i) => (
              <div key={i} className="bg-white/40 p-4 rounded-2xl flex items-center gap-4">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  item.checked ? "bg-cyan-500 border-cyan-500" : "border-slate-300"
                )}>
                  {item.checked && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <h4 className={cn("font-bold text-slate-800", item.checked && "line-through text-slate-400")}>{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.project}</p>
                </div>
                {item.icon === 'flag' && <div className="w-4 h-4 bg-slate-200 rounded-sm" />}
                {item.icon === 'alert' && <div className="w-1 h-4 bg-cyan-400 rounded-full" />}
                {item.icon === 'clock' && <div className="w-4 h-4 rounded-full border-2 border-slate-300" />}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Monthly Spending */}
        <GlassCard className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500/10 p-1.5 rounded-lg">
                <div className="w-4 h-4 bg-cyan-500 rounded-sm" />
              </div>
              <h3 className="font-bold text-slate-700">本月支出</h3>
            </div>
            <span className="text-xs font-bold text-cyan-600 bg-cyan-50 py-1 px-3 rounded-full">十月</span>
          </div>
          
          <div className="flex flex-col items-center py-4">
            <div className="text-xs font-bold text-cyan-600 mb-1">總支出額</div>
            <div className="text-5xl font-black text-slate-800">$1,240.00</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500">預算使用率</span>
              <span className="text-slate-800">62%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-green-300 w-[62%]" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${i}/32/32`} alt="" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">+4</div>
              </div>
              <div className="text-xs font-bold text-slate-500">剩餘可用: $760.00</div>
            </div>
          </div>
        </GlassCard>

        {/* Notes */}
        <GlassCard className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500/10 p-1.5 rounded-lg">
                <div className="w-4 h-4 bg-cyan-500 rounded-sm" />
              </div>
              <h3 className="font-bold text-slate-700">備忘錄</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">2小時前</span>
          </div>
          
          <div className="bg-white/40 p-6 rounded-2xl relative group cursor-pointer hover:bg-white/60 transition-all">
            <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-cyan-300 group-hover:text-cyan-500 transition-colors" />
            <h4 className="text-xl font-bold text-slate-800 mb-2">專案腦力激盪：2024 視覺風格</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              「美學應聚焦於清新的冰晶藍色調，並結合深層的玻璃擬態背景。在冷色調中務必優先考量可訪問性的對比度...」
            </p>
            <div className="flex gap-2">
              {['設計', '策略', '核心'].map(tag => (
                <span key={tag} className="text-[10px] font-bold px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
