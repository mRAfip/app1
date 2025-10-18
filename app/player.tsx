import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { mockMusicData } from '../src/data/mockData';
import PlayerScreen from '../src/screens/PlayerScreen';

export default function PlayerPage() {
  const { trackId, isPlaying } = useLocalSearchParams();
  const [currentTrack, setCurrentTrack] = useState(mockMusicData[0]);
  const [playing, setPlaying] = useState(isPlaying === 'true');

  useEffect(() => {
    if (trackId) {
      const track = mockMusicData.find(t => t.id === trackId);
      if (track) {
        setCurrentTrack(track);
      }
    }
  }, [trackId]);

  return (
    <PlayerScreen
      currentTrack={currentTrack}
      isPlaying={playing}
      onPlayPause={() => setPlaying(!playing)}
      onNext={() => {
        const currentIndex = mockMusicData.findIndex(track => track.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % mockMusicData.length;
        setCurrentTrack(mockMusicData[nextIndex]);
      }}
      onPrevious={() => {
        const currentIndex = mockMusicData.findIndex(track => track.id === currentTrack.id);
        const prevIndex = currentIndex === 0 ? mockMusicData.length - 1 : currentIndex - 1;
        setCurrentTrack(mockMusicData[prevIndex]);
      }}
    />
  );
}
