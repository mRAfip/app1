import { useCallback, useEffect, useState } from 'react';
import { r2Service } from '../services/r2Service';
import { Track } from '../types';

export const useServerMusic = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch music files from server
  const fetchMusicFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const serverTracks = await r2Service.fetchMusicFiles();
      setTracks(serverTracks);
    } catch (err) {
      console.error('Failed to fetch music files:', err);
      setError('Failed to load music files from server');
      // Set empty array as fallback to prevent crashes
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh music files
  const refreshMusicFiles = useCallback(async () => {
    await fetchMusicFiles();
  }, [fetchMusicFiles]);

  // Get track by ID
  const getTrackById = useCallback((id: string): Track | undefined => {
    return tracks.find(track => track.id === id);
  }, [tracks]);

  // Get next track
  const getNextTrack = useCallback((currentTrack: Track): Track | undefined => {
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    return tracks[nextIndex];
  }, [tracks]);

  // Get previous track
  const getPreviousTrack = useCallback((currentTrack: Track): Track | undefined => {
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    return tracks[prevIndex];
  }, [tracks]);

  // Load music files on mount
  useEffect(() => {
    // Add a small delay to prevent race conditions
    const timer = setTimeout(() => {
      fetchMusicFiles();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fetchMusicFiles]);

  return {
    tracks,
    isLoading,
    error,
    fetchMusicFiles,
    refreshMusicFiles,
    getTrackById,
    getNextTrack,
    getPreviousTrack,
  };
};
