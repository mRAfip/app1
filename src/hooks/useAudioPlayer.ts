import { useCallback, useEffect, useState } from 'react';
import { audioService } from '../services/audioService';
import { Track } from '../types';

export const useAudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize audio service on mount
  useEffect(() => {
    audioService.initialize();
    
    // Set up track finished callback
    audioService.onTrackFinished = () => {
      setIsPlaying(false);
    };

    return () => {
      audioService.cleanup();
    };
  }, []);

  // Update state from audio service
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(audioService.getCurrentTime());
      setTotalTime(audioService.getTotalTime());
      setIsPlaying(audioService.getIsPlaying());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load and play a track
  const playTrack = useCallback(async (track: Track) => {
    try {
      setIsLoading(true);
      await audioService.loadTrack(track);
      await audioService.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play track:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (!currentTrack) return;

    try {
      if (isPlaying) {
        await audioService.pause();
        setIsPlaying(false);
      } else {
        await audioService.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Failed to toggle play/pause:', error);
    }
  }, [currentTrack, isPlaying]);

  // Play next track
  const playNext = useCallback(async (tracks: Track[]) => {
    if (!currentTrack) return;

    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    
    await playTrack(nextTrack);
  }, [currentTrack, playTrack]);

  // Play previous track
  const playPrevious = useCallback(async (tracks: Track[]) => {
    if (!currentTrack) return;

    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    const prevTrack = tracks[prevIndex];
    
    await playTrack(prevTrack);
  }, [currentTrack, playTrack]);

  // Seek to specific position
  const seekTo = useCallback(async (positionMillis: number) => {
    try {
      await audioService.seekTo(positionMillis);
      setCurrentTime(positionMillis);
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  }, []);

  // Stop playback
  const stop = useCallback(async () => {
    try {
      await audioService.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (error) {
      console.error('Failed to stop:', error);
    }
  }, []);

  // Get progress percentage
  const getProgress = useCallback(() => {
    return totalTime > 0 ? currentTime / totalTime : 0;
  }, [currentTime, totalTime]);

  // Format time in MM:SS format
  const formatTime = useCallback((millis: number) => {
    const seconds = Math.floor(millis / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    currentTrack,
    isPlaying,
    currentTime,
    totalTime,
    isLoading,
    playTrack,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    stop,
    getProgress,
    formatTime,
  };
};
