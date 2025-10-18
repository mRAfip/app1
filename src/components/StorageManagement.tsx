import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getR2Url } from '../config/environment';
import { storageService } from '../services/storageService';

interface StorageManagementProps {
  visible: boolean;
  onClose: () => void;
}

export function StorageManagement({ visible, onClose }: StorageManagementProps) {
  const [storageUsage, setStorageUsage] = useState({ totalSize: 0, fileCount: 0 });
  const [downloadedFiles, setDownloadedFiles] = useState<any[]>([]);
  const [autoDownload, setAutoDownload] = useState(false);
  
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

  useEffect(() => {
    if (visible) {
      loadStorageInfo();
    }
  }, [visible]);

  const loadStorageInfo = async () => {
    try {
      const usage = await storageService.getStorageUsage();
      const files = await storageService.getDownloadedFiles();
      setStorageUsage(usage);
      setDownloadedFiles(files);
    } catch (error) {
      console.error('Failed to load storage info:', error);
    }
  };

  const handleDownloadAll = async () => {
    try {
      Alert.alert(
        'Download All Music',
        'This will download all music files for offline listening. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              try {
                await storageService.downloadFiles(simpleTracks);
                Alert.alert('Success', 'All music files downloaded successfully!');
                loadStorageInfo();
              } catch (error) {
                Alert.alert('Error', 'Failed to download some files');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      Alert.alert(
        'Delete File',
        'Are you sure you want to delete this file?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await storageService.deleteFile(fileId);
              loadStorageInfo();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      Alert.alert(
        'Clear All Files',
        'This will delete all downloaded music files. This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear All',
            style: 'destructive',
            onPress: async () => {
              await storageService.clearAllFiles();
              loadStorageInfo();
              Alert.alert('Success', 'All files cleared successfully!');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Clear all failed:', error);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Storage Management</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Storage Usage */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage Usage</Text>
            <View style={styles.usageCard}>
              <Text style={styles.usageText}>
                {storageService.formatFileSize(storageUsage.totalSize)}
              </Text>
              <Text style={styles.usageSubtext}>
                {storageUsage.fileCount} files downloaded
              </Text>
            </View>
          </View>

          {/* Auto Download */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Auto Download</Text>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Download new music automatically</Text>
              <Switch
                value={autoDownload}
                onValueChange={setAutoDownload}
                trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                thumbColor={autoDownload ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Download Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Download Music</Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleDownloadAll}>
              <Text style={styles.actionButtonText}>Download All Music</Text>
            </TouchableOpacity>
          </View>

          {/* Downloaded Files */}
          {downloadedFiles.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Downloaded Files</Text>
              {downloadedFiles.map((file) => (
                <View key={file.id} style={styles.fileItem}>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{file.fileName}</Text>
                    <Text style={styles.fileSize}>
                      {storageService.formatFileSize(file.size)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteFile(file.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Clear All */}
          {downloadedFiles.length > 0 && (
            <View style={styles.section}>
              <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                <Text style={styles.clearButtonText}>Clear All Files</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  usageCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  usageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  usageSubtext: {
    fontSize: 14,
    color: '#666',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
