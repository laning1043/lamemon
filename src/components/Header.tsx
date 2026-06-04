import React, { useState, useRef } from 'react';
import { Search, Bell, LayoutDashboard, CheckSquare, Wallet, NotebookPen, Camera } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/alex/100/100');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { id: 'dashboard', label: '首頁', icon: LayoutDashboard },
    { id: 'tasks', label: '代辦事項', icon: CheckSquare },
    { id: 'accounting', label: '記帳', icon: Wallet },
    { id: 'notes', label: '備忘錄', icon: NotebookPen },
  ];

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-morphism px-6 lg:px-20 py-4 flex items-center justify-between border-b border-primary-dark/20">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="bg-primary p-2 rounded-lg flex items-center justify-center border border-primary-dark/30">
            <div className="w-6 h-6 bg-cyan-600 rounded-sm flex items-center justify-center">
               <span className="text-white text-[10px] font-bold">L</span>
            </div>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-cyan-900">Lamemon</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "text-sm font-medium transition-all relative py-1",
                activeTab === item.id 
                  ? "text-cyan-900 font-bold" 
                  : "text-slate-500 hover:text-cyan-700"
              )}
            >
              {item.label}
              {activeTab === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div 
          onClick={handleAvatarClick}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-slate-900 overflow-hidden border border-primary-dark/30 cursor-pointer group relative"
        >
          <img 
            alt="User avatar" 
            className="w-full h-full object-cover" 
            src={avatarUrl}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*" 
        />
      </div>
    </header>
  );
};
