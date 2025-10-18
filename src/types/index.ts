export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  audioUrl?: string; // URL to MP3 file in R2 bucket
  genre: string;
  duration: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  totalTime: number;
  volume: number;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  coverArt: string;
}
