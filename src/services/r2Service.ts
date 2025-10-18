import { getR2Url } from '../config/environment';
import { Track } from '../types';

interface R2File {
  name: string;
  size: number;
  lastModified: string;
}

class R2Service {
  private readonly SONGS_FOLDER = 'songs/';

  // Fetch list of MP3 files from R2 bucket
  async fetchMusicFiles(): Promise<Track[]> {
    try {
      console.log('Fetching music files from R2...');
      
      // Since R2 doesn't have a direct API for listing files without credentials,
      // we'll use a predefined list based on your uploaded files
      // You can update this list when you add new files
      
      const musicFiles = [
        '001.mp3', // Your uploaded file
        // Add more files as you upload them
        // '002.mp3',
        // '003.mp3',
      ];

      const tracks: Track[] = [];

      // Create tracks synchronously to avoid async issues
      for (const fileName of musicFiles) {
        console.log(`Processing file: ${fileName}`);
        try {
          const track = this.createTrackFromFileNameSync(fileName);
          if (track) {
            console.log(`Created track: ${track.title}`);
            tracks.push(track);
          }
        } catch (error) {
          console.error(`Error creating track for ${fileName}:`, error);
        }
      }

      console.log(`Successfully created ${tracks.length} tracks`);
      return tracks;
    } catch (error) {
      console.error('Failed to fetch music files:', error);
      return [];
    }
  }

  // Create track object from file name (synchronous version)
  private createTrackFromFileNameSync(fileName: string): Track | null {
    try {
      const fileId = fileName.replace('.mp3', '');
      const audioUrl = getR2Url(`${this.SONGS_FOLDER}${fileName}`);
      
      // Create a track object with the file name as title
      const track: Track = {
        id: fileId,
        title: this.formatFileName(fileName),
        artist: 'Unknown Artist', // You can update this later
        albumArt: 'https://via.placeholder.com/300x300/007AFF/ffffff?text=Music', // Default album art
        audioUrl: audioUrl,
        genre: 'Music',
        duration: '0:00', // Will be updated when file is loaded
      };

      return track;
    } catch (error) {
      console.error(`Failed to create track for ${fileName}:`, error);
      return null;
    }
  }

  // Create track object from file name (async version)
  private async createTrackFromFileName(fileName: string): Promise<Track | null> {
    try {
      const fileId = fileName.replace('.mp3', '');
      const audioUrl = getR2Url(`${this.SONGS_FOLDER}${fileName}`);
      
      // Create a track object with the file name as title
      const track: Track = {
        id: fileId,
        title: this.formatFileName(fileName),
        artist: 'Unknown Artist', // You can update this later
        albumArt: 'https://via.placeholder.com/300x300/007AFF/ffffff?text=Music', // Default album art
        audioUrl: audioUrl,
        genre: 'Music',
        duration: '0:00', // Will be updated when file is loaded
      };

      return track;
    } catch (error) {
      console.error(`Failed to create track for ${fileName}:`, error);
      return null;
    }
  }

  // Format file name for display
  private formatFileName(fileName: string): string {
    // Remove .mp3 extension
    let displayName = fileName.replace('.mp3', '');
    
    // Replace underscores and hyphens with spaces
    displayName = displayName.replace(/[_-]/g, ' ');
    
    // Capitalize first letter of each word
    displayName = displayName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return displayName;
  }

  // Check if a file exists on the server
  async checkFileExists(fileName: string): Promise<boolean> {
    try {
      const fileUrl = getR2Url(`${this.SONGS_FOLDER}${fileName}`);
      const response = await fetch(fileUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error(`Failed to check if file exists: ${fileName}`, error);
      return false;
    }
  }

  // Get file info (size, last modified, etc.)
  async getFileInfo(fileName: string): Promise<{ size: number; lastModified: string } | null> {
    try {
      const fileUrl = getR2Url(`${this.SONGS_FOLDER}${fileName}`);
      const response = await fetch(fileUrl, { method: 'HEAD' });
      
      if (!response.ok) {
        return null;
      }

      const size = parseInt(response.headers.get('content-length') || '0');
      const lastModified = response.headers.get('last-modified') || new Date().toISOString();

      return { size, lastModified };
    } catch (error) {
      console.error(`Failed to get file info for ${fileName}:`, error);
      return null;
    }
  }

  // Get album art URL for a track (if you have covers folder)
  getAlbumArtUrl(trackId: string): string {
    return getR2Url(`covers/${trackId}.jpg`);
  }

  // Get audio URL for a track
  getAudioUrl(fileName: string): string {
    return getR2Url(`${this.SONGS_FOLDER}${fileName}`);
  }
}

// Export singleton instance
export const r2Service = new R2Service();
