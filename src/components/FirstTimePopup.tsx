import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getR2Url } from '../config/environment';
import { storageService } from '../services/storageService';

interface FirstTimePopupProps {
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export function FirstTimePopup({ visible, onComplete, onSkip }: FirstTimePopupProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  
  // Simple tracks for download
  const simpleTracks = [
    {
      id: '001',
      title: '001',
      artist: 'Unknown Artist',
      albumArt: 'https://via.placeholder.com/300x300/007AFF/ffffff?text=Music',
      audioUrl: getR2Url('songs/001.mp3'),
      genre: 'Music',
      duration: '0:00',
    },
  ];

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      // Initialize storage service
      await storageService.initialize();
      
      // Download all music files from server
      await storageService.downloadFiles(simpleTracks, (completed, total) => {
        const progress = completed / total;
        setDownloadProgress(progress);
        setCurrentFile(`Downloading ${completed} of ${total} files...`);
      });
      
      Alert.alert(
        'Download Complete!',
        'All music files have been downloaded successfully. You can now enjoy offline listening!',
        [{ text: 'Great!', onPress: onComplete }]
      );
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert(
        'Download Failed',
        'Some files could not be downloaded. You can still stream music online.',
        [
          { text: 'Try Again', onPress: handleDownload },
          { text: 'Skip', onPress: onSkip },
        ]
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Download',
      'You can download music files later from the settings. You can still stream music online.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip', onPress: onSkip },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to QRAN Music Player!</Text>
            <Text style={styles.subtitle}>
              Download music files for offline listening and reduce data usage
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.benefits}>
              <Text style={styles.benefitTitle}>Benefits of downloading:</Text>
              <Text style={styles.benefit}>• Listen offline without internet</Text>
              <Text style={styles.benefit}>• Faster playback (no buffering)</Text>
              <Text style={styles.benefit}>• Reduce data usage and costs</Text>
              <Text style={styles.benefit}>• Better battery life</Text>
            </View>

            {isDownloading && (
              <View style={styles.downloadSection}>
                <Text style={styles.downloadText}>{currentFile}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${downloadProgress * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(downloadProgress * 100)}% Complete
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.skipButton]}
              onPress={handleSkip}
              disabled={isDownloading}
            >
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.downloadButton]}
              onPress={handleDownload}
              disabled={isDownloading}
            >
              <Text style={styles.downloadButtonText}>
                {isDownloading ? 'Downloading...' : 'Download Music'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: screenWidth - 40,
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    marginBottom: 24,
  },
  benefits: {
    marginBottom: 20,
  },
  benefitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  benefit: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  downloadSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  downloadText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#f0f0f0',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
