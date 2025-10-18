import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface PlayerScreenProps {
  currentTrack: any;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function PlayerScreen({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious 
}: PlayerScreenProps) {
  const router = useRouter();
  const { currentTime, totalTime, seekTo, formatTime } = useAudioPlayer();

  const progress = totalTime > 0 ? currentTime / totalTime : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.playingFrom}>Playing from</Text>
          <Text style={styles.playlistName}>Poll, Top Tracks this Week, All Genres ↓</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.moreButton}>⋯</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.albumContainer}>
        <Image source={{ uri: currentTrack.albumArt }} style={styles.albumArt} />
      </View>

      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{currentTrack.title}</Text>
        <Text style={styles.artistName}>{currentTrack.artist}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <TouchableOpacity 
          style={styles.progressBar}
          onPress={(event) => {
            const { locationX } = event.nativeEvent;
            const progressBarWidth = event.currentTarget.offsetWidth || 300;
            const newPosition = (locationX / progressBarWidth) * totalTime;
            seekTo(newPosition);
          }}
        >
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          <View style={[styles.progressHandle, { left: `${progress * 100}%` }]} />
        </TouchableOpacity>
        <Text style={styles.timeText}>{formatTime(totalTime)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={onPrevious}>
          <Text style={styles.controlIcon}>⏮</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={onPlayPause}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={onNext}>
          <Text style={styles.controlIcon}>⏭</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.engagement}>
        <TouchableOpacity style={styles.engagementItem}>
          <Text style={styles.engagementIcon}>♡</Text>
          <Text style={styles.engagementText}>201</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.engagementItem}>
          <Text style={styles.engagementIcon}>💬</Text>
          <Text style={styles.engagementText}>18</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.engagementItem}>
          <Text style={styles.engagementIcon}>↗</Text>
          <Text style={styles.engagementText}>2,004</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.engagementItem}>
          <Text style={styles.engagementIcon}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    fontSize: 24,
    color: '#000',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  playingFrom: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  playlistName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  moreButton: {
    fontSize: 20,
    color: '#000',
  },
  albumContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  albumArt: {
    width: 300,
    height: 300,
    borderRadius: 20,
  },
  trackInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginHorizontal: 15,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 2,
  },
  progressHandle: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#000',
    borderRadius: 8,
    marginLeft: -8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  controlButton: {
    padding: 20,
  },
  controlIcon: {
    fontSize: 24,
    color: '#000',
  },
  playButton: {
    backgroundColor: '#000',
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  playIcon: {
    fontSize: 28,
    color: '#fff',
  },
  engagement: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  engagementItem: {
    alignItems: 'center',
  },
  engagementIcon: {
    fontSize: 20,
    color: '#000',
    marginBottom: 4,
  },
  engagementText: {
    fontSize: 12,
    color: '#666',
  },
});
