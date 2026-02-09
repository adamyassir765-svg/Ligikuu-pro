
import React, { useMemo } from 'react';
import { League, Player } from '../types';
import { Trophy, Star, TrendingUp, Users, Target } from 'lucide-react';

interface Props {
  league: League;
}

const StatsBoard: React.FC<Props> = ({ league }) => {
  const topScorers = useMemo(() => {
    const players: (Player & { teamName: string, teamLogo: string })[] = [];
    league.teams.forEach(team => {
      team.players.forEach(player => {
        players.push({ ...player, teamName: team.name, teamLogo: team.logo });
      });
    });
    return players.sort((a, b) => b.goals - a.goals || b.assists - a.assists).slice(0, 10);
  }, [league.teams]);

  const totalGoals = league.teams.reduce((acc, t) => acc + t.gf, 0);
  const avgGoals = league.matches.filter(m => m.status === 'Completed').length > 0 
    ? (totalGoals / league.matches.filter(m => m.status === 'Completed').length).toFixed(1)
    : '0';

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Takwimu za Ligi</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Uchambuzi wa Timu na Wachezaji</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Target className="text-blue-500" />} label="Jumla ya Mabao" value={totalGoals} />
        <StatCard icon={<Star className="text-amber-500" />} label="Wastani / Mechi" value={avgGoals} />
        <StatCard icon={<Users className="text-green-500" />} label="Wachezaji Waliosajiliwa" value={league.teams.reduce((acc, t) => acc + t.players.length, 0)} />
        <StatCard icon={<TrendingUp className="text-indigo-500" />} label="Mechi Zilizochezwa" value={league.matches.filter(m => m.status === 'Completed').length} />
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
         <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
            <h2 className="font-black text-xl italic uppercase text-white flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500" /> Wafungaji Bora
            </h2>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="bg-slate-900/80">
               <tr>
                 <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">#</th>
                 <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Mchezaji</th>
                 <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest">Timu</th>
                 <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest text-center">Assists</th>
                 <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-500 tracking-widest text-center">Mabao</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               {topScorers.map((player, i) => (
                 <tr key={player.id} className="hover:bg-blue-600/[0.02] transition-colors">
                   <td className="px-8 py-5">
                     <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] ${i === 0 ? 'bg-amber-500 text-white' : 'text-slate-500'}`}>{i + 1}</div>
                   </td>
                   <td className="px-8 py-5">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs border border-white/5">#{player.number}</div>
                       <div>
                         <p className="font-black text-sm text-white uppercase italic">{player.name}</p>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{player.position}</p>
                       </div>
                     </div>
                   </td>
                   <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                         <img src={player.teamLogo} className="w-7 h-7 rounded-lg object-cover shadow-sm" />
                         <span className="text-xs font-black uppercase italic text-slate-300">{player.teamName}</span>
                      </div>
                   </td>
                   <td className="px-8 py-5 text-center font-black text-slate-500 text-xs">{player.assists}</td>
                   <td className="px-8 py-5 text-center">
                      <span className="bg-blue-600/20 text-blue-500 px-4 py-1.5 rounded-xl font-black text-xs border border-blue-500/20">{player.goals}</span>
                   </td>
                 </tr>
               ))}
               {topScorers.length === 0 && (
                 <tr>
                   <td colSpan={5} className="px-8 py-20 text-center text-slate-600 font-bold uppercase text-[10px] tracking-widest italic opacity-20">Hakuna takwimu bado. Anza kucheza mechi!</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number }> = ({ icon, label, value }) => (
  <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 shadow-xl hover:translate-y-[-4px] transition-all">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-slate-900 rounded-2xl border border-white/5 shadow-inner">{icon}</div>
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-5xl font-black italic text-white drop-shadow-lg">{value}</div>
  </div>
);

export default StatsBoard;
