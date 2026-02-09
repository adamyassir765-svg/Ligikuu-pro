
import React, { useState, useRef } from 'react';
import { League, Team, Player } from '../types';
import { Plus, Camera, Trash2, CheckCircle, UserPlus, Users, X, Upload } from 'lucide-react';

interface Props {
  league: League;
  onUpdateLeague: (league: League) => void;
}

const TeamManager: React.FC<Props> = ({ league, onUpdateLeague }) => {
  const [teamName, setTeamName] = useState('');
  const [logo, setLogo] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [newPlayer, setNewPlayer] = useState({ name: '', number: '', position: 'FW' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addTeam = () => {
    if (!teamName) return;

    const newTeam: Team = {
      id: crypto.randomUUID(),
      name: teamName,
      logo: logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${teamName}`,
      played: 0, won: 0, drawn: 0, lost: 0, points: 0, gf: 0, ga: 0,
      players: []
    };

    onUpdateLeague({
      ...league,
      teams: [...league.teams, newTeam]
    });

    setTeamName('');
    setLogo('');
  };

  const removeTeam = (id: string) => {
    onUpdateLeague({
      ...league,
      teams: league.teams.filter(t => t.id !== id)
    });
  };

  const addPlayer = (teamId: string) => {
    if (!newPlayer.name || !newPlayer.number) return;
    const player: Player = {
      id: crypto.randomUUID(),
      name: newPlayer.name,
      number: parseInt(newPlayer.number),
      position: newPlayer.position,
      goals: 0,
      assists: 0
    };
    const updatedTeams = league.teams.map(t => t.id === teamId ? { ...t, players: [...t.players, player] } : t);
    onUpdateLeague({ ...league, teams: updatedTeams });
    setNewPlayer({ name: '', number: '', position: 'FW' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Timu na Wachezaji</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{league.teams.length} Timu Sajili kwenye {league.name}</p>
        </div>
        {league.teams.length >= 2 && (
           <div className="flex items-center gap-2 text-green-500 font-black uppercase italic tracking-tighter bg-green-500/10 px-6 py-2 rounded-full border border-green-500/20 text-[10px]">
              <CheckCircle className="w-4 h-4" /> Tayari kuanza mechi!
           </div>
        )}
      </div>

      <div className="glass-card p-10 rounded-[3rem] border border-white/5">
        <h2 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
          <Plus className="w-6 h-6 text-blue-500" /> Sajili Timu Mpya
        </h2>
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 w-full space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Jina la Timu</label>
              <input 
                type="text" 
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 focus:border-blue-500 transition-colors font-bold text-white outline-none"
                placeholder="Mfano: Simba SC, Yanga SC..."
              />
            </div>
            <button onClick={addTeam} className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">Sajili Timu</button>
          </div>

          <div className="flex flex-col items-center gap-4">
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-32 h-32 bg-slate-950 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all overflow-hidden relative group"
             >
                <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                {logo ? (
                  <>
                    <img src={logo} className="w-full h-full object-cover" alt="Logo" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="text-white w-8 h-8" />
                    </div>
                  </>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-700 mb-2" />
                    <span className="text-[10px] text-slate-700 font-bold uppercase">Logo</span>
                  </>
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {league.teams.map(team => (
          <div key={team.id} className="glass-card p-6 rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all group shadow-xl">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-4">
                 <img src={team.logo} className="w-16 h-16 rounded-2xl object-cover shadow-xl border border-white/5" alt={team.name} />
                 <div>
                   <h4 className="font-black uppercase italic text-white truncate w-32">{team.name}</h4>
                   <p className="text-[9px] text-slate-500 font-bold uppercase">{team.players.length} Wachezaji</p>
                 </div>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => setSelectedTeamId(team.id)} className="p-3 bg-slate-900 rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all border border-white/5"><Users size={16} /></button>
                 <button onClick={() => removeTeam(team.id)} className="p-3 bg-slate-900 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all border border-white/5"><Trash2 size={16} /></button>
               </div>
            </div>
            <div className="space-y-2">
               {team.players.slice(0, 2).map(p => (
                 <div key={p.id} className="bg-slate-950/50 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">{p.name} <span className="text-blue-500">#{p.number}</span></span>
                 </div>
               ))}
               {team.players.length === 0 && <p className="text-[10px] text-slate-600 italic font-bold uppercase text-center py-2">Hakuna kikosi bado.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;
