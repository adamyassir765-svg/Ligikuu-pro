
import React, { useState } from 'react';
import { League, Match } from '../types';
import { BarChart3, Calendar, Sparkles, Edit2, Save } from 'lucide-react';

interface Props {
  league: League;
  onUpdateLeague: (league: League) => void;
  onMatchCompleted?: (summary: string) => void;
}

const MatchCenter: React.FC<Props> = ({ league, onUpdateLeague, onMatchCompleted }) => {
  const [view, setView] = useState<'matches' | 'table'>('matches');
  const [loading, setLoading] = useState(false);
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [manualScores, setManualScores] = useState({ home: 0, away: 0 });

  const generateLocalSchedule = () => {
    if (league.teams.length < 2) {
      alert("Tafadhali sajili angalau timu 2 ili kupanga ratiba!");
      return;
    }
    
    setLoading(true);
    const matches: Match[] = [];
    const teams = [...league.teams];
    
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const matchDate = new Date();
        matchDate.setDate(matchDate.getDate() + matches.length);
        matchDate.setHours(16, 0, 0, 0);

        matches.push({
          id: crypto.randomUUID(),
          homeTeamId: teams[i].id,
          awayTeamId: teams[j].id,
          status: 'Scheduled',
          round: Math.floor(matches.length / (teams.length / 2)) + 1,
          date: matchDate.toISOString()
        });
      }
    }

    const shuffledMatches = matches.sort(() => Math.random() - 0.5);

    onUpdateLeague({ ...league, matches: shuffledMatches, status: 'Active' });
    setTimeout(() => setLoading(false), 800);
  };

  const handleQuickSimulate = (matchId: string) => {
    const hScore = Math.floor(Math.random() * 5);
    const aScore = Math.floor(Math.random() * 4);
    updateMatchResult(matchId, hScore, aScore);
  };

  const updateMatchResult = (matchId: string, hScore: number, aScore: number) => {
    const match = league.matches.find(m => m.id === matchId);
    if (!match) return;

    const updatedMatches = league.matches.map(m => 
      m.id === matchId 
        ? { ...m, homeScore: hScore, awayScore: aScore, status: 'Completed' as const } 
        : m
    );

    const updatedTeams = league.teams.map(t => {
      let nt = { ...t };
      if (t.id === match.homeTeamId) {
        nt.played += 1; nt.gf += hScore; nt.ga += aScore;
        if (hScore > aScore) { nt.won += 1; nt.points += 3; }
        else if (hScore === aScore) { nt.drawn += 1; nt.points += 1; }
        else nt.lost += 1;
      }
      if (t.id === match.awayTeamId) {
        nt.played += 1; nt.gf += aScore; nt.ga += hScore;
        if (aScore > hScore) { nt.won += 1; nt.points += 3; }
        else if (hScore === aScore) { nt.drawn += 1; nt.points += 1; }
        else nt.lost += 1;
      }
      return nt;
    });

    onUpdateLeague({ ...league, matches: updatedMatches, teams: updatedTeams });
    setEditingScoreId(null);
    if (onMatchCompleted) {
      const home = league.teams.find(t => t.id === match.homeTeamId)?.name;
      const away = league.teams.find(t => t.id === match.awayTeamId)?.name;
      onMatchCompleted(`Mechi Imeisha: ${home} ${hScore} - ${aScore} ${away}`);
    }
  };

  const getSortedTeams = () => {
    return [...league.teams].sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
  };

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat('sw-TZ', {
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    }).format(new Date(isoString));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Kituo cha Mechi</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{league.name} • Usimamizi Kamili</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex p-1 bg-slate-900 rounded-2xl border border-white/5">
             <button onClick={() => setView('matches')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${view === 'matches' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
               <Calendar className="w-3.5 h-3.5" /> Ratiba
             </button>
             <button onClick={() => setView('table')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest ${view === 'table' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
               <BarChart3 className="w-3.5 h-3.5" /> Msimamo
             </button>
          </div>
        </div>
      </div>

      {league.matches.length === 0 ? (
        <div className="glass-card p-20 rounded-[3rem] text-center border-2 border-dashed border-white/5 bg-blue-600/[0.02]">
          <Calendar className="w-16 h-16 text-slate-800 mx-auto mb-6" />
          <h2 className="text-xl font-black uppercase italic text-white mb-4">Ratiba Haijapangwa</h2>
          <p className="text-slate-500 text-xs font-bold mb-10 max-w-sm mx-auto uppercase tracking-widest">Timu {league.teams.length} zinasubiri ratiba. Bonyeza kitufe hapo chini kuzipanga zote kiautomatiki.</p>
          <button 
            disabled={loading} 
            onClick={generateLocalSchedule} 
            className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-black text-white uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'INAPANGA...' : 'PANGA RATIBA (RANDOM)'}
          </button>
        </div>
      ) : (
        <>
          {view === 'matches' && (
            <div className="grid grid-cols-1 gap-4">
              {league.matches.map((match) => (
                <div key={match.id} className="glass-card p-6 rounded-[2.5rem] border border-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex flex-col items-center gap-3">
                      <img src={league.teams.find(t => t.id === match.homeTeamId)?.logo} className="w-14 h-14 rounded-2xl object-cover shadow-lg" alt="" />
                      <span className="font-black text-[11px] uppercase italic text-white truncate w-full text-center">{league.teams.find(t => t.id === match.homeTeamId)?.name}</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 min-w-[120px]">
                      {editingScoreId === match.id ? (
                        <div className="flex items-center gap-2">
                           <input type="number" value={manualScores.home} onChange={e => setManualScores({...manualScores, home: parseInt(e.target.value) || 0})} className="w-12 bg-slate-950 border border-blue-500/50 rounded-lg p-2 text-center font-black text-white" />
                           <span className="text-white">-</span>
                           <input type="number" value={manualScores.away} onChange={e => setManualScores({...manualScores, away: parseInt(e.target.value) || 0})} className="w-12 bg-slate-950 border border-blue-500/50 rounded-lg p-2 text-center font-black text-white" />
                        </div>
                      ) : (
                        match.status === 'Completed' ? (
                          <div className="text-3xl font-black italic text-blue-500">{match.homeScore} - {match.awayScore}</div>
                        ) : (
                          <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">VS</div>
                        )
                      )}
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{formatDate(match.date)}</div>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-3">
                      <img src={league.teams.find(t => t.id === match.awayTeamId)?.logo} className="w-14 h-14 rounded-2xl object-cover shadow-lg" alt="" />
                      <span className="font-black text-[11px] uppercase italic text-white truncate w-full text-center">{league.teams.find(t => t.id === match.awayTeamId)?.name}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/5 flex justify-center gap-4">
                    {match.status === 'Scheduled' && (
                      <>
                        {editingScoreId === match.id ? (
                          <button onClick={() => updateMatchResult(match.id, manualScores.home, manualScores.away)} className="flex items-center gap-2 bg-green-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase text-white shadow-lg"><Save size={14} /> HIFADHI</button>
                        ) : (
                          <>
                            <button onClick={() => { setEditingScoreId(match.id); setManualScores({home: 0, away: 0}); }} className="flex items-center gap-2 bg-slate-800 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase text-slate-300 hover:text-white"><Edit2 size={14} /> MANUAL</button>
                            <button onClick={() => handleQuickSimulate(match.id)} className="flex items-center gap-2 bg-blue-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase text-white shadow-lg"><Sparkles size={14} /> SIMULATE</button>
                          </>
                        )}
                      </>
                    )}
                    {match.status === 'Completed' && <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] bg-slate-900 px-4 py-1.5 rounded-full border border-white/5">Mechi Imeisha</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'table' && (
            <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/80 border-b border-white/5">
                    <tr>
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500">Nafasi</th>
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500">Timu</th>
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500 text-center">M</th>
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500 text-center">W</th>
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500 text-center">D</th>
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500 text-center">L</th>
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500 text-center">GD</th>
                      <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-slate-500 text-center">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {getSortedTeams().map((team, i) => (
                      <tr key={team.id} className="hover:bg-blue-600/[0.02] transition-colors">
                        <td className="px-6 py-5"><div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-amber-500 text-white' : i === 1 ? 'bg-slate-400 text-white' : 'text-slate-500'}`}>{i + 1}</div></td>
                        <td className="px-6 py-5"><div className="flex items-center gap-4"><img src={team.logo} className="w-10 h-10 rounded-xl object-cover shadow-md" alt="" /><span className="font-black italic uppercase text-xs text-white">{team.name}</span></div></td>
                        <td className="px-6 py-5 text-center text-xs font-bold">{team.played}</td>
                        <td className="px-6 py-5 text-center text-xs font-bold text-green-500">{team.won}</td>
                        <td className="px-6 py-5 text-center text-xs font-bold text-slate-400">{team.drawn}</td>
                        <td className="px-6 py-5 text-center text-xs font-bold text-red-500">{team.lost}</td>
                        <td className="px-6 py-5 text-center text-xs font-bold">{team.gf - team.ga}</td>
                        <td className="px-6 py-5 text-center"><span className="bg-blue-600/20 text-blue-400 px-4 py-1.5 rounded-xl font-black text-xs border border-blue-500/20">{team.points}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MatchCenter;
