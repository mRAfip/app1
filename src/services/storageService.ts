import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Track } from '../types';

interface DownloadedFile {
  id: string;
  fileName: string;
  localPath: string;
  remoteUrl: string;
  size: number;
  downloadedAt: string;
}

class StorageService {
  private readonly STORAGE_KEY = 'downloaded_files';
  private readonly DOWNLOAD_DIR = `${FileSystem.documentDirectory}music/`;

  // Initialize storage service
  async initialize(): Promise<void> {
    try {
      // Create music directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(this.DOWNLOAD_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.DOWNLOAD_DIR, { intermediates: true });
      }
    } catch (error) {
      console.error('Failed to initialize storage service:', error);
    }
  }

  // Check if file is already downloaded
  async isFileDownloaded(trackId: string): Promise<boolean> {
    try {
      const downloadedFiles = await this.getDownloadedFiles();
      const file = downloadedFiles.find(f => f.id === trackId);
      
      if (!file) return false;
      
      // Check if file still exists on device
      const fileInfo = await FileSystem.getInfoAsync(file.localPath);
      return fileInfo.exists;
    } catch (error) {
      console.error('Error checking if file is downloaded:', error);
      return false;
    }
  }

  // Get local path for a track
  async getLocalPath(trackId: string): Promise<string | null> {
    try {
      const downloadedFiles = await this.getDownloadedFiles();
      const file = downloadedFiles.find(f => f.id === trackId);
      
      if (!file) return null;
      
      // Verify file still exists
      const fileInfo = await FileSystem.getInfoAsync(file.localPath);
      return fileInfo.exists ? file.localPath : null;
    } catch (error) {
      console.error('Error getting local path:', error);
      return null;
    }
  }

  // Download a single file
  async downloadFile(track: Track, onProgress?: (progress: number) => void): Promise<string> {
    try {
      if (!track.audioUrl) {
        throw new Error('No audio URL provided for track');
      }

      const fileName = `${track.id}.mp3`;
      const localPath = `${this.DOWNLOAD_DIR}${fileName}`;

      // Create download progress callback
      const downloadProgressCallback = (downloadProgress: FileSystem.DownloadProgressData) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        onProgress?.(progress);
      };

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(
        track.audioUrl,
        localPath,
        {
          progressCallback: downloadProgressCallback,
        }
      );

      if (downloadResult.status !== 200) {
        throw new Error(`Download failed with status: ${downloadResult.status}`);
      }

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      
      // Save download record
      const downloadedFile: DownloadedFile = {
        id: track.id,
        fileName,
        localPath,
        remoteUrl: track.audioUrl,
        size: fileInfo.size || 0,
        downloadedAt: new Date().toISOString(),
      };

      await this.saveDownloadedFile(downloadedFile);
      
      return localPath;
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error;
    }
  }

  // Download multiple files
  async downloadFiles(tracks: Track[], onProgress?: (completed: number, total: number) => void): Promise<void> {
    const total = tracks.length;
    let completed = 0;

    for (const track of tracks) {
      try {
        // Skip if already downloaded
        if (await this.isFileDownloaded(track.id)) {
          completed++;
          onProgress?.(completed, total);
          continue;
        }

        await this.downloadFile(track);
        completed++;
        onProgress?.(completed, total);
      } catch (error) {
        console.error(`Failed to download track ${track.id}:`, error);
        // Continue with next file even if one fails
      }
    }
  }

  // Get all downloaded files
  async getDownloadedFiles(): Promise<DownloadedFile[]> {
    try {
      const data = await AsyncStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting downloaded files:', error);
      return [];
    }
  }

  // Save downloaded file record
  private async saveDownloadedFile(file: DownloadedFile): Promise<void> {
    try {
      const downloadedFiles = await this.getDownloadedFiles();
      const existingIndex = downloadedFiles.findIndex(f => f.id === file.id);
      
      if (existingIndex >= 0) {
        downloadedFiles[existingIndex] = file;
      } else {
        downloadedFiles.push(file);
      }
      
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(downloadedFiles));
    } catch (error) {
      console.error('Error saving downloaded file:', error);
    }
  }

  // Delete a downloaded file
  async deleteFile(trackId: string): Promise<void> {
    try {
      const downloadedFiles = await this.getDownloadedFiles();
      const file = downloadedFiles.find(f => f.id === trackId);
      
      if (file) {
        // Delete physical file
        await FileSystem.deleteAsync(file.localPath, { idempotent: true });
        
        // Remove from records
        const updatedFiles = downloadedFiles.filter(f => f.id !== trackId);
        await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFiles));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  // Clear all downloaded files
  async clearAllFiles(): Promise<void> {
    try {
      const downloadedFiles = await this.getDownloadedFiles();
      
      // Delete all physical files
      for (const file of downloadedFiles) {
        await FileSystem.deleteAsync(file.localPath, { idempotent: true });
      }
      
      // Clear records
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing all files:', error);
    }
  }

  // Get storage usage
  async getStorageUsage(): Promise<{ totalSize: number; fileCount: number }> {
    try {
      const downloadedFiles = await this.getDownloadedFiles();
      let totalSize = 0;
      
      for (const file of downloadedFiles) {
        const fileInfo = await FileSystem.getInfoAsync(file.localPath);
        if (fileInfo.exists) {
          totalSize += fileInfo.size || 0;
        }
      }
      
      return {
        totalSize,
        fileCount: downloadedFiles.length,
      };
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return { totalSize: 0, fileCount: 0 };
    }
  }

  // Format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const storageService = new StorageService();
