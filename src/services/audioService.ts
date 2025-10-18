import { Audio } from 'expo-av';
import { Track } from '../types';
import { storageService } from './storageService';

class AudioService {
  private sound: Audio.Sound | null = null;
  private currentTrack: Track | null = null;
  private isPlaying: boolean = false;
  private currentTime: number = 0;
  private totalTime: number = 0;

  // Initialize audio service
  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to initialize audio service:', error);
    }
  }

  // Load and play a track
  async loadTrack(track: Track): Promise<void> {
    try {
      // Unload previous track if exists
      if (this.sound) {
        await this.sound.unloadAsync();
      }

      // Check if file is downloaded locally
      let audioUri = track.audioUrl || track.albumArt;
      
      try {
        const isDownloaded = await storageService.isFileDownloaded(track.id);
        if (isDownloaded) {
          const localPath = await storageService.getLocalPath(track.id);
          if (localPath) {
            audioUri = localPath;
            console.log(`Playing local file: ${localPath}`);
          }
        }
      } catch (error) {
        console.log('No local file found, using remote URL');
      }

      // Create new sound object
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false }
      );

      this.sound = sound;
      this.currentTrack = track;

      // Set up status update listener
      sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate.bind(this));

      // Get track duration
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        this.totalTime = status.durationMillis || 0;
      }

    } catch (error) {
      console.error('Failed to load track:', error);
      throw error;
    }
  }

  // Play current track
  async play(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.playAsync();
        this.isPlaying = true;
      } catch (error) {
        console.error('Failed to play track:', error);
      }
    }
  }

  // Pause current track
  async pause(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      } catch (error) {
        console.error('Failed to pause track:', error);
      }
    }
  }

  // Stop current track
  async stop(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        this.isPlaying = false;
        this.currentTime = 0;
      } catch (error) {
        console.error('Failed to stop track:', error);
      }
    }
  }

  // Seek to specific position
  async seekTo(positionMillis: number): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.setPositionAsync(positionMillis);
        this.currentTime = positionMillis;
      } catch (error) {
        console.error('Failed to seek track:', error);
      }
    }
  }

  // Handle playback status updates
  private onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      this.currentTime = status.positionMillis || 0;
      this.isPlaying = status.isPlaying || false;
      
      if (status.didJustFinish) {
        this.isPlaying = false;
        // Emit track finished event
        this.onTrackFinished?.();
      }
    }
  }

  // Callback for when track finishes
  onTrackFinished?: () => void;

  // Getters
  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  getTotalTime(): number {
    return this.totalTime;
  }

  getProgress(): number {
    if (this.totalTime === 0) return 0;
    return this.currentTime / this.totalTime;
  }

  // Cleanup
  async cleanup() {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
    this.currentTrack = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.totalTime = 0;
  }
}

// Export singleton instance
export const audioService = new AudioService();
