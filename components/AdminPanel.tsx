
import React, { useState, useRef } from 'react';
import { AppState, AdBanner } from '../types';
import { ShieldCheck, Eye, EyeOff, Trash2, Send, Image as ImageIcon, Camera, X } from 'lucide-react';

interface Props {
  state: AppState;
  onAuthSuccess: () => void;
  authenticated: boolean;
  onUpdateState: (state: AppState | ((prev: AppState) => AppState)) => void;
  onSendNotification: (title: string, message: string, type: 'info' | 'success' | 'alert', imageUrl?: string) => void;
}

const AdminPanel: React.FC<Props> = ({ state, onAuthSuccess, authenticated, onUpdateState, onSendNotification }) => {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'notifs' | 'ads' | 'chat'>('notifs');
  
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [notifImage, setNotifImage] = useState<string | undefined>();
  const [adminReply, setAdminReply] = useState('');

  // Ad Form State
  const [newAd, setNewAd] = useState<Partial<AdBanner>>({ id: '', imageUrl: '', linkUrl: '', position: 'top', isActive: true });

  const fileInputAdsRef = useRef<HTMLInputElement>(null);
  const fileInputNotifRef = useRef<HTMLInputElement>(null);

  const ADMIN_SECRET = "adamAD";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      onAuthSuccess();
      setError('');
    } else {
      setError('Nenosiri sio sahihi kiongozi!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'ad' | 'notif') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'ad') {
          setNewAd(prev => ({ ...prev, imageUrl: reader.result as string }));
        } else {
          setNotifImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addAdBanner = () => {
    if (!newAd.imageUrl) {
      alert("Tafadhali chagua picha ya tangazo kwanza!");
      return;
    }
    const ad: AdBanner = {
      id: crypto.randomUUID(),
      imageUrl: newAd.imageUrl!,
      linkUrl: newAd.linkUrl || '#',
      position: (newAd.position as any) || 'top',
      isActive: true
    };
    onUpdateState(prev => ({
      ...prev,
      adConfig: { ...prev.adConfig, banners: [...prev.adConfig.banners, ad] }
    }));
    setNewAd({ imageUrl: '', linkUrl: '', position: 'top' });
  };

  const removeAd = (id: string) => {
    onUpdateState(prev => ({
      ...prev,
      adConfig: { ...prev.adConfig, banners: prev.adConfig.banners.filter(b => b.id !== id) }
    }));
  };

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center py-20 animate-in fade-in">
        <div className="glass-card w-full max-w-md p-10 rounded-[2.5rem] border border-blue-500/20 shadow-2xl">
            <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                <ShieldCheck className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-black text-center mb-6 uppercase italic tracking-tighter">Admin Panel</h2>
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-2xl py-5 pl-6 pr-14 focus:border-blue-500 outline-none text-white font-bold" placeholder="Password ya Admin..." />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">
                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-3 rounded-xl">{error}</p>}
                <button type="submit" className="w-full bg-blue-600 py-5 rounded-2xl font-black text-white uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all">Ingia Sasa</button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Meneja Mkuu</h1>
                <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">Control Center Pro</p>
            </div>
            <div className="flex p-1 bg-slate-900 rounded-2xl border border-white/5">
                <button onClick={() => setActiveAdminTab('notifs')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAdminTab === 'notifs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Taarifa</button>
                <button onClick={() => setActiveAdminTab('ads')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAdminTab === 'ads' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Matangazo</button>
                <button onClick={() => setActiveAdminTab('chat')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeAdminTab === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}>Chat</button>
            </div>
        </div>

        {activeAdminTab === 'notifs' && (
            <div className="glass-card p-10 rounded-[3rem] border border-amber-500/20 bg-amber-500/[0.02] animate-in fade-in">
                <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3 text-amber-500">
                    Tuma Taarifa (Picha & Maelezo)
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); onSendNotification(broadcastTitle, broadcastMessage, 'alert', notifImage); setBroadcastTitle(''); setBroadcastMessage(''); setNotifImage(undefined); alert('Imetumwa!'); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <input type="text" value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)} placeholder="Kichwa cha Taarifa..." className="w-full bg-slate-900 border border-white/5 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:border-amber-500" required />
                      <textarea value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} placeholder="Andika ujumbe wako hapa..." className="w-full bg-slate-900 border border-white/5 rounded-2xl p-5 text-sm font-medium h-32 outline-none focus:border-amber-500" required />
                    </div>
                    
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-3xl border border-dashed border-white/10 hover:border-amber-500/50 transition-all cursor-pointer group" onClick={() => fileInputNotifRef.current?.click()}>
                       <input type="file" ref={fileInputNotifRef} onChange={(e) => handleFileUpload(e, 'notif')} className="hidden" accept="image/*" />
                       {notifImage ? (
                         <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                           <img src={notifImage} className="w-full h-full object-cover" />
                           <button onClick={(e) => { e.stopPropagation(); setNotifImage(undefined); }} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500"><X size={14} /></button>
                         </div>
                       ) : (
                         <div className="flex flex-col items-center gap-2">
                           <Camera className="w-10 h-10 text-slate-700 group-hover:text-amber-500 transition-colors" />
                           <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-amber-400">Picha ya Taarifa (Optional)</span>
                         </div>
                       )}
                    </div>
                  </div>
                  <button className="w-full bg-amber-600 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">TUMA TAARIFA KWA WATUMIAJI WOTE</button>
                </form>
            </div>
        )}

        {activeAdminTab === 'ads' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
                <div className="glass-card p-8 rounded-[3rem] border border-blue-500/20">
                    <h3 className="text-xl font-black uppercase italic mb-6 flex items-center gap-3 text-blue-500">
                        <ImageIcon className="text-blue-500" /> Ongeza Bango Jipya
                    </h3>
                    <div className="space-y-6">
                        <div 
                          onClick={() => fileInputAdsRef.current?.click()}
                          className="w-full aspect-video bg-slate-950/50 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all overflow-hidden relative group"
                        >
                           <input type="file" ref={fileInputAdsRef} onChange={(e) => handleFileUpload(e, 'ad')} className="hidden" accept="image/*" />
                           {newAd.imageUrl ? (
                             <img src={newAd.imageUrl} className="w-full h-full object-cover" alt="Ad Preview" />
                           ) : (
                             <div className="flex flex-col items-center gap-3">
                               <Camera className="w-10 h-10 text-slate-700 group-hover:text-blue-500" />
                               <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-blue-400">Gusa hapa kuchagua Picha</span>
                             </div>
                           )}
                        </div>

                        <input type="text" value={newAd.linkUrl} onChange={e => setNewAd({...newAd, linkUrl: e.target.value})} placeholder="Link ya Matangazo (Optional)" className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-xs font-bold" />
                        
                        <select value={newAd.position} onChange={e => setNewAd({...newAd, position: e.target.value as any})} className="w-full bg-slate-900 border border-white/5 rounded-xl p-4 text-xs font-bold">
                            <option value="top">Juu (Top Banner)</option>
                            <option value="middle">Katikati (Middle)</option>
                            <option value="bottom">Chini (Bottom)</option>
                        </select>
                        <button onClick={addAdBanner} className="w-full bg-blue-600 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">HIFADHI BANGO</button>
                    </div>
                </div>

                <div className="glass-card p-8 rounded-[3rem] border border-white/5">
                    <h3 className="text-xl font-black uppercase italic mb-6">Mabango Yaliyopo</h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {state.adConfig.banners.map(ad => (
                            <div key={ad.id} className="bg-slate-900 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                <img src={ad.imageUrl} className="w-24 h-14 rounded-lg object-cover" alt="" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black uppercase text-blue-500">{ad.position} Banner</p>
                                    <p className="text-xs text-slate-500 truncate">{ad.linkUrl}</p>
                                </div>
                                <button onClick={() => removeAd(ad.id)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        {state.adConfig.banners.length === 0 && <p className="text-center py-10 text-slate-600 italic">Hakuna mabango.</p>}
                    </div>
                </div>
            </div>
        )}

        {activeAdminTab === 'chat' && (
            <div className="glass-card p-10 rounded-[3rem] border border-blue-500/20 animate-in fade-in">
                <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
                   Dhibiti Mazungumzo
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                   {state.messages.length === 0 ? <p className="text-slate-600 italic text-center py-20">Hakuna ujumbe wowote.</p> : 
                    state.messages.map(m => (
                      <div key={m.id} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
                         <div>
                            <div className="flex items-center gap-2">
                               <span className={`text-[10px] font-black uppercase tracking-widest ${m.isAdmin ? 'text-amber-500' : 'text-slate-500'}`}>{m.sender}</span>
                               <span className="text-[8px] text-slate-700 font-bold">{new Date(m.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-sm text-slate-200 mt-1">{m.text}</p>
                         </div>
                         <button onClick={() => onUpdateState(prev => ({...prev, messages: prev.messages.filter(msg => msg.id !== m.id)}))} className="p-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                      </div>
                    ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if(!adminReply.trim()) return; onUpdateState(prev => ({...prev, messages: [...prev.messages, { id: crypto.randomUUID(), sender: "ADMIN MANAGER", text: adminReply, timestamp: new Date().toISOString(), isAdmin: true }]})); setAdminReply(''); }} className="flex gap-4">
                   <input type="text" value={adminReply} onChange={e => setAdminReply(e.target.value)} placeholder="Jibu kama Admin..." className="flex-1 bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-blue-500" />
                   <button className="bg-blue-600 p-4 rounded-2xl shadow-lg active:scale-95 transition-all"><Send className="text-white" size={24} /></button>
                </form>
            </div>
        )}
    </div>
  );
};

export default AdminPanel;
