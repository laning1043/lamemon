import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, Bell, Plus, Bold, Italic, Image as ImageIcon, Share2, List, Tag, ChevronRight, Trash2, PlusCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '@/src/lib/utils';
import { AddNoteModal } from './AddNoteModal';

const EditableContent = ({ value, onChange, placeholder, className }: { value: string, onChange: (val: string) => void, placeholder?: string, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isEditing && ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value, isEditing]);

  return (
    <div
      ref={ref}
      contentEditable
      onFocus={() => setIsEditing(true)}
      onBlur={() => setIsEditing(false)}
      onInput={(e) => onChange(e.currentTarget.innerHTML)}
      className={cn("focus:outline-none min-h-[400px] empty:before:content-[attr(placeholder)] empty:before:text-slate-300", className)}
      placeholder={placeholder}
    />
  );
};

export const Notes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [notes, setNotes] = useState<any[]>([
    { id: 0, title: '冰晶藍主題規格', content: '全新美學專注於 #E0F7FA，結合重度模糊與晶瑩剔透的質感...', tags: ['設計', '氛圍'], category: '設計', time: '上午 10:42' },
    { id: 1, title: '每週購物清單', content: '新鮮青檸、檸檬、生薑、氣泡水、薄荷葉與蜂蜜...', tags: [], category: '生活', time: '昨天' },
    { id: 2, title: '客戶反饋：Zenith UI', content: '客戶非常喜歡青檸主題色調，但建議增加對比度...', tags: [], category: '工作', time: '週一' },
    { id: 3, title: '靈感日誌', content: '大自然啟發的玻璃效果。3D 渲染中的次表面散射...', tags: [], category: '靈感', time: '8月12日' },
  ]);

  const [customCategories, setCustomCategories] = useState<string[]>(['設計', '生活', '工作', '靈感']);

  const categories: string[] = ['全部', '未分類', ...customCategories];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const filteredNotes = selectedCategory === '全部' 
    ? notes 
    : notes.filter(n => (n.category || '未分類') === selectedCategory);

  const handleUpdateNote = (id: number, field: 'title' | 'content' | 'category', value: string) => {
    if (field === 'category' && value !== 'new' && value !== '未分類' && !customCategories.includes(value)) {
      setCustomCategories(prev => [...prev, value]);
    }
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, [field]: value, time: '剛剛' } : note
    ));
  };

  const handleAddCategory = () => {
    const name = prompt('請輸入新分類名稱:');
    if (name && !customCategories.includes(name)) {
      setCustomCategories(prev => [...prev, name]);
    }
  };

  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const handleDeleteCategory = (e: React.MouseEvent, cat: string) => {
    e.stopPropagation();
    if (cat === '全部' || cat === '未分類') return;
    
    if (deletingCategory === cat) {
      // Second click: perform deletion
      setNotes(prev => prev.map(note => 
        note.category === cat ? { ...note, category: '未分類' } : note
      ));
      setCustomCategories(prev => prev.filter(c => c !== cat));
      if (selectedCategory === cat) setSelectedCategory('全部');
      setDeletingCategory(null);
    } else {
      // First click: arm for deletion
      setDeletingCategory(cat);
      // Auto-disarm after 3 seconds
      setTimeout(() => setDeletingCategory(prev => prev === cat ? null : prev), 3000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        if (base64) {
          document.execCommand('insertImage', false, base64 as string);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleToolbarAction = (action: string, value?: any) => {
    if (action === 'insertImage') {
      fileInputRef.current?.click();
    } else {
      document.execCommand(action, false, value);
    }
  };

  const handleAddNote = (newNote: { title: string; content: string; category: string }) => {
    if (newNote.category && newNote.category !== '未分類' && !customCategories.includes(newNote.category)) {
      setCustomCategories(prev => [...prev, newNote.category]);
    }
    const note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category || '未分類',
      tags: [],
      time: '剛剛'
    };
    setNotes([note, ...notes]);
    setActiveNoteId(note.id);
  };

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-primary-dark/20 bg-white/20 backdrop-blur-md flex flex-col">
        <div className="p-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-cyan-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-100 hover:bg-cyan-600 transition-all"
          >
            <Plus className="w-5 h-5" /> 新增備忘錄
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
          <div className="px-2 py-4 space-y-1">
             <div className="flex items-center justify-between mb-4 px-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">分類</div>
                <PlusCircle 
                  className="w-4 h-4 text-slate-300 cursor-pointer hover:text-cyan-500 transition-colors" 
                  onClick={handleAddCategory}
                />
             </div>
             {categories.map(cat => (
               <div 
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={cn(
                   "group flex items-center justify-between gap-3 font-bold text-sm px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                   selectedCategory === cat 
                     ? "bg-cyan-500 text-white shadow-lg shadow-cyan-100" 
                     : "text-slate-400 hover:bg-white/40 hover:text-slate-600"
                 )}
               >
                  <div className="flex items-center gap-3">
                    <Tag className={cn("w-4 h-4", selectedCategory === cat ? "text-white" : "text-slate-300")} />
                    {cat}
                  </div>
                  <div className="flex items-center gap-2">
                    {cat !== '全部' && cat !== '未分類' && (
                      <button
                        type="button"
                        className={cn(
                          "p-1 rounded-md transition-all flex items-center justify-center min-w-[24px] min-h-[24px]",
                          deletingCategory === cat 
                            ? "bg-red-500 text-white opacity-100" 
                            : "opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-300 hover:text-red-500",
                          selectedCategory === cat && deletingCategory !== cat ? "text-white/70 hover:text-white hover:bg-white/20" : ""
                        )}
                        onClick={(e) => handleDeleteCategory(e, cat)}
                        title={deletingCategory === cat ? "再次點擊確認刪除" : "刪除分類"}
                      >
                        {deletingCategory === cat ? (
                          <span className="text-[10px] font-black px-1">刪除?</span>
                        ) : (
                          <Trash2 className="w-3.5 h-3.5 pointer-events-none" />
                        )}
                      </button>
                    )}
                    {selectedCategory === cat && <ChevronRight className="w-3 h-3" />}
                  </div>
               </div>
             ))}
          </div>

          <div className="h-px bg-slate-200/50 my-4 mx-2" />

          {filteredNotes.map((note) => (
            <div 
              key={note.id} 
              onClick={() => setActiveNoteId(note.id)}
              className={cn(
                "p-4 rounded-2xl cursor-pointer transition-all border border-transparent",
                activeNoteId === note.id 
                  ? "bg-white/60 border-white shadow-sm" 
                  : "hover:bg-white/40"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-800 truncate pr-2">{note.title}</h4>
                <span className="text-[10px] font-bold text-cyan-500 whitespace-nowrap">{note.time}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                {note.content.replace(/<[^>]*>/g, '')}
              </p>
              <div className="flex gap-1">
                {note.tags.map(tag => (
                  <span key={tag} className="text-[8px] font-bold px-2 py-0.5 bg-cyan-50 text-cyan-600 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col bg-white/10">
        {/* Toolbar */}
        <div className="px-8 py-4 border-b border-primary-dark/10 flex items-center justify-between">
          <div className="flex items-center gap-6 text-slate-400">
            <Bold 
              className="w-5 h-5 cursor-pointer hover:text-cyan-600 active:scale-95 transition-transform" 
              onMouseDown={(e) => { e.preventDefault(); handleToolbarAction('bold'); }}
            />
            <Italic 
              className="w-5 h-5 cursor-pointer hover:text-cyan-600 active:scale-95 transition-transform" 
              onMouseDown={(e) => { e.preventDefault(); handleToolbarAction('italic'); }}
            />
            <div className="w-px h-6 bg-slate-200" />
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
            <ImageIcon 
              className="w-5 h-5 cursor-pointer hover:text-cyan-600 active:scale-95 transition-transform" 
              onMouseDown={(e) => { e.preventDefault(); handleToolbarAction('insertImage'); }}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400">修改日期：剛剛 已自動儲存</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 lg:p-20 no-scrollbar">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold bg-cyan-50 text-cyan-600 px-2 py-1 rounded-md uppercase tracking-wider">
                {activeNote.category || '未分類'}
              </span>
              <select 
                value={activeNote.category || '未分類'}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    const newCat = prompt('請輸入新分類名稱:');
                    if (newCat) handleUpdateNote(activeNote.id, 'category', newCat);
                  } else {
                    handleUpdateNote(activeNote.id, 'category', e.target.value);
                  }
                }}
                className="bg-transparent border-none text-[10px] font-bold text-slate-400 focus:ring-0 cursor-pointer hover:text-cyan-600 p-0"
              >
                {categories.filter(c => c !== '全部').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="new">+ 新增分類</option>
              </select>
            </div>

            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => handleUpdateNote(activeNote.id, 'title', e.target.value)}
              className="w-full bg-transparent border-none text-6xl font-black text-slate-800 mb-12 focus:ring-0 p-0 placeholder:text-slate-200"
              placeholder="備忘錄主題..."
            />
            
            <div className="prose prose-slate max-w-none">
              <EditableContent
                value={activeNote.content}
                onChange={(content) => handleUpdateNote(activeNote.id, 'content', content)}
                placeholder="在此輸入內容..."
                className="text-xl text-slate-600 leading-relaxed mb-8"
              />
              
              {activeNote.id === 0 && (
                <>
                  <div className="my-12 rounded-3xl overflow-hidden border border-white/50 shadow-2xl">
                    <img 
                      src="https://picsum.photos/seed/moodboard/1200/600" 
                      alt="Moodboard" 
                      className="w-full h-auto"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h2 className="text-3xl font-bold text-slate-800 mb-6">設計實作</h2>
                  <ul className="space-y-4 text-lg text-slate-600">
                    <li className="flex gap-3">
                      <span className="text-cyan-500 font-bold">•</span>
                      <span><span className="font-bold text-slate-800">冰晶藍基底：</span> 使用不同透明度的 #E0F7FA 作為主要表面顏色。</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-cyan-500 font-bold">•</span>
                      <span><span className="font-bold text-slate-800">晶瑩玻璃：</span> 增強背景模糊 (16px) 並結合細微的光影邊框，模擬磨砂玻璃效果。</span>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddNoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddNote} 
        categories={categories}
      />
    </div>
  );
};
