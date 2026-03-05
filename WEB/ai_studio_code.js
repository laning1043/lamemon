const { useState, useMemo, useEffect, useRef } = React;
const { motion, AnimatePresence } = window.Motion;

// --- 通用組件 ---

const Icon = ({ name, className }) => {
    useEffect(() => {
        if (window.lucide) {
            lucide.createIcons();
        }
    }, [name]);
    return <i data-lucide={name} className={className}></i>;
};

const GlassCard = ({ children, className = "" }) => (
    <div className={`glass-morphism rounded-3xl p-6 shadow-xl ${className}`}>
        {children}
    </div>
);

// --- 日曆選擇器組件 ---

const CalendarPicker = ({ selectedDate, onSelect, onClose }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const monthName = viewDate.toLocaleDateString('zh-TW', { month: 'long', year: 'numeric' });

    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    const days = [];
    const prevMonthDays = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();
    
    for (let i = startOffset - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, month: 'prev', date: new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, prevMonthDays - i) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, month: 'current', date: new Date(viewDate.getFullYear(), viewDate.getMonth(), i) });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, month: 'next', date: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, i) });
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
                        <Icon name="chevron-left" className="w-4 h-4" />
                    </button>
                    <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        <Icon name="chevron-right" className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['一', '二', '三', '四', '五', '六', '日'].map(d => (
                    <div key={d} className="text-[10px] font-bold text-slate-400 text-center py-2 uppercase tracking-widest">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => {
                    const isSelected = d.date.toDateString() === selectedDate.toDateString();
                    const isToday = d.date.toDateString() === new Date().toDateString();
                    return (
                        <button
                            key={i}
                            onClick={() => { onSelect(d.date); onClose(); }}
                            className={`h-10 rounded-xl text-sm font-medium transition-all flex items-center justify-center relative ${
                                isSelected ? "bg-cyan-500 text-white shadow-lg" : d.month === 'current' ? "hover:bg-cyan-50 text-slate-700" : "text-slate-300"
                            }`}
                        >
                            {d.day}
                            {isToday && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 bg-cyan-500 rounded-full"></div>}
                        </button>
                    );
                })}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <button onClick={() => { onSelect(new Date()); onClose(); }} className="text-xs font-bold text-cyan-600">回到今天</button>
                <button onClick={onClose} className="text-xs font-bold text-slate-400">取消</button>
            </div>
        </motion.div>
    );
};

// --- 導航欄組件 ---

const Header = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', label: '首頁', icon: 'layout-dashboard' },
        { id: 'tasks', label: '代辦事項', icon: 'check-square' },
        { id: 'accounting', label: '記帳', icon: 'wallet' },
        { id: 'notes', label: '備忘錄', icon: 'notebook-pen' },
    ];

    return (
        <header className="sticky top-0 z-50 glass-morphism px-6 lg:px-20 py-4 flex items-center justify-between border-b border-cyan-100">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-200 shadow-sm">
                        <img src="https://storage.googleapis.com/generativeai-downloads/images/lemon_logo.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-cyan-900">Lamemon</h1>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`text-sm font-medium transition-all relative py-1 ${activeTab === item.id ? "text-cyan-900 font-bold" : "text-slate-500 hover:text-cyan-700"}`}
                        >
                            {item.label}
                            {activeTab === item.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-cyan-900 overflow-hidden border border-cyan-200">
                <img src="https://picsum.photos/seed/alex/100/100" alt="Avatar" className="w-full h-full object-cover" />
            </div>
        </header>
    );
};

// --- 儀表板頁面 ---

const Dashboard = () => (
    <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <GlassCard className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-white/20 rounded-lg"><Icon name="check-square" className="w-6 h-6" /></div>
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">今日進度</span>
                </div>
                <h3 className="text-4xl font-bold mb-1">85%</h3>
                <p className="text-white/80 text-sm">已完成 12 個任務中的 10 個</p>
            </GlassCard>
            <GlassCard>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Icon name="wallet" className="w-6 h-6" /></div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">本月支出</span>
                </div>
                <h3 className="text-4xl font-bold text-slate-800 mb-1">$12,450</h3>
                <p className="text-slate-500 text-sm">較上月減少 15%</p>
            </GlassCard>
            <GlassCard>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Icon name="notebook-pen" className="w-6 h-6" /></div>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">備忘錄</span>
                </div>
                <h3 className="text-4xl font-bold text-slate-800 mb-1">24</h3>
                <p className="text-slate-500 text-sm">本週新增 3 則筆記</p>
            </GlassCard>
        </div>
    </div>
);

// --- 任務頁面 ---

const Tasks = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const weekDays = useMemo(() => {
        const days = [];
        const startOfWeek = new Date(selectedDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        const dayNames = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            days.push({ name: dayNames[i], date: d.getDate(), fullDate: d, active: d.toDateString() === selectedDate.toDateString() });
        }
        return days;
    }, [selectedDate]);

    const formattedDate = selectedDate.toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' });

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="mb-10 flex justify-between items-start">
                <div>
                    <h2 className="text-5xl font-extrabold tracking-tight mb-2 text-slate-800">{formattedDate}</h2>
                    <p className="text-slate-500 text-lg flex items-center gap-2">
                        <Icon name="check-circle-2" className="text-cyan-600 w-5 h-5" />
                        今日任務進度良好
                    </p>
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setShowCalendar(!showCalendar)}
                        className={`p-3 rounded-2xl glass-morphism transition-all border-white/40 ${showCalendar ? "bg-cyan-500 text-white shadow-lg" : "text-cyan-600 hover:bg-cyan-50"}`}
                    >
                        <Icon name="calendar" className="w-6 h-6" />
                    </button>
                    <AnimatePresence>
                        {showCalendar && (
                            <CalendarPicker selectedDate={selectedDate} onSelect={setSelectedDate} onClose={() => setShowCalendar(false)} />
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <div className="mb-12 overflow-x-auto no-scrollbar">
                <div className="flex gap-4 pb-2">
                    {weekDays.map((day) => (
                        <button 
                            key={day.fullDate.getTime()}
                            onClick={() => setSelectedDate(day.fullDate)}
                            className={`flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl transition-all ${day.active ? "bg-cyan-500 text-white shadow-lg" : "glass-morphism text-slate-400 hover:bg-white/40"}`}
                        >
                            <span className="text-[10px] font-bold uppercase">{day.name}</span>
                            <span className="text-xl font-bold">{day.date}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 主應用程式 ---

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="min-h-screen">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <main>
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'tasks' && <Tasks />}
                {activeTab === 'accounting' && <div className="p-20 text-center text-slate-400">記帳功能開發中...</div>}
                {activeTab === 'notes' && <div className="p-20 text-center text-slate-400">備忘錄功能開發中...</div>}
            </main>
        </div>
    );
};

// 渲染應用程式
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);