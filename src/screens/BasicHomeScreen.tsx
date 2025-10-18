import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getR2Url } from '../config/environment';

const { height: screenHeight } = Dimensions.get('window');

export default function BasicHomeScreen() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Audio player state
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Initialize audio
  useEffect(() => {
    initializeAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Fetch tracks from R2
  useEffect(() => {
    fetchTracksFromR2();
  }, []);

  const initializeAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  const fetchTracksFromR2 = async () => {
    try {
      console.log('Fetching tracks from R2...');
      setIsLoading(true);
      setError(null);

      // Your R2 files
      const r2Files = [
        '001.mp3', // Your uploaded file
        // Add more files as you upload them
      ];

      const fetchedTracks = [];

      for (const fileName of r2Files) {
        const track = {
          id: fileName.replace('.mp3', ''),
          title: fileName.replace('.mp3', ''),
          artist: 'Unknown Artist',
          albumArt: 'https://via.placeholder.com/300x300/007AFF/ffffff?text=Music',
          audioUrl: getR2Url(`songs/${fileName}`),
          genre: 'Music',
          duration: '0:00',
        };
        fetchedTracks.push(track);
        console.log(`Added track: ${track.title} from R2`);
      }

      setTracks(fetchedTracks);
      console.log(`Successfully fetched ${fetchedTracks.length} tracks from R2`);
    } catch (err) {
      console.error('Failed to fetch tracks from R2:', err);
      setError('Failed to load music from server');
    } finally {
      setIsLoading(false);
    }
  };

  // Audio playback functions
  const playTrack = async (track: any) => {
    try {
      console.log('Playing track:', track.title, 'from URL:', track.audioUrl);
      
      // Test if URL is accessible first
      console.log('Testing URL accessibility...');
      const response = await fetch(track.audioUrl, { method: 'HEAD' });
      console.log('URL response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`URL not accessible: ${response.status}`);
      }
      
      // Stop current track if playing
      if (sound) {
        await sound.unloadAsync();
      }

      console.log('Creating audio object...');
      // Create new sound object
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: false } // Don't auto-play, let user control
      );

      console.log('Audio object created successfully');
      setSound(newSound);
      setCurrentTrack(track);

      // Set up status update listener
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        console.log('Playback status:', status);
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis || 0);
          setTotalTime(status.durationMillis || 0);
          setIsPlaying(status.isPlaying || false);
          
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });

      // Start playing
      await newSound.playAsync();
      setIsPlaying(true);
      console.log('Track started playing successfully');

    } catch (error) {
      console.error('Failed to play track:', error);
      console.error('Error details:', error);
      
      // More specific error messages
      if (error.message?.includes('URL not accessible')) {
        alert('Cannot access the audio file. Please check your R2 bucket configuration and CORS settings.');
      } else if (error.message?.includes('Network')) {
        alert('Network error. Please check your internet connection.');
      } else {
        alert(`Failed to play track: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Failed to toggle play/pause:', error);
    }
  };

  const playNext = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentTrack) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    playTrack(tracks[prevIndex]);
  };

  const formatTime = (millis: number) => {
    const seconds = Math.floor(millis / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Test R2 URL accessibility
  const testR2Url = async (track: any) => {
    try {
      console.log('Testing R2 URL:', track.audioUrl);
      
      // Try different methods to test the URL
      console.log('Method 1: Fetch with HEAD request');
      try {
        const response = await fetch(track.audioUrl, { 
          method: 'HEAD',
          mode: 'cors',
          cache: 'no-cache'
        });
        console.log('R2 URL Status:', response.status);
        console.log('R2 URL Headers:', response.headers);
        
        if (response.ok) {
          alert(`✅ R2 URL is accessible! Status: ${response.status}`);
          return;
        }
      } catch (fetchError) {
        console.log('HEAD request failed:', fetchError);
      }
      
      // Method 2: Try GET request
      console.log('Method 2: Fetch with GET request');
      try {
        const response = await fetch(track.audioUrl, { 
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache'
        });
        console.log('GET Status:', response.status);
        
        if (response.ok) {
          alert(`✅ R2 URL is accessible via GET! Status: ${response.status}`);
          return;
        }
      } catch (getError) {
        console.log('GET request failed:', getError);
      }
      
      // Method 3: Try with no-cors mode
      console.log('Method 3: Fetch with no-cors mode');
      try {
        const response = await fetch(track.audioUrl, { 
          method: 'GET',
          mode: 'no-cors'
        });
        console.log('No-cors response:', response);
        alert(`⚠️ R2 URL might be accessible but CORS is blocking. Check CORS settings.`);
        return;
      } catch (noCorsError) {
        console.log('No-cors request failed:', noCorsError);
      }
      
      alert(`❌ R2 URL not accessible. Check CORS configuration and public access settings.`);
      
    } catch (error) {
      console.error('R2 URL test failed:', error);
      alert(`❌ R2 URL test failed: ${error.message}\n\nThis is likely a CORS issue. Please configure CORS in your R2 bucket settings.`);
    }
  };
  const renderMusicItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.musicItem}
      onPress={() => playTrack(item)}
    >
      <Image source={{ uri: item.albumArt }} style={styles.albumArt} />
      <View style={styles.musicInfo}>
        <Text style={styles.timeAndTags}>R2 Server • #music</Text>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
      <View style={styles.trackActions}>
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => testR2Url(item)}
        >
          <Text style={styles.testButtonText}>Test</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section - 20% of screen height */}
      <View style={styles.headerSection}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Poll, Top Tracks this Week</Text>
        </View>
      </View>
      
      {/* List Section - 80% of screen height */}
      <View style={styles.listSection}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading music from R2...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchTracksFromR2}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : tracks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No music files found</Text>
            <Text style={styles.emptySubtext}>
              Make sure you have uploaded MP3 files to your R2 bucket
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={fetchTracksFromR2}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={tracks}
            renderItem={renderMusicItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            refreshing={isLoading}
            onRefresh={fetchTracksFromR2}
          />
        )}
      </View>
      
      {/* Bottom player with audio functionality */}
      <View style={styles.bottomPlayer}>
        <View style={styles.playerContent}>
          <Image 
            source={{ uri: currentTrack?.albumArt || 'https://via.placeholder.com/50x50/007AFF/ffffff?text=M' }} 
            style={styles.albumArt} 
          />
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>
              {currentTrack?.title || 'No track selected'}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: totalTime > 0 ? `${(currentTime / totalTime) * 100}%` : '0%' }
                ]} 
              />
            </View>
            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(totalTime)}
            </Text>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={playPrevious}>
              <Text style={styles.controlIcon}>⏮</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
              <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={playNext}>
              <Text style={styles.controlIcon}>⏭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  headerSection: {
    height: screenHeight * 0.2, // 20% of screen height
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  listSection: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  musicInfo: {
    flex: 1,
  },
  timeAndTags: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#ccc',
  },
  moreButton: {
    padding: 10,
  },
  trackActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  testButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  moreButton: {
    padding: 10,
  },
  moreIcon: {
    fontSize: 20,
    color: '#ccc',
  },
  bottomPlayer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  trackInfo: {
    flex: 1,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 10,
  },
  controlIcon: {
    fontSize: 18,
    color: '#000',
  },
  playButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  playIcon: {
    fontSize: 16,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#ccc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
