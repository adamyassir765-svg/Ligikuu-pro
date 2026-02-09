
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, ShieldCheck, Clock, MessageSquareQuote } from 'lucide-react';
import { ChatMessage } from '../types';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
}

const CommunityChat: React.FC<Props> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [username, setUsername] = useState(() => localStorage.getItem('chat_username') || '');
  const [isSettingName, setIsSettingName] = useState(!username);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSettingName]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !username) return;

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: username,
      text: input,
      timestamp: new Date().toISOString()
    };
    onSendMessage(msg);
    setInput('');
  };

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('chat_username', username);
      setIsSettingName(false);
    }
  };

  if (isSettingName) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
        <div className="glass-card p-10 rounded-[3rem] w-full max-w-sm text-center border border-blue-500/20 shadow-2xl">
          <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <User className="text-blue-500 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black uppercase italic mb-4">Weka Jina Lako</h2>
          <p className="text-slate-500 text-xs font-bold mb-8 uppercase tracking-widest">Ili uweze kuchati na wenzako</p>
          <form onSubmit={handleSetName} className="space-y-4">
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Mfano: Mnyama_Kali"
              className="w-full bg-slate-900 border border-white/10 rounded-2xl p-5 focus:border-blue-500 text-white font-bold outline-none"
              required
            />
            <button className="w-full bg-blue-600 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95">ANZA KUCHATI</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[78vh] glass-card rounded-[3rem] border border-white/5 overflow-hidden animate-in zoom-in duration-500 shadow-2xl">
      <div className="p-6 md:p-8 bg-slate-900/60 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <MessageSquareQuote className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Chat Room</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Kijiwe cha Wanakuzuru</p>
          </div>
        </div>
        <button onClick={() => setIsSettingName(true)} className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white px-4 py-2 bg-white/5 rounded-full transition-all">Change Name</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar bg-slate-950/20">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
             <Clock className="w-12 h-12 mb-4 opacity-20" />
             <p className="font-bold italic uppercase text-xs tracking-widest">Hakuna ujumbe bado. Anza mazungumzo!</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === username ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`max-w-[80%] space-y-1.5`}>
               <div className={`flex items-center gap-2 mb-1 ${m.sender === username ? 'flex-row-reverse' : ''}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${m.isAdmin ? 'text-amber-500' : 'text-slate-500'}`}>
                    {m.sender} {m.isAdmin && '👑'}
                  </span>
               </div>
               <div className={`p-4 md:p-5 rounded-2xl text-sm font-medium shadow-xl ${
                 m.isAdmin ? 'bg-amber-600/20 border border-amber-500/30 text-amber-100 rounded-tl-none' :
                 m.sender === username ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-200 rounded-tl-none'
               }`}>
                 {m.text}
               </div>
               <p className={`text-[8px] font-bold text-slate-600 uppercase ${m.sender === username ? 'text-right' : 'text-left'}`}>
                 {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSend} className="p-6 md:p-8 bg-slate-900/40 border-t border-white/5 flex gap-4">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Andika ujumbe wako..."
          className="flex-1 bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 focus:border-blue-500 text-white font-bold outline-none shadow-inner"
        />
        <button type="submit" className="bg-blue-600 p-4 rounded-xl shadow-xl shadow-blue-600/20 hover:bg-blue-500 active:scale-90 transition-all">
          <Send className="w-6 h-6 text-white" />
        </button>
      </form>
    </div>
  );
};

export default CommunityChat;
