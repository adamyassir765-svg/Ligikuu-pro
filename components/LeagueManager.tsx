
import React, { useState, useRef } from 'react';
import { Trophy, Plus, Trash2, CheckCircle2, X, Camera, Upload } from 'lucide-react';
import { League, AppState, SportType, TournamentFormat } from '../types';

interface Props {
  state: AppState;
  onAddLeague: (league: League) => void;
  onDeleteLeague: (id: string) => void;
  onSelectLeague: (id: string) => void;
}

const LeagueManager: React.FC<Props> = ({ state, onAddLeague, onDeleteLeague, onSelectLeague }) => {
  const [showModal, setShowModal] = useState(false);
  const [logo, setLogo] = useState('');
  const [newLeague, setNewLeague] = useState({
    name: '',
    sport: 'Football' as SportType,
    format: 'League' as TournamentFormat
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeague.name) return;

    const league: League = {
      id: crypto.randomUUID(),
      name: newLeague.name,
      logo: logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${newLeague.name}`,
      sport: newLeague.sport,
      format: newLeague.format,
      teams: [],
      matches: [],
      status: 'Draft',
      creatorName: 'Wewe'
    };

    onAddLeague(league);
    setShowModal(false);
    setLogo('');
    setNewLeague({ name: '', sport: 'Football', format: 'League' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Ligi Zako</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Dhibiti mashindano yako hapa</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          Unda Ligi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.leagues.length === 0 ? (
          <div className="md:col-span-2 glass-card p-20 rounded-[3rem] text-center border-2 border-dashed border-white/5">
             <Trophy className="w-16 h-16 text-slate-800 mx-auto mb-4" />
             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Bado hujaanzisha ligi yoyote.</p>
          </div>
        ) : (
          state.leagues.map(league => (
            <div 
              key={league.id} 
              className={`glass-card p-6 rounded-[2.5rem] flex items-center justify-between border transition-all cursor-pointer group ${state.activeLeagueId === league.id ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 hover:border-white/20'}`}
              onClick={() => onSelectLeague(league.id)}
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img 
                    src={league.logo} 
                    className={`w-16 h-16 rounded-2xl object-cover border-2 ${state.activeLeagueId === league.id ? 'border-blue-500' : 'border-slate-800'}`} 
                    alt="" 
                  />
                  {state.activeLeagueId === league.id && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1 shadow-lg">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase italic tracking-tighter">{league.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{league.sport} • {league.teams.length} Timu</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteLeague(league.id); }}
                className="p-3 text-slate-700 hover:text-red-500 transition-colors bg-slate-900/50 rounded-xl"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-lg p-10 rounded-[3rem] relative animate-in zoom-in duration-300 shadow-2xl border border-white/10">
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"><X className="w-5 h-5" /></button>
            
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Unda Ligi Mpya</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-28 h-28 bg-slate-950 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all overflow-hidden relative group"
                >
                  <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                  {logo ? (
                    <>
                      <img src={logo} className="w-full h-full object-cover" alt="Logo preview" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="text-white w-8 h-8" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="w-8 h-8 text-slate-600 mb-2 group-hover:text-blue-500" />
                      <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest group-hover:text-blue-500">Pakia Logo</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Jina la Ligi</label>
                  <input 
                    type="text" 
                    value={newLeague.name}
                    onChange={e => setNewLeague({...newLeague, name: e.target.value})}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 focus:outline-none focus:border-blue-500 transition-colors font-bold text-white"
                    placeholder="CHAMPIONS LEAGUE..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Michezo</label>
                    <select 
                      value={newLeague.sport}
                      onChange={e => setNewLeague({...newLeague, sport: e.target.value as SportType})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 focus:outline-none focus:border-blue-500 font-bold appearance-none text-white"
                    >
                      <option value="Football">Football</option>
                      <option value="Basketball">Basketball</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Mfumo</label>
                    <select 
                      value={newLeague.format}
                      onChange={e => setNewLeague({...newLeague, format: e.target.value as TournamentFormat})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 focus:outline-none focus:border-blue-500 font-bold appearance-none text-white"
                    >
                      <option value="League">Mzunguko</option>
                      <option value="Knockout">Mtoano</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black text-white transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs">
                Anza Ligi Sasa
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueManager;
