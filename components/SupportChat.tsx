
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, ShieldCheck } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SupportChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Oya kiongozi! Mimi ni Adam, msaidizi wako wa AI. Nipo hapa kukusaidia kupanga ratiba, takwimu, na kila kitu kuhusu ligi yako. Karibu sana. 🔥" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const history = [...messages, { role: 'user', text: userText }];
      const contents = history.map(m => ({ 
        role: m.role, 
        parts: [{ text: m.text }] 
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
        config: {
          systemInstruction: "Wewe ni Adam, mtaalam wa michezo. JIBU KWA KISWAHILI CHA MTAANI. MARUFUKU KABISA KUTUMIA NENO 'Launch' AU 'luach'. USISEME CHOCHOTE KUHUSU KUZINDUA. Lengo lako ni kusaidia kusimamia ligi, ratiba, na takwimu pekee. Ukikiuka hili, utakuwa umefeli. Kuwa mcheshi na mjanja.",
          temperature: 0.5,
        }
      });

      const reply = response.text || "Nimepata tatizo kiongozi, hebu niulize tena!";
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Oya Boss, kuna kizingiti kidogo kwenye mtandao. Jaribu tena baada ya muda." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] glass-card rounded-[3.5rem] border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-500 shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-slate-900/80 backdrop-blur-2xl flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-600/30">
            <Bot className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="font-black uppercase italic tracking-tighter text-2xl text-white">Adam <span className="text-blue-500">AI</span></h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Meneja wa Michezo</p>
          </div>
        </div>
        <div className="bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-950/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-800'}`}>
                {m.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-5 rounded-[2rem] text-sm md:text-base font-medium shadow-md ${
                m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900/90 text-slate-200 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/50 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-4">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-8 bg-slate-900/40 border-t border-white/5">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Uliza chochote hapa..."
            className="flex-1 bg-slate-950 border border-white/10 rounded-[2rem] px-8 py-5 focus:outline-none focus:border-blue-500 font-bold text-white shadow-inner"
          />
          <button type="submit" disabled={!input.trim() || loading} className="bg-blue-600 p-5 rounded-[1.8rem] active:scale-90 transition-all shadow-xl">
            <Send className="w-6 h-6 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportChat;
