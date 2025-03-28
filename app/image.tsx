import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

interface ImageUploadProps {
  onUpload: (imageUri: string) => void;
  maxSizeMB?: number;
  storageKey?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  maxSizeMB = 2,
  storageKey,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved image on component mount
  React.useEffect(() => {
    const loadSavedImage = async () => {
      if (storageKey) {
        try {
          const savedUri = await FileSystem.readAsStringAsync(
            `${FileSystem.documentDirectory}${storageKey}`
          );
          if (savedUri) {
            setImageUri(savedUri);
            onUpload(savedUri);
          }
        } catch (error) {
          // File doesn't exist or other error - ignore
        }
      }
    };

    loadSavedImage();
  }, [storageKey]);

  const pickImage = useCallback(async () => {
    setIsLoading(true);
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera roll permissions to select images');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        
        // Check file size
        const fileInfo = await FileSystem.getInfoAsync(selectedAsset.uri);
        if (fileInfo.size && fileInfo.size > maxSizeMB * 1024 * 1024) {
          Alert.alert('File too large', `Maximum size is ${maxSizeMB}MB`);
          return;
        }

        // For iOS, we may need to move the file to a permanent location
        let finalUri = selectedAsset.uri;
        if (selectedAsset.uri.startsWith('ph://')) {
          // Handle PH assets (iOS Photos library)
          const localUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
          await FileSystem.copyAsync({
            from: selectedAsset.uri,
            to: localUri,
          });
          finalUri = localUri;
        }

        setImageUri(finalUri);
        onUpload(finalUri);

        // Save to persistent storage if key provided
        if (storageKey) {
          await FileSystem.writeAsStringAsync(
            `${FileSystem.documentDirectory}${storageKey}`,
            finalUri
          );
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    } finally {
      setIsLoading(false);
    }
  }, [maxSizeMB, storageKey]);

  const clearImage = async () => {
    setImageUri(null);
    onUpload('');

    if (storageKey) {
      try {
        await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${storageKey}`);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.changeButton]}
              onPress={pickImage}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Change Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.removeButton]}
              onPress={clearImage}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.uploadButton]}
          onPress={pickImage}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      )}
      {isLoading && <Text style={styles.loadingText}>Processing...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  previewContainer: {
    alignItems: 'center',
    width: '100%',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    minWidth: 120,
  },
  uploadButton: {
    backgroundColor: '#2196F3',
  },
  changeButton: {
    backgroundColor: '#FF9800',
  },
  removeButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 5,
    color: '#666',
  },
});

export default ImageUpload;