
import React, { useState, useEffect } from 'react';
import { Match, Team } from '../types';
import { X, Sparkles, Download, Loader2 } from 'lucide-react';
import { generateMatchPosterPrompt, generatePosterImage } from '../services/geminiService';

interface Props {
  match: Match;
  teams: Team[];
  onClose: () => void;
}

const PosterGenerator: React.FC<Props> = ({ match, teams, onClose }) => {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const home = teams.find(t => t.id === match.homeTeamId)!;
  const away = teams.find(t => t.id === match.awayTeamId)!;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('sw-TZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  useEffect(() => {
    const fetchPoster = async () => {
      setLoading(true);
      const prompt = await generateMatchPosterPrompt(home.name, away.name);
      const imageUrl = await generatePosterImage(prompt);
      setBgImage(imageUrl);
      setLoading(false);
    };
    fetchPoster();
  }, [match]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 my-8">
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-black/80 transition-all">
          <X className="w-6 h-6" />
        </button>

        <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden bg-slate-800 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-6 text-blue-500 p-12">
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin" />
                <Sparkles className="w-6 h-6 absolute top-0 right-0 text-blue-300 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="font-black text-lg animate-pulse">AI Inatengeneza Poster...</p>
                <p className="text-sm text-slate-400 mt-2 italic">Tunatengeneza muonekano wa kipekee kwa ajili yako</p>
              </div>
            </div>
          ) : (
            <>
              {bgImage ? (
                <img src={bgImage} className="absolute inset-0 w-full h-full object-cover scale-105" alt="Poster Background" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black"></div>
              )}
              
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6 md:p-12">
                <div className="bg-blue-600/30 backdrop-blur-lg px-8 py-2 rounded-full border border-blue-400/30 mb-6 md:mb-10 shadow-2xl">
                  <span className="text-white text-xs md:text-sm font-black uppercase tracking-[0.4em]">Matangazo ya Mechi</span>
                </div>

                <div className="flex items-center gap-4 md:gap-16 w-full justify-center">
                  <div className="flex-1 flex flex-col items-center gap-3 md:gap-6 animate-in slide-in-from-left-12 duration-1000">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full"></div>
                      <img src={home.logo} className="relative w-20 h-20 md:w-32 md:h-32 rounded-[2rem] object-cover shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-white/10" />
                    </div>
                    <h3 className="text-xl md:text-4xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,1)] tracking-tighter uppercase italic">{home.name}</h3>
                  </div>

                  <div className="flex flex-col items-center">
                     <div className="text-4xl md:text-7xl font-black text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] italic">VS</div>
                     {match.status === 'Completed' && (
                       <div className="mt-2 text-2xl md:text-4xl font-black text-white">
                         {match.homeScore} - {match.awayScore}
                       </div>
                     )}
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-3 md:gap-6 animate-in slide-in-from-right-12 duration-1000">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-red-500/20 blur-2xl rounded-full"></div>
                      <img src={away.logo} className="relative w-20 h-20 md:w-32 md:h-32 rounded-[2rem] object-cover shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-white/10" />
                    </div>
                    <h3 className="text-xl md:text-4xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,1)] tracking-tighter uppercase italic">{away.name}</h3>
                  </div>
                </div>

                <div className="mt-8 md:mt-12 space-y-1 md:space-y-3">
                  <p className="text-white/90 font-black text-sm md:text-lg tracking-[0.2em] uppercase">{formatDate(match.date)}</p>
                  <p className="text-blue-400 font-black text-xs md:text-sm uppercase tracking-widest bg-blue-400/10 inline-block px-4 py-1 rounded-lg">Uwanja wa Kimataifa • Ligi Kuu AI</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/50">
          <div className="flex items-center gap-4">
             <div className="bg-blue-600/20 p-3 rounded-2xl">
               <Sparkles className="w-6 h-6 text-blue-400" />
             </div>
             <div>
               <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Powered by Gemini AI</p>
               <p className="text-sm md:text-base font-bold text-slate-200">Tangazo hili limetengenezwa kiotomatiki</p>
             </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-white text-black hover:bg-slate-200 px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95">
              <Download className="w-5 h-5" /> PAKUA POSTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterGenerator;
