import { Audio } from 'expo-av';
import { Check, Download, Pause, Play, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ArabicSuraText } from '../components/ArabicSuraText';
import { DownloadPopup } from '../components/DownloadPopup';
import { getR2Url } from '../config/environment';
import { DownloadService } from '../services/downloadService';

const { height: screenHeight } = Dimensions.get('window');

// Arabic sura names mapping
const getArabicSuraName = (fileName: string): string => {
  const suraMap: { [key: string]: string } = {
    '001': 'الفاتحة',
    '002': 'البقرة',
    '003': 'آل عمران',
    '004': 'النساء',
    '005': 'المائدة',
    '006': 'الأنعام',
    '007': 'الأعراف',
    '008': 'الأنفال',
    '009': 'التوبة',
    '010': 'يونس',
    '011': 'هود',
    '012': 'يوسف',
    '013': 'الرعد',
    '014': 'إبراهيم',
    '015': 'الحجر',
    '016': 'النحل',
    '017': 'الإسراء',
    '018': 'الكهف',
    '019': 'مريم',
    '020': 'طه',
    '021': 'الأنبياء',
    '022': 'الحج',
    '023': 'المؤمنون',
    '024': 'النور',
    '025': 'الفرقان',
    '026': 'الشعراء',
    '027': 'النمل',
    '028': 'القصص',
    '029': 'العنكبوت',
    '030': 'الروم',
    '031': 'لقمان',
    '032': 'السجدة',
    '033': 'الأحزاب',
    '034': 'سبأ',
    '035': 'فاطر',
    '036': 'يس',
    '037': 'الصافات',
    '038': 'ص',
    '039': 'الزمر',
    '040': 'غافر',
    '041': 'فصلت',
    '042': 'الشورى',
    '043': 'الزخرف',
    '044': 'الدخان',
    '045': 'الجاثية',
    '046': 'الأحقاف',
    '047': 'محمد',
    '048': 'الفتح',
    '049': 'الحجرات',
    '050': 'ق',
    '051': 'الذاريات',
    '052': 'الطور',
    '053': 'النجم',
    '054': 'القمر',
    '055': 'الرحمن',
    '056': 'الواقعة',
    '057': 'الحديد',
    '058': 'المجادلة',
    '059': 'الحشر',
    '060': 'الممتحنة',
    '061': 'الصف',
    '062': 'الجمعة',
    '063': 'المنافقون',
    '064': 'التغابن',
    '065': 'الطلاق',
    '066': 'التحريم',
    '067': 'الملك',
    '068': 'القلم',
    '069': 'الحاقة',
    '070': 'المعارج',
    '071': 'نوح',
    '072': 'الجن',
    '073': 'المزمل',
    '074': 'المدثر',
    '075': 'القيامة',
    '076': 'الإنسان',
    '077': 'المرسلات',
    '078': 'النبأ',
    '079': 'النازعات',
    '080': 'عبس',
    '081': 'التكوير',
    '082': 'الانفطار',
    '083': 'المطففين',
    '084': 'الانشقاق',
    '085': 'البروج',
    '086': 'الطارق',
    '087': 'الأعلى',
    '088': 'الغاشية',
    '089': 'الفجر',
    '090': 'البلد',
    '091': 'الشمس',
    '092': 'الليل',
    '093': 'الضحى',
    '094': 'الشرح',
    '095': 'التين',
    '096': 'العلق',
    '097': 'القدر',
    '098': 'البينة',
    '099': 'الزلزلة',
    '100': 'العاديات',
    '101': 'القارعة',
    '102': 'التكاثر',
    '103': 'العصر',
    '104': 'الهمزة',
    '105': 'الفيل',
    '106': 'قريش',
    '107': 'الماعون',
    '108': 'الكوثر',
    '109': 'الكافرون',
    '110': 'النصر',
    '111': 'المسد',
    '112': 'الإخلاص',
    '113': 'الفلق',
    '114': 'الناس'
  };
  
  // Extract number from filename (e.g., "001.mp3" -> "001")
  const fileNumber = fileName.replace('.mp3', '').replace('songs/', '');
  return suraMap[fileNumber] || fileName.replace('.mp3', '');
};

// Recent played songs (last 5)
const getRecentPlayedSongs = (tracks: any[]) => {
  // For now, return the first 5 tracks as "recently played"
  // In a real app, this would come from user's play history
  return tracks.slice(0, 5).map((track, index) => ({
    id: track.id,
    title: track.title,
    subtitle: `Recently played • ${track.artist}`,
    track: track
  }));
};

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

  // Date and prayer time state
  const [currentDate, setCurrentDate] = useState('');
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [nextPrayer, setNextPrayer] = useState<{name: string, time: string} | null>(null);
  
  // Smart play state
  const [lastPlayedTrack, setLastPlayedTrack] = useState<any>(null);
  
  // Download popup state
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<any>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filteredTracks, setFilteredTracks] = useState<any[]>([]);
  
  // Download state
  const [downloadedTracks, setDownloadedTracks] = useState<string[]>([]);

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

  // Initialize date and prayer times
  useEffect(() => {
    updateCurrentDate();
    fetchPrayerTimes();
    
    // Update date every minute
    const dateInterval = setInterval(updateCurrentDate, 60000);
    
    return () => clearInterval(dateInterval);
  }, []);

  // Check download status and show popup if needed
  useEffect(() => {
    const checkDownloadStatus = async () => {
      try {
        const downloadStatus = await DownloadService.getDownloadStatus();
        const allDownloaded = await DownloadService.areAllTracksDownloaded(tracks);
        
        // Show popup if never shown before or if not all tracks downloaded
        if (downloadStatus === 'never_shown' || (!allDownloaded && downloadStatus === 'skipped')) {
          setShowDownloadPopup(true);
        }
      } catch (error) {
        console.error('Error checking download status:', error);
      }
    };

    if (tracks.length > 0) {
      checkDownloadStatus();
    }
  }, [tracks]);

  // Check downloaded tracks when component loads
  useEffect(() => {
    checkDownloadedTracks();
  }, []);

  const updateCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  };

  const fetchPrayerTimes = async () => {
    try {
      // Using Aladhan API for prayer times
      // You can change the city and country to your location
      const response = await fetch(
        'http://api.aladhan.com/v1/timingsByCity?city=Kochi&country=India&method=2'
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        setPrayerTimes(data.data.timings);
        findNextPrayer(data.data.timings);
      }
    } catch (error: any) {
      console.error('Failed to fetch prayer times:', error);
      // Fallback to static prayer time
      setNextPrayer({ name: 'ISHA', time: '7:17 PM' });
    }
  };

  const findNextPrayer = (timings: any) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    for (const prayer of prayerOrder) {
      const prayerTime = timings[prayer];
      if (prayerTime) {
        const [hours, minutes] = prayerTime.split(':').map(Number);
        const prayerMinutes = hours * 60 + minutes;
        
        if (prayerMinutes > currentTime) {
          setNextPrayer({ name: prayer, time: prayerTime });
          return;
        }
      }
    }
    
    // If no prayer found for today, show first prayer of next day
    setNextPrayer({ name: 'FAJR', time: timings.Fajr || '5:30 AM' });
  };

  const initializeAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error: any) {
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
      setFilteredTracks(fetchedTracks); // Initialize filtered tracks
      console.log(`Successfully fetched ${fetchedTracks.length} tracks from R2`);
    } catch (err: any) {
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
      setLastPlayedTrack(track); // Save as last played track

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

    } catch (error: any) {
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
    // Smart play logic: if no current track, play first track or resume last played
    if (!currentTrack) {
      if (lastPlayedTrack) {
        // Resume last played track
        console.log('Resuming last played track:', lastPlayedTrack.title);
        await playTrack(lastPlayedTrack);
      } else if (tracks.length > 0) {
        // Play first track if no last played track
        console.log('Playing first track:', tracks[0].title);
        await playTrack(tracks[0]);
      } else {
        console.log('No tracks available to play');
        return;
      }
      return;
    }

    // Normal play/pause logic for current track
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error: any) {
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

  // Download functions
  const handleDownloadAll = async () => {
    try {
      setDownloadProgress({ trackId: '', progress: 0, status: 'downloading' });
      
      const success = await DownloadService.downloadAllTracks(tracks, (progress) => {
        setDownloadProgress(progress);
      });
      
      if (success) {
        await DownloadService.setDownloadStatus('downloaded');
        setShowDownloadPopup(false);
      }
    } catch (error) {
      console.error('Error downloading tracks:', error);
    }
  };

  const handleSkipDownload = async () => {
    await DownloadService.setDownloadStatus('skipped');
    setShowDownloadPopup(false);
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredTracks(tracks);
    } else {
      const filtered = tracks.filter(track => {
        const arabicName = getArabicSuraName(track.title).toLowerCase();
        const englishName = track.title.toLowerCase();
        const searchTerm = query.toLowerCase();
        
        return arabicName.includes(searchTerm) || 
               englishName.includes(searchTerm) ||
               track.title.includes(query);
      });
      setFilteredTracks(filtered);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
      setFilteredTracks(tracks);
    }
  };

  // Check downloaded tracks
  const checkDownloadedTracks = async () => {
    try {
      const downloaded = await DownloadService.getDownloadedTracks();
      setDownloadedTracks(downloaded);
    } catch (error) {
      console.error('Error checking downloaded tracks:', error);
    }
  };

  // Individual track download
  const handleDownloadTrack = async (track: any) => {
    try {
      const success = await DownloadService.downloadTrack(track, (progress) => {
        console.log(`Downloading ${track.title}: ${progress}%`);
      });
      
      if (success) {
        alert(`${track.title} downloaded successfully!`);
        // Update downloaded tracks list
        await checkDownloadedTracks();
      } else {
        alert(`Failed to download ${track.title}`);
      }
    } catch (error) {
      console.error('Error downloading track:', error);
      alert('Download failed. Please try again.');
    }
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
      
    } catch (error: any) {
      console.error('R2 URL test failed:', error);
      alert(`❌ R2 URL test failed: ${error.message}\n\nThis is likely a CORS issue. Please configure CORS in your R2 bucket settings.`);
    }
  };
  const renderQuickAccessItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.quickAccessCard}
      onPress={() => playTrack(item.track)}
    >
      <ArabicSuraText 
        suraName={getArabicSuraName(item.track.title)} 
        size={80} 
      />
    </TouchableOpacity>
  );

  const renderMusicItem = ({ item }: { item: any }) => {
    const isDownloaded = downloadedTracks.includes(item.id);
    
    return (
      <TouchableOpacity
        style={styles.musicItem}
        onPress={() => playTrack(item)}
      >
        <ArabicSuraText 
          suraName={getArabicSuraName(item.title)} 
          size={70} 
        />
        <View style={styles.musicInfo}>
          <Text style={styles.trackTitle}>{item.title}</Text>
          <Text style={styles.artist}>{item.artist}</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.downloadButton,
            isDownloaded && styles.downloadedButton
          ]}
          onPress={() => !isDownloaded && handleDownloadTrack(item)}
        >
          {isDownloaded ? (
            <Check size={20} color="#666" />
          ) : (
            <Download size={20} color="#007AFF" />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
        {/* Header Section with Title, Date, Search, and Prayer Time */}
        <View style={styles.headerSection}>
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.appTitle}>Quran Malayalam MP3</Text>
            <Text style={styles.currentDate}>{currentDate || 'Loading...'}</Text>
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={toggleSearch}>
            <Search size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Prayer Time Card */}
        <View style={styles.prayerTimeCard}>
          <View style={styles.prayerTimeLeft}>
            <Text style={styles.prayerName}>{nextPrayer?.name || 'ISHA'}</Text>
            <Text style={styles.prayerLocation}>Kochi, India</Text>
          </View>
          <View style={styles.prayerTimeRight}>
            <Text style={styles.prayerTime}>{nextPrayer?.time || '7:17 PM'}</Text>
          </View>
        </View>
      </View>

      {/* Search Input */}
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search sura by name or number..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>
      )}
      
      {/* Recent Played Section */}
      <View style={styles.quickAccessSection}>
        <Text style={styles.quickAccessTitle}>Recent Played</Text>
        <FlatList
          data={getRecentPlayedSongs(tracks)}
          renderItem={renderQuickAccessItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickAccessList}
        />
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
            data={isSearchVisible && searchQuery ? filteredTracks : tracks}
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
      {currentTrack && (
        <View style={styles.bottomPlayer}>
          <View style={styles.playerContent}>
            <ArabicSuraText 
              suraName={getArabicSuraName(currentTrack.title)} 
              size={50} 
            />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>
                {currentTrack.title}
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
                {isPlaying ? (
                  <Pause size={16} color="#fff" />
                ) : (
                  <Play size={16} color="#fff" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={playNext}>
                <Text style={styles.controlIcon}>⏭</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Floating Play Button */}
      <TouchableOpacity 
        style={[
          styles.floatingPlayButton,
          currentTrack && styles.floatingPlayButtonWithPlayer
        ]}
        onPress={togglePlayPause}
      >
        {isPlaying ? (
          <Pause size={24} color="#fff" />
        ) : (
          <Play size={24} color="#fff" />
        )}
      </TouchableOpacity>

      {/* Download Popup */}
      <DownloadPopup
        visible={showDownloadPopup}
        onClose={() => setShowDownloadPopup(false)}
        onDownload={handleDownloadAll}
        onSkip={handleSkipDownload}
        tracks={tracks}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  headerSection: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  currentDate: {
    fontSize: 14,
    color: '#ccc',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
    color: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#555',
  },
  prayerTimeCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prayerTimeLeft: {
    flex: 1,
  },
  prayerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  prayerLocation: {
    fontSize: 14,
    color: '#ccc',
  },
  prayerTimeRight: {
    alignItems: 'flex-end',
  },
  prayerTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  quickAccessSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  quickAccessList: {
    marginBottom: 5,
  },
  quickAccessCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    width: 120,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccessCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  quickAccessCardSubtitle: {
    fontSize: 12,
    color: '#ccc',
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
  downloadButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  downloadedButton: {
    backgroundColor: 'rgba(102, 102, 102, 0.1)',
  },
  bottomPlayer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
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
  floatingPlayButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingPlayButtonWithPlayer: {
    bottom: 100, // Move up when bottom player is visible
  },
  playerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
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
