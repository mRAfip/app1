import React from 'react';
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
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const { height: screenHeight } = Dimensions.get('window');

// Simple mock data for testing - NO R2 CONNECTION
const simpleTracks = [
  {
    id: '001',
    title: 'Test Track 001',
    artist: 'Test Artist',
    albumArt: 'https://via.placeholder.com/300x300/007AFF/ffffff?text=Music',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Test audio file
    genre: 'Music',
    duration: '0:00',
  },
];

export default function SimpleHomeScreen() {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayPause,
  } = useAudioPlayer();

  const renderMusicItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.musicItem}
      onPress={() => playTrack(item)}
    >
      <Image source={{ uri: item.albumArt }} style={styles.albumArt} />
      <View style={styles.musicInfo}>
        <Text style={styles.timeAndTags}>Server • #music</Text>
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
            {/* Storage button temporarily disabled */}
            {/* <TouchableOpacity 
              style={styles.storageButton}
              onPress={() => setShowStorageManagement(true)}
            >
              <Text style={styles.storageButtonText}>💾</Text>
            </TouchableOpacity> */}
          </View>
        </View>
        
        {/* List Section - 80% of screen height */}
        <View style={styles.listSection}>
          <FlatList
            data={simpleTracks}
            renderItem={renderMusicItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
        
        <BottomPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onNext={() => {
            if (currentTrack) {
              const currentIndex = simpleTracks.findIndex(track => track.id === currentTrack.id);
              const nextIndex = (currentIndex + 1) % simpleTracks.length;
              playTrack(simpleTracks[nextIndex]);
            }
          }}
          onPrevious={() => {
            if (currentTrack) {
              const currentIndex = simpleTracks.findIndex(track => track.id === currentTrack.id);
              const prevIndex = currentIndex === 0 ? simpleTracks.length - 1 : currentIndex - 1;
              playTrack(simpleTracks[prevIndex]);
            }
          }}
        />

        {/* First Time Popup - TEMPORARILY DISABLED */}
        {/* <FirstTimePopup
          visible={showFirstTimePopup}
          onComplete={handleFirstTimeComplete}
          onSkip={handleFirstTimeSkip}
        /> */}

        {/* Storage Management - TEMPORARILY DISABLED */}
        {/* <StorageManagement
          visible={showStorageManagement}
          onClose={() => setShowStorageManagement(false)}
        /> */}
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
});
