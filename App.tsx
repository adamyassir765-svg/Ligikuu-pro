
import React, { useState, useEffect } from 'react';
import { Home, Trophy, Users, Calendar, MessageSquare, ShieldCheck, Smartphone, Bell, BellDot, Globe } from 'lucide-react';
import Dashboard from './components/Dashboard';
import LeagueManager from './components/LeagueManager';
import TeamManager from './components/TeamManager';
import MatchCenter from './components/MatchCenter';
import StatsBoard from './components/StatsBoard';
import AdminPanel from './components/AdminPanel';
import CommunityChat from './components/CommunityChat';
import MatchTicker from './components/MatchTicker';
import NotificationCenter from './components/NotificationCenter';
import { AppState, AppNotification } from './types';
import { translations } from './translations';

const App: React.FC = () => {
  const STORAGE_KEY = 'ligi_kuu_pro_final_standard_v2';

  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const defaultState: AppState = { 
        leagues: [], 
        activeLeagueId: null,
        messages: [],
        language: 'sw',
        notifications: [
          { id: '1', title: 'Karibu Ligi Kuu Pro!', message: 'Dhibiti ligi zako kwa urahisi, chati na wenzako, na pata matokeo mubashara.', timestamp: new Date().toISOString(), isRead: false, type: 'info' }
        ],
        adConfig: { 
          showAds: true, 
          banners: [
            { id: 'd1', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070', linkUrl: '#', position: 'top', isActive: true },
            { id: 'd2', imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2070', linkUrl: '#', position: 'top', isActive: true }
          ] 
        }
      };
      return saved ? JSON.parse(saved) : defaultState;
    } catch (e) {
      return { leagues: [], activeLeagueId: null, messages: [], notifications: [], language: 'sw', adConfig: { showAds: true, banners: [] } };
    }
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'leagues' | 'teams' | 'matches' | 'stats' | 'chat' | 'admin'>('dashboard');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showInstallOverlay, setShowInstallOverlay] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (!isStandalone) {
      const timer = setTimeout(() => setShowInstallOverlay(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const activeLeague = state.leagues.find(l => l.id === state.activeLeagueId);
  const unreadCount = state.notifications.filter(n => !n.isRead).length;
  const t = translations[state.language];

  const toggleLanguage = () => {
    setState(prev => ({ ...prev, language: prev.language === 'sw' ? 'en' : 'sw' }));
  };

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'alert' = 'info', imageUrl?: string) => {
    const newNotif: AppNotification = {
      id: crypto.randomUUID(),
      title,
      message,
      imageUrl,
      timestamp: new Date().toISOString(),
      isRead: false,
      type
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications].slice(0, 15)
    }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] text-slate-100 overflow-hidden font-sans">
      <div className="fixed top-0 left-0 right-0 z-[60] h-14 bg-black/60 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-4 md:px-10">
        <div className="flex-1 max-w-xl md:max-w-2xl overflow-hidden h-full">
           <MatchTicker leagues={state.leagues} />
        </div>
        <div className="flex items-center gap-2 md:gap-4 ml-2">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
          >
            <Globe className="w-3.5 h-3.5" />
            {state.language === 'sw' ? 'EN' : 'SW'}
          </button>

          <button 
            onClick={() => { setShowNotifications(!showNotifications); setState(s => ({...s, notifications: s.notifications.map(n => ({...n, isRead: true}))})); }}
            className={`p-2 rounded-xl transition-all ${unreadCount > 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-900 text-slate-500 border border-white/5'}`}
          >
            {unreadCount > 0 ? <BellDot className="w-4 h-4 animate-bounce" /> : <Bell className="w-4 h-4" />}
          </button>
          
          {showNotifications && (
            <div className="absolute top-14 right-0 w-80 md:w-96 shadow-2xl">
              <NotificationCenter 
                notifications={state.notifications} 
                onClose={() => setShowNotifications(false)} 
                onClear={() => setState(s => ({...s, notifications: []}))}
              />
            </div>
          )}
        </div>
      </div>

      <nav className="w-full md:w-64 glass-card border-r border-white/5 flex flex-row md:flex-col items-center md:items-stretch py-2 md:py-8 px-3 z-40 fixed bottom-0 md:relative md:pt-20 shadow-2xl">
        <div className="hidden md:flex items-center gap-3 px-6 mb-10">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter italic text-white">LIGI <span className="text-blue-500">PRO</span></h1>
        </div>

        <div className="flex flex-row md:flex-col justify-around md:justify-start w-full gap-2 overflow-x-auto no-scrollbar">
          <NavItem icon={<Home size={20} />} label={t.dashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Trophy size={20} />} label={t.leagues} active={activeTab === 'leagues'} onClick={() => setActiveTab('leagues')} />
          <NavItem icon={<Users size={20} />} label={t.teams} active={activeTab === 'teams'} disabled={!state.activeLeagueId} onClick={() => setActiveTab('teams')} />
          <NavItem icon={<Calendar size={20} />} label={t.matches} active={activeTab === 'matches'} disabled={!state.activeLeagueId} onClick={() => setActiveTab('matches')} />
          <NavItem icon={<MessageSquare size={20} />} label={t.chat} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <NavItem icon={<ShieldCheck size={20} />} label={t.admin} active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto pb-40 md:pb-16 pt-20 md:pt-24 custom-scrollbar">
        <div className="p-4 md:p-12 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard state={state} onSelectLeague={(id) => { setState(s => ({...s, activeLeagueId: id})); setActiveTab('leagues'); }} />}
          {activeTab === 'leagues' && <LeagueManager state={state} onAddLeague={(l) => { setState(s => ({...s, leagues: [...s.leagues, l], activeLeagueId: l.id})); setActiveTab('teams'); addNotification('Ligi Mpya!', `Umeunda ligi ya ${l.name}. Hongera!`, 'success'); }} onDeleteLeague={(id) => setState(s => ({...s, leagues: s.leagues.filter(l => l.id !== id)}))} onSelectLeague={(id) => setState(s => ({...s, activeLeagueId: id}))} />}
          {activeTab === 'teams' && activeLeague && <TeamManager league={activeLeague} onUpdateLeague={(upd) => setState(s => ({...s, leagues: s.leagues.map(l => l.id === upd.id ? upd : l)}))} />}
          {activeTab === 'matches' && activeLeague && <MatchCenter league={activeLeague} onUpdateLeague={(upd) => setState(s => ({...s, leagues: s.leagues.map(l => l.id === upd.id ? upd : l)}))} onMatchCompleted={(m) => addNotification('Matokeo!', `Mechi imekwisha: ${m}`, 'info')} />}
          {activeTab === 'chat' && <CommunityChat messages={state.messages} onSendMessage={(msg) => setState(s => ({...s, messages: [...s.messages, msg].slice(-100)}))} />}
          {activeTab === 'admin' && <AdminPanel state={state} onAuthSuccess={() => setIsAdminAuthenticated(true)} authenticated={isAdminAuthenticated} onUpdateState={setState} onSendNotification={addNotification} />}
        </div>
      </main>

      {showInstallOverlay && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in">
           <div className="glass-card w-full max-w-md p-10 rounded-[3rem] border border-blue-500/30 text-center shadow-2xl">
              <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/40 animate-pulse">
                <Smartphone className="text-white w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black uppercase italic text-white mb-6 tracking-tighter">{t.installTitle}</h2>
              <p className="text-slate-400 text-[10px] font-bold mb-10 leading-relaxed uppercase tracking-widest text-center">
                BOSS, ILI UWE UNAPATA TAARIFA ZA MECHI KWA HARAKA, WEKA HII APP KWENYE SIMU YAKO.<br/><br/>
                1. {t.installStep1}<br/>
                2. {t.installStep2}
              </p>
              <button onClick={() => setShowInstallOverlay(false)} className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black uppercase text-[11px] shadow-xl active:scale-95 transition-all">{t.installBtn}</button>
           </div>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void, disabled?: boolean }> = ({ icon, label, active, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col md:flex-row items-center gap-1.5 md:gap-4 p-3 md:px-6 md:py-4 rounded-2xl transition-all ${
      disabled ? 'opacity-10 cursor-not-allowed grayscale' :
      active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="text-[7px] md:text-xs font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

export default App;
