
export type SportType = 'Football' | 'Basketball' | 'Netball' | 'Volleyball';
export type TournamentFormat = 'League' | 'Knockout' | 'GroupStage';

export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  goals: number;
  assists: number;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  players: Player[];
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  status: 'Scheduled' | 'Completed';
  round: number;
  date: string;
  aiPrediction?: string;
  posterBg?: string;
  scorers?: {playerId: string, teamId: string, minute: number}[];
}

export interface League {
  id: string;
  name: string;
  logo: string;
  sport: SportType;
  format: TournamentFormat;
  teams: Team[];
  matches: Match[];
  status: 'Draft' | 'Active' | 'Finished';
  creatorName?: string;
}

export interface AdBanner {
  id: string;
  imageUrl: string;
  linkUrl: string;
  position: 'top' | 'middle' | 'bottom';
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isAdmin?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface AppState {
  leagues: League[];
  activeLeagueId: string | null;
  messages: ChatMessage[];
  notifications: AppNotification[];
  language: 'sw' | 'en';
  adConfig: {
    showAds: boolean;
    banners: AdBanner[];
  };
}
