
import React from 'react';
import { League } from '../types';
import { Trophy } from 'lucide-react';

interface Props {
  leagues: League[];
}

const MatchTicker: React.FC<Props> = ({ leagues }) => {
  const allMatches = leagues.flatMap(l => 
    l.matches.filter(m => m.status === 'Scheduled').map(m => ({ 
      ...m, 
      leagueName: l.name, 
      sport: l.sport, 
      homeTeam: l.teams.find(t => t.id === m.homeTeamId),
      awayTeam: l.teams.find(t => t.id === m.awayTeamId)
    }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 10);

  if (allMatches.length === 0) return (
    <div className="h-full flex items-center justify-center overflow-hidden px-4">
        <div className="flex items-center gap-3 animate-pulse">
            <Trophy className="w-4 h-4 text-blue-500" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400">Karibu Ligi Kuu Pro • Dhibiti Ligi Zako Kitaalam • Karibu Ligi Kuu Pro</span>
        </div>
    </div>
  );

  return (
    <div className="h-full flex items-center overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 px-4 bg-gradient-to-r from-blue-700 to-blue-600 text-white flex items-center font-black text-[10px] uppercase italic tracking-tighter z-20 shadow-xl">
        MECHI LEO
      </div>
      
      <div className="flex animate-ticker whitespace-nowrap items-center h-full">
        {allMatches.concat(allMatches).map((match, i) => (
          <div key={`${match.id}-${i}`} className="flex items-center gap-6 mx-12 text-[12px] font-black tracking-tight">
            <span className="text-blue-500/60 uppercase text-[9px] font-black tracking-widest">{match.leagueName}</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src={match.homeTeam?.logo} className="w-6 h-6 rounded-md object-cover border border-white/10 shadow-sm" alt="" />
                <span className="text-white uppercase italic">{match.homeTeam?.name}</span>
              </div>
              <span className="text-blue-500 font-black italic text-sm">VS</span>
              <div className="flex items-center gap-2">
                <span className="text-white uppercase italic">{match.awayTeam?.name}</span>
                <img src={match.awayTeam?.logo} className="w-6 h-6 rounded-md object-cover border border-white/10 shadow-sm" alt="" />
              </div>
            </div>
            <div className="bg-blue-600/20 px-2 py-0.5 rounded text-[10px] text-blue-300 font-bold border border-blue-500/20">
              {new Date(match.date).toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default MatchTicker;
