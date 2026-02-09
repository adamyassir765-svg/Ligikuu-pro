
import React, { useState, useRef } from 'react';
import { League, Team, Player } from '../types';
import { Plus, Camera, Trash2, Image as ImageIcon, CheckCircle, UserPlus, Users, X } from 'lucide-react';

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
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
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

    const updatedTeams = league.teams.map(t => {
      if (t.id === teamId) {
        return { ...t, players: [...t.players, player] };
      }
      return t;
    });

    onUpdateLeague({ ...league, teams: updatedTeams });
    setNewPlayer({ name: '', number: '', position: 'FW' });
  };

  const removePlayer = (teamId: string, playerId: string) => {
    const updatedTeams = league.teams.map(t => {
      if (t.id === teamId) {
        return { ...t, players: t.players.filter(p => p.id !== playerId) };
      }
      return t;
    });
    onUpdateLeague({ ...league, teams: updatedTeams });
  };

  const selectedTeam = league.teams.find(t => t.id === selectedTeamId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Timu na Wachezaji</h1>
          <p className="text-slate-400">Timu {league.teams.length} zimesajiliwa kwenye {league.name}</p>
        </div>
        {league.teams.length >= 2 && league.status === 'Draft' && (
           <div className="flex items-center gap-2 text-green-500 font-bold bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
              <CheckCircle className="w-5 h-5" />
              Tayari kuanza mechi!
           </div>
        )}
      </div>

      <div className="glass-card p-6 rounded-3xl border border-white/5">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-blue-500" /> Sajili Timu Mpya</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Jina la Timu</label>
              <input 
                type="text" 
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Mfano: Simba SC, Yanga SC, Coastal Union..."
              />
            </div>
            
            <button 
              onClick={addTeam}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Sajili Timu
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-32 h-32 bg-slate-900 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all overflow-hidden relative group"
             >
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-slate-500 mb-2" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Logo</span>
                  </>
                )}
             </div>
             <input type="file" ref={fileInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {league.teams.map(team => (
          <div key={team.id} className={`glass-card p-6 rounded-[2rem] border transition-all group ${selectedTeamId === team.id ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 hover:border-white/20'}`}>
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-4">
                 <img src={team.logo} className="w-16 h-16 rounded-2xl object-cover shadow-xl border border-white/5" alt={team.name} />
                 <div>
                   <h4 className="font-bold text-lg">{team.name}</h4>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{team.players.length} Wachezaji</p>
                 </div>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => setSelectedTeamId(team.id)} className="p-2 bg-slate-800 rounded-xl text-blue-500 hover:bg-blue-600 hover:text-white transition-all"><Users className="w-5 h-5" /></button>
                 <button onClick={() => removeTeam(team.id)} className="p-2 bg-slate-800 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
               </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500 font-bold uppercase">
                <span>Wachezaji Muhimu</span>
                <span>Goli</span>
              </div>
              {team.players.slice(0, 3).map(p => (
                <div key={p.id} className="flex justify-between items-center bg-black/20 p-2 rounded-xl border border-white/5">
                   <span className="text-sm font-semibold">{p.name} <span className="text-[10px] text-slate-500">#{p.number}</span></span>
                   <span className="text-blue-500 font-black">{p.goals}</span>
                </div>
              ))}
              {team.players.length === 0 && <p className="text-xs text-slate-600 italic">Hakuna wachezaji bado.</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Modal ya Kusimamia Wachezaji */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#1e293b]/90 backdrop-blur-xl py-2 z-10">
              <div className="flex items-center gap-4">
                <img src={selectedTeam.logo} className="w-12 h-12 rounded-xl" />
                <div>
                  <h2 className="text-2xl font-bold">{selectedTeam.name}</h2>
                  <p className="text-sm text-slate-400">Usajili wa Kikosi</p>
                </div>
              </div>
              <button onClick={() => setSelectedTeamId(null)} className="p-3 bg-slate-800 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h3 className="font-bold flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-500" /> Ongeza Mchezaji</h3>
                  <div className="space-y-4">
                    <input 
                      type="text" placeholder="Jina la Mchezaji" 
                      value={newPlayer.name} onChange={e => setNewPlayer({...newPlayer, name: e.target.value})}
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="number" placeholder="Namba" 
                        value={newPlayer.number} onChange={e => setNewPlayer({...newPlayer, number: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 focus:border-blue-500"
                      />
                      <select 
                        value={newPlayer.position} onChange={e => setNewPlayer({...newPlayer, position: e.target.value})}
                        className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 focus:border-blue-500"
                      >
                        <option value="GK">Kipa</option>
                        <option value="DF">Beki</option>
                        <option value="MF">Kiungo</option>
                        <option value="FW">Mshambuliaji</option>
                      </select>
                    </div>
                    <button onClick={() => addPlayer(selectedTeam.id)} className="w-full bg-blue-600 py-4 rounded-2xl font-bold">Sajili Mchezaji</button>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="font-bold">Kikosi Kimoja ({selectedTeam.players.length})</h3>
                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {selectedTeam.players.map(p => (
                      <div key={p.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-blue-600/20 text-blue-500 flex items-center justify-center rounded-lg font-black text-xs">{p.number}</span>
                          <div>
                            <p className="text-sm font-bold">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{p.position}</p>
                          </div>
                        </div>
                        <button onClick={() => removePlayer(selectedTeam.id, p.id)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {selectedTeam.players.length === 0 && <p className="text-center py-10 text-slate-600 italic">Hakuna mchezaji aliyesajiliwa.</p>}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
