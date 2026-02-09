
import React from 'react';
import { AppNotification } from '../types';
import { X, Bell, Info, CheckCircle2, AlertTriangle, Trash2, Clock } from 'lucide-react';

interface Props {
  notifications: AppNotification[];
  onClose: () => void;
  onClear: () => void;
}

const NotificationCenter: React.FC<Props> = ({ notifications, onClose, onClear }) => {
  return (
    <div className="glass-card rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="p-6 bg-slate-900/80 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-black uppercase italic tracking-tighter text-lg flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-500" /> Taarifa
        </h3>
        <div className="flex gap-2">
          <button onClick={onClear} className="p-2 text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white"><X size={16} /></button>
        </div>
      </div>
      
      <div className="max-h-[450px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-600 space-y-4">
             <Bell className="w-10 h-10 mx-auto opacity-10" />
             <p className="text-[10px] font-black uppercase tracking-widest">Hakuna taarifa mpya</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`p-4 rounded-2xl border flex flex-col gap-4 transition-all ${n.isRead ? 'bg-slate-900/20 border-white/5 opacity-60' : 'bg-blue-600/5 border-blue-500/20'}`}>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  {n.type === 'success' ? <CheckCircle2 size={18} className="text-green-500" /> : 
                   n.type === 'alert' ? <AlertTriangle size={18} className="text-amber-500" /> : 
                   <Info size={18} className="text-blue-500" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className={`text-xs font-black uppercase tracking-tight ${n.isRead ? 'text-slate-400' : 'text-white'}`}>{n.title}</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                </div>
              </div>
              
              {n.imageUrl && (
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/5 shadow-inner">
                   <img src={n.imageUrl} className="w-full h-full object-cover" alt="Notification" />
                </div>
              )}

              <div className="flex items-center gap-1.5 border-t border-white/5 pt-2">
                 <Clock size={10} className="text-slate-700" />
                 <span className="text-[8px] font-bold text-slate-700 uppercase">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-4 bg-slate-900/40 text-center">
           <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white">Funga</button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
