import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface BottomPlayerProps {
  currentTrack: any;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function BottomPlayer({
  currentTrack,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}: BottomPlayerProps) {
  const router = useRouter();

  const handlePlayerPress = () => {
    router.push({
      pathname: '/player',
      params: {
        trackId: currentTrack.id,
        isPlaying: isPlaying.toString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.dragIndicator} />
      <TouchableOpacity style={styles.playerContent} onPress={handlePlayerPress}>
        <Image source={{ uri: currentTrack.albumArt }} style={styles.albumArt} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={onPrevious} style={styles.controlButton}>
            <Text style={styles.controlIcon}>⏮</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNext} style={styles.controlButton}>
            <Text style={styles.controlIcon}>⏭</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#d0d0d0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    width: '30%',
    backgroundColor: '#000',
    borderRadius: 2,
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
});
