import { Download, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface DownloadPopupProps {
  visible: boolean;
  onClose: () => void;
  onDownload: () => void;
  onSkip: () => void;
  tracks: any[];
}

export const DownloadPopup: React.FC<DownloadPopupProps> = ({
  visible,
  onClose,
  onDownload,
  onSkip,
  tracks,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        setDownloadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Call the actual download function
      await onDownload();
      
      Alert.alert('Success', 'All tracks downloaded successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to download tracks. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.header}>
            <Text style={styles.title}>Download for Offline Playback</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Download size={48} color="#007AFF" />
            </View>
            
            <Text style={styles.description}>
              Download all {tracks.length} tracks for the best offline experience
            </Text>
            
            <Text style={styles.benefits}>
              • Play without internet connection{'\n'}
              • Faster loading times{'\n'}
              • Reduced data usage
            </Text>
            
            {isDownloading && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${downloadProgress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  Downloading... {downloadProgress}%
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.buttons}>
            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={onSkip}
              disabled={isDownloading}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.downloadButton,
                isDownloading && styles.downloadButtonDisabled
              ]} 
              onPress={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Text style={styles.downloadButtonText}>Downloading...</Text>
              ) : (
                <>
                  <Download size={16} color="#fff" />
                  <Text style={styles.downloadButtonText}>Download All</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  benefits: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  buttons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  downloadButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  downloadButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
