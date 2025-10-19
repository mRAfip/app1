import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { BottomPlayer } from '../components/BottomPlayer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FirstTimePopup } from '../components/FirstTimePopup';
import { StorageManagement } from '../components/StorageManagement';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useServerMusic } from '../hooks/useServerMusic';

const { height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
    playNext,
    playPrevious,
  } = useAudioPlayer();

  const {
    tracks: serverTracks,
    isLoading: isLoadingTracks,
    error: tracksError,
    refreshMusicFiles,
    getNextTrack,
    getPreviousTrack,
  } = useServerMusic();

  const [showFirstTimePopup, setShowFirstTimePopup] = useState(false);
  const [showStorageManagement, setShowStorageManagement] = useState(false);

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasSeenPopup = await AsyncStorage.getItem('has_seen_first_time_popup');
      if (!hasSeenPopup) {
        setShowFirstTimePopup(true);
      }
    } catch (error) {
      console.error('Error checking first time user:', error);
    }
  };

  const handleFirstTimeComplete = async () => {
    try {
      await AsyncStorage.setItem('has_seen_first_time_popup', 'true');
      setShowFirstTimePopup(false);
    } catch (error) {
      console.error('Error saving first time popup status:', error);
    }
  };

  const handleFirstTimeSkip = async () => {
    try {
      await AsyncStorage.setItem('has_seen_first_time_popup', 'true');
      setShowFirstTimePopup(false);
    } catch (error) {
      console.error('Error saving first time popup status:', error);
    }
  };

  const renderMusicItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.musicItem}
      onPress={() => playTrack(item)}
    >
      <Image source={{ uri: item.albumArt }} style={styles.albumArt} />
      <View style={styles.musicInfo}>
        <Text style={styles.timeAndTags}>Server • #{item.genre.toLowerCase().replace(/[^a-z0-9]/g, '')} #music</Text>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreIcon}>⋯</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
      {/* Header Section - 20% of screen height */}
      <View style={styles.headerSection}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Poll, Top Tracks this Week</Text>
          <TouchableOpacity 
            style={styles.storageButton}
            onPress={() => setShowStorageManagement(true)}
          >
            <Text style={styles.storageButtonText}>💾</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* List Section - 80% of screen height */}
      <View style={styles.listSection}>
        {isLoadingTracks ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading music from server...</Text>
          </View>
        ) : tracksError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{tracksError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refreshMusicFiles}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : serverTracks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No music files found</Text>
            <Text style={styles.emptySubtext}>
              Make sure you have uploaded MP3 files to your R2 bucket
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={refreshMusicFiles}>
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={serverTracks}
            renderItem={renderMusicItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            refreshing={isLoadingTracks}
            onRefresh={refreshMusicFiles}
          />
        )}
      </View>
      
      <BottomPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={() => {
          if (currentTrack) {
            const nextTrack = getNextTrack(currentTrack);
            if (nextTrack) playTrack(nextTrack);
          }
        }}
        onPrevious={() => {
          if (currentTrack) {
            const prevTrack = getPreviousTrack(currentTrack);
            if (prevTrack) playTrack(prevTrack);
          }
        }}
      />

      {/* First Time Popup */}
      <FirstTimePopup
        visible={showFirstTimePopup}
        onComplete={handleFirstTimeComplete}
        onSkip={handleFirstTimeSkip}
      />

      {/* Storage Management */}
      <StorageManagement
        visible={showStorageManagement}
        onClose={() => setShowStorageManagement(false)}
      />
      </SafeAreaView>
    </ErrorBoundary>
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
  storageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storageButtonText: {
    fontSize: 20,
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
  moreIcon: {
    fontSize: 20,
    color: '#ccc',
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
