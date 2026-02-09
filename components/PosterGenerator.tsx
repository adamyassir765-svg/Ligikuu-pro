
import React, { useState, useEffect, useRef } from 'react';
import { Match, Team } from '../types';
import { X, Sparkles, Download, Loader2, AlertCircle } from 'lucide-react';
import { generateMatchPosterPrompt, generatePosterImage } from '../services/geminiService';

interface Props {
  match: Match;
  teams: Team[];
  onClose: () => void;
}

const PosterGenerator: React.FC<Props> = ({ match, teams, onClose }) => {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  
  const home = teams.find(t => t.id === match.homeTeamId)!;
  const away = teams.find(t => t.id === match.awayTeamId)!;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('sw-TZ', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  useEffect(() => {
    const fetchPoster = async () => {
      setLoading(true);
      setError(null);
      try {
        const prompt = await generateMatchPosterPrompt(home.name, away.name);
        const imageUrl = await generatePosterImage(prompt);
        if (!imageUrl) throw new Error("Mchoro haujapatikana");
        setBgImage(imageUrl);
      } catch (err) {
        console.error(err);
        setError("AI imekwama kidogo. Tumejiandaa na muonekano mbadala.");
      } finally {
        setLoading(false);
      }
    };
    fetchPoster();
  }, [match]);

  const handleDownload = () => {
    if (!posterRef.current) return;
    const link = document.createElement('a');
    link.download = `LigiPro_Poster_${home.name}_vs_${away.name}.png`;
    // Ideally we would use html2canvas here for a perfect capture, 
    // but for now we provide a notification to screenshot as simple fallback
    alert("Kwenye baadhi ya vivinjari, gusa picha na uihifadhi (Long press) au piga Screenshot.");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] border border-white/10 my-8">
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-red-500 transition-all border border-white/10">
          <X className="w-6 h-6" />
        </button>

        <div ref={posterRef} className="aspect-[16/9] relative overflow-hidden bg-slate-950 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-6 text-blue-500 p-12">
              <div className="relative">
                <Loader2 className="w-20 h-20 animate-spin" />
                <Sparkles className="w-8 h-8 absolute -top-2 -right-2 text-amber-500 animate-pulse" />
              </div>
              <div className="text-center">
                <h4 className="font-black text-2xl uppercase italic text-white mb-2">AI Inachora...</h4>
                <p className="text-sm text-slate-500 italic max-w-xs uppercase tracking-widest font-bold">Tunatengeneza poster ya kipekee kwa ajili yako</p>
              </div>
            </div>
          ) : (
            <>
              {bgImage ? (
                <img src={bgImage} className="absolute inset-0 w-full h-full object-cover" alt="AI Generated BG" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black">
                   <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-8">
                <div className="bg-blue-600/20 backdrop-blur-xl px-10 py-3 rounded-full border border-blue-400/30 mb-8 shadow-2xl animate-in slide-in-from-top-4">
                  <span className="text-white text-xs md:text-sm font-black uppercase tracking-[0.5em] italic">MECHI KUBWA LEO</span>
                </div>

                <div className="flex items-center gap-6 md:gap-20 w-full justify-center">
                  <div className="flex-1 flex flex-col items-center gap-4 md:gap-8 animate-in slide-in-from-left-20 duration-1000">
                    <div className="relative group">
                      <div className="absolute -inset-6 bg-blue-600/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img src={home.logo} className="relative w-24 h-24 md:w-44 md:h-44 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white/20 rotate-[-2deg]" />
                    </div>
                    <h3 className="text-2xl md:text-5xl font-black text-white drop-shadow-2xl tracking-tighter uppercase italic">{home.name}</h3>
                  </div>

                  <div className="flex flex-col items-center animate-in zoom-in duration-700">
                     <div className="text-5xl md:text-8xl font-black text-blue-500 italic drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">VS</div>
                  </div>

                  <div className="flex-1 flex flex-col items-center gap-4 md:gap-8 animate-in slide-in-from-right-20 duration-1000">
                    <div className="relative group">
                      <div className="absolute -inset-6 bg-red-600/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <img src={away.logo} className="relative w-24 h-24 md:w-44 md:h-44 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white/20 rotate-[2deg]" />
                    </div>
                    <h3 className="text-2xl md:text-5xl font-black text-white drop-shadow-2xl tracking-tighter uppercase italic">{away.name}</h3>
                  </div>
                </div>

                <div className="mt-10 md:mt-16 space-y-2">
                  <p className="text-white/80 font-black text-lg md:text-2xl tracking-[0.3em] uppercase italic">{formatDate(match.date)}</p>
                  <p className="text-blue-400 font-black text-xs md:text-sm uppercase tracking-[0.4em] bg-blue-400/10 inline-block px-6 py-2 rounded-xl border border-blue-500/20">Uwanja wa Kimataifa • Ligi Kuu Pro</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
               <Sparkles className="w-8 h-8 text-blue-400" />
             </div>
             <div>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">AI Creative Manager</p>
               <h4 className="text-lg font-bold text-slate-200 uppercase">Poster Imekamilika</h4>
               {error && <p className="text-amber-500 text-[10px] font-bold uppercase mt-1 flex items-center gap-1"><AlertCircle size={10} /> {error}</p>}
             </div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button onClick={handleDownload} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 uppercase text-xs tracking-widest">
              <Download className="w-5 h-5" /> Pakua Sasa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterGenerator;
