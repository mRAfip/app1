import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

export interface DownloadProgress {
  trackId: string;
  progress: number;
  status: 'downloading' | 'completed' | 'error';
}

export class DownloadService {
  private static readonly DOWNLOADED_TRACKS_KEY = 'downloaded_tracks';
  private static readonly DOWNLOAD_STATUS_KEY = 'download_status';

  // Check if all tracks are downloaded
  static async areAllTracksDownloaded(tracks: any[]): Promise<boolean> {
    try {
      const downloadedTracks = await this.getDownloadedTracks();
      return downloadedTracks.length === tracks.length;
    } catch (error) {
      console.error('Error checking download status:', error);
      return false;
    }
  }

  // Get list of downloaded track IDs
  static async getDownloadedTracks(): Promise<string[]> {
    try {
      const downloaded = await AsyncStorage.getItem(this.DOWNLOADED_TRACKS_KEY);
      return downloaded ? JSON.parse(downloaded) : [];
    } catch (error) {
      console.error('Error getting downloaded tracks:', error);
      return [];
    }
  }

  // Download a single track
  static async downloadTrack(track: any, onProgress?: (progress: number) => void): Promise<boolean> {
    try {
      const fileName = `${track.id}.mp3`;
      const localUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Check if already downloaded
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (fileInfo.exists) {
        console.log(`Track ${track.id} already downloaded`);
        return true;
      }

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(
        track.audioUrl,
        localUri,
        {
          onProgress: (progress) => {
            const percent = (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) * 100;
            onProgress?.(percent);
          }
        }
      );

      if (downloadResult.status === 200) {
        // Save to downloaded tracks list
        const downloadedTracks = await this.getDownloadedTracks();
        if (!downloadedTracks.includes(track.id)) {
          downloadedTracks.push(track.id);
          await AsyncStorage.setItem(
            this.DOWNLOADED_TRACKS_KEY, 
            JSON.stringify(downloadedTracks)
          );
        }
        
        console.log(`Track ${track.id} downloaded successfully`);
        return true;
      } else {
        console.error(`Failed to download track ${track.id}:`, downloadResult.status);
        return false;
      }
    } catch (error) {
      console.error(`Error downloading track ${track.id}:`, error);
      return false;
    }
  }

  // Download all tracks
  static async downloadAllTracks(
    tracks: any[], 
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<boolean> {
    try {
      let successCount = 0;
      
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        
        onProgress?.({
          trackId: track.id,
          progress: 0,
          status: 'downloading'
        });

        const success = await this.downloadTrack(track, (progress) => {
          onProgress?.({
            trackId: track.id,
            progress,
            status: 'downloading'
          });
        });

        if (success) {
          successCount++;
          onProgress?.({
            trackId: track.id,
            progress: 100,
            status: 'completed'
          });
        } else {
          onProgress?.({
            trackId: track.id,
            progress: 0,
            status: 'error'
          });
        }
      }

      return successCount === tracks.length;
    } catch (error) {
      console.error('Error downloading all tracks:', error);
      return false;
    }
  }

  // Get local file URI for a track
  static async getLocalTrackUri(track: any): Promise<string | null> {
    try {
      const fileName = `${track.id}.mp3`;
      const localUri = `${FileSystem.documentDirectory}${fileName}`;
      
      const fileInfo = await FileSystem.getInfoAsync(localUri);
      return fileInfo.exists ? localUri : null;
    } catch (error) {
      console.error('Error getting local track URI:', error);
      return null;
    }
  }

  // Check if a track is downloaded
  static async isTrackDownloaded(trackId: string): Promise<boolean> {
    try {
      const downloadedTracks = await this.getDownloadedTracks();
      return downloadedTracks.includes(trackId);
    } catch (error) {
      console.error('Error checking if track is downloaded:', error);
      return false;
    }
  }

  // Clear all downloads
  static async clearAllDownloads(): Promise<void> {
    try {
      const downloadedTracks = await this.getDownloadedTracks();
      
      for (const trackId of downloadedTracks) {
        const fileName = `${trackId}.mp3`;
        const localUri = `${FileSystem.documentDirectory}${fileName}`;
        
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(localUri);
        }
      }
      
      await AsyncStorage.removeItem(this.DOWNLOADED_TRACKS_KEY);
      console.log('All downloads cleared');
    } catch (error) {
      console.error('Error clearing downloads:', error);
    }
  }

  // Get download status
  static async getDownloadStatus(): Promise<'never_shown' | 'skipped' | 'downloaded'> {
    try {
      const status = await AsyncStorage.getItem(this.DOWNLOAD_STATUS_KEY);
      return (status as any) || 'never_shown';
    } catch (error) {
      console.error('Error getting download status:', error);
      return 'never_shown';
    }
  }

  // Set download status
  static async setDownloadStatus(status: 'skipped' | 'downloaded'): Promise<void> {
    try {
      await AsyncStorage.setItem(this.DOWNLOAD_STATUS_KEY, status);
    } catch (error) {
      console.error('Error setting download status:', error);
    }
  }
}
