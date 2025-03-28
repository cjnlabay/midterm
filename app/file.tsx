import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';

interface FileUploadProps {
  onUpload: (files: { uri: string; name: string; mimeType: string | null; size: number }[]) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  storageKey?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  maxSizeMB = 5,
  allowedTypes = ['*/*'],
  multiple = false,
  storageKey,
}) => {
  const [files, setFiles] = useState<{ uri: string; name: string; mimeType: string | null; size: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved files on component mount
  React.useEffect(() => {
    const loadSavedFiles = async () => {
      if (storageKey) {
        try {
          const savedFiles = await FileSystem.readAsStringAsync(
            `${FileSystem.documentDirectory}${storageKey}`
          );
          if (savedFiles) {
            const parsedFiles = JSON.parse(savedFiles);
            setFiles(parsedFiles);
            onUpload(parsedFiles);
          }
        } catch (error) {
          // File doesn't exist or other error - ignore
        }
      }
    };

    loadSavedFiles();
  }, [storageKey]);

  const pickDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        multiple,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const validFiles: { uri: string; name: string; mimeType: string | null; size: number }[] = [];

        for (const asset of result.assets) {
          // Check file size
          const fileInfo = await FileSystem.getInfoAsync(asset.uri);
          if (fileInfo.size && fileInfo.size > maxSizeMB * 1024 * 1024) {
            Alert.alert('File too large', `${asset.name} exceeds ${maxSizeMB}MB limit`);
            continue;
          }

          // For iOS, we may need to move the file to a permanent location
          let finalUri = asset.uri;
          if (asset.uri.startsWith('file://')) {
            const newUri = `${FileSystem.documentDirectory}${Date.now()}_${asset.name}`;
            await FileSystem.copyAsync({
              from: asset.uri,
              to: newUri,
            });
            finalUri = newUri;
          }

          validFiles.push({
            uri: finalUri,
            name: asset.name,
            mimeType: asset.mimeType,
            size: fileInfo.size || 0,
          });
        }

        if (validFiles.length > 0) {
          const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
          setFiles(updatedFiles);
          onUpload(updatedFiles);

          // Save to persistent storage if key provided
          if (storageKey) {
            await FileSystem.writeAsStringAsync(
              `${FileSystem.documentDirectory}${storageKey}`,
              JSON.stringify(updatedFiles)
            );
          }
        }
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to select files');
    } finally {
      setIsLoading(false);
    }
  }, [maxSizeMB, allowedTypes, multiple, storageKey, files]);

  const removeFile = async (index: number) => {
    const newFiles = [...files];
    const [removedFile] = newFiles.splice(index, 1);
    
    try {
      // Delete the file from storage
      await FileSystem.deleteAsync(removedFile.uri);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
    
    setFiles(newFiles);
    onUpload(newFiles);
    
    if (storageKey) {
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}${storageKey}`,
        JSON.stringify(newFiles)
      );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return 'insert-drive-file';
    
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('pdf')) return 'picture-as-pdf';
    if (mimeType.includes('word')) return 'description';
    if (mimeType.includes('excel')) return 'grid-on';
    if (mimeType.includes('zip')) return 'folder-zip';
    if (mimeType.includes('audio')) return 'audiotrack';
    if (mimeType.includes('video')) return 'video-file';
    
    return 'insert-drive-file';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={pickDocuments}
        disabled={isLoading}
      >
        <MaterialIcons name="cloud-upload" size={24} color="white" />
        <Text style={styles.buttonText}>
          {multiple ? 'Select Files' : 'Select File'}
        </Text>
      </TouchableOpacity>

      {files.length > 0 && (
        <ScrollView style={styles.fileListContainer}>
          <Text style={styles.fileListTitle}>
            {multiple ? `Selected Files (${files.length})` : 'Selected File'}
          </Text>
          {files.map((file, index) => (
            <View key={`${file.uri}-${index}`} style={styles.fileItem}>
              <View style={styles.fileInfo}>
                <MaterialIcons 
                  name={getFileIcon(file.mimeType)} 
                  size={24} 
                  color="#555" 
                  style={styles.fileIcon}
                />
                <View style={styles.fileDetails}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {formatFileSize(file.size)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFile(index)}
              >
                <MaterialIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <MaterialIcons name="hourglass-empty" size={24} color="#666" />
          <Text style={styles.loadingText}>Processing files...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fileListContainer: {
    maxHeight: 200,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
  },
  fileListTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    fontSize: 16,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    marginRight: 10,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: '#333',
  },
  fileSize: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  removeButton: {
    backgroundColor: '#F44336',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
  },
  loadingText: {
    color: '#666',
  },
});

export default FileUpload;