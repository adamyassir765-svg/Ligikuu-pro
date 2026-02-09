
import React, { useState, useEffect } from 'react';
import { AppState, League } from '../types';
import { Trophy, Users, Play, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { translations } from '../translations';

interface Props {
  state: AppState;
  onSelectLeague: (id: string) => void;
}

const Dashboard: React.FC<Props> = ({ state, onSelectLeague }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const banners = state.adConfig.banners.filter(b => b.position === 'top' || b.position === 'middle');
  const showAds = state.adConfig.showAds && banners.length > 0;
  const t = translations[state.language];

  useEffect(() => {
    if (!showAds) return;
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % banners.length);
    }, 5000); // Badilisha matangazo kila sekunde 5
    return () => clearInterval(interval);
  }, [showAds, banners.length]);

  return (
    <div className="space-y-14 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.8] text-white tracking-tighter">
            {t.welcome.split(', ')[0]}, <br/> <span className="text-blue-500">{t.welcome.split(', ')[1]}</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-6">{t.subtitle}</p>
        </div>
      </div>

      {/* Auto-sliding Ad Banner */}
      {showAds && (
        <div className="relative w-full h-80 md:h-[450px] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
          {banners.map((ad, idx) => (
            <a 
              key={ad.id}
              href={ad.linkUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentAdIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-110'}`}
            >
              <img src={ad.imageUrl} className="w-full h-full object-cover" alt="Ad" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{t.sponsor}</span>
                  <div className="flex gap-1">
                    {banners.map((_, i) => (
                       <div key={i} className={`w-2 h-1 rounded-full transition-all ${i === currentAdIndex ? 'bg-blue-500 w-6' : 'bg-white/20'}`}></div>
                    ))}
                  </div>
                </div>
                <h3 className="text-white text-3xl md:text-5xl font-black uppercase italic leading-tight drop-shadow-2xl">Habari na Matukio ya Michezo</h3>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Moving Featured Leagues Section (Medium Sized) */}
      <div className="space-y-8 overflow-hidden py-4">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-black italic uppercase text-white flex items-center gap-3">
             <Sparkles className="text-amber-500 animate-pulse" /> {t.featured}
           </h2>
        </div>
        
        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-6 items-center py-4">
            {state.leagues.length > 0 ? (
               [...state.leagues, ...state.leagues, ...state.leagues].map((league, idx) => (
                <div 
                  key={`${league.id}-${idx}`} 
                  onClick={() => onSelectLeague(league.id)}
                  className="inline-block glass-card w-64 md:w-80 p-6 rounded-[2.5rem] border border-white/5 hover:border-blue-500/40 transition-all cursor-pointer group shadow-xl"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-5">
                     <img src={league.logo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={league.name} />
                     <div className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase text-white shadow-lg">{t.live}</div>
                  </div>
                  <h4 className="text-lg font-black uppercase italic text-white truncate">{league.name}</h4>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex -space-x-3">
                       {league.teams.slice(0, 3).map(t => (
                         <img key={t.id} src={t.logo} className="w-7 h-7 rounded-full border-2 border-slate-900 object-cover" />
                       ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">{league.teams.length} Teams</span>
                  </div>
                </div>
              ))
            ) : (
               <div className="w-full text-center py-10 opacity-20 font-black uppercase italic tracking-widest text-slate-500">Hakuna Ligi Mpya Bado...</div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard icon={<Trophy size={20} />} label={t.leagues} value={state.leagues.length} color="blue" />
        <StatsCard icon={<Play size={20} />} label={t.active} value={state.leagues.filter(l => l.status === 'Active').length} color="amber" />
        <StatsCard icon={<Users size={20} />} label={t.totalTeams} value={state.leagues.reduce((acc, l) => acc + l.teams.length, 0)} color="indigo" />
      </div>

      {/* Manual Management List */}
      <div className="space-y-8">
        <h2 className="text-2xl font-black italic uppercase text-blue-500">{t.manageLeagues}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.leagues.map(league => (
            <div key={league.id} className="glass-card p-8 rounded-[2.5rem] flex items-center justify-between cursor-pointer hover:border-blue-500/30 transition-all shadow-xl group" onClick={() => onSelectLeague(league.id)}>
              <div className="flex items-center gap-6">
                <div className="relative">
                   <img src={league.logo} className="w-20 h-20 rounded-2xl object-cover shadow-2xl border border-white/5 group-hover:rotate-3 transition-transform" alt="" />
                   <div className="absolute -bottom-2 -right-2 bg-slate-900 p-1.5 rounded-lg border border-white/10">
                      <Zap size={12} className="text-blue-500" />
                   </div>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase italic text-white">{league.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">{league.teams.length} Teams Registered</p>
                </div>
              </div>
              <div className="bg-slate-900 p-4 rounded-2xl text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                <ArrowRight size={20} />
              </div>
            </div>
          ))}
          {state.leagues.length === 0 && (
            <div className="md:col-span-2 text-center py-20 glass-card rounded-[3rem] border-2 border-dashed border-white/10">
               <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">{t.noLeagues}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

const StatsCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, color: string }> = ({ icon, label, value, color }) => (
  <div className="glass-card p-10 rounded-[3.5rem] flex flex-col items-center text-center shadow-2xl hover:translate-y-[-5px] transition-all border border-white/5">
    <div className={`p-5 rounded-2xl mb-6 shadow-lg ${color === 'blue' ? 'bg-blue-600/10 text-blue-500' : color === 'amber' ? 'bg-amber-600/10 text-amber-500' : 'bg-indigo-600/10 text-indigo-500'}`}>{icon}</div>
    <span className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-[0.2em]">{label}</span>
    <span className="text-6xl font-black italic text-white drop-shadow-xl">{value}</span>
  </div>
);

export default Dashboard;
