import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Card } from '../../components/common/Card';

type PermissionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Permissions'>;

export const PermissionsScreen: React.FC = () => {
  const navigation = useNavigation<PermissionsScreenNavigationProp>();
  const [microphoneGranted, setMicrophoneGranted] = useState(false);
  const [storageGranted, setStorageGranted] = useState(false);

  const requestMicrophonePermission = async () => {
    // TODO: Implement actual microphone permission request
    // For now, simulate permission grant
    setTimeout(() => {
      setMicrophoneGranted(true);
      Alert.alert('Permission Granted', 'Microphone access enabled');
    }, 500);
  };

  const requestStoragePermission = async () => {
    // TODO: Implement actual storage permission request
    // For now, simulate permission grant
    setTimeout(() => {
      setStorageGranted(true);
      Alert.alert('Permission Granted', 'Storage access enabled');
    }, 500);
  };

  const handleContinue = () => {
    if (microphoneGranted && storageGranted) {
      navigation.replace('MainTabs');
    } else {
      Alert.alert(
        'Permissions Required',
        'Please grant all permissions to continue using the app'
      );
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Limited Functionality',
      'Some features will be unavailable without permissions. Continue anyway?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => navigation.replace('MainTabs') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Permissions Required</Text>
        <Text style={styles.subtitle}>
          Shifaa needs these permissions to provide the best medical assistance
        </Text>
      </View>

      <View style={styles.permissionsList}>
        <Card>
          <View style={styles.permissionItem}>
            <View style={styles.permissionIcon}>
              <Text style={styles.iconText}>🎤</Text>
            </View>
            <View style={styles.permissionContent}>
              <Text style={styles.permissionTitle}>Microphone Access</Text>
              <Text style={styles.permissionDescription}>
                Record voice symptoms and medical history
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.permissionButton,
                microphoneGranted && styles.permissionButtonGranted
              ]}
              onPress={requestMicrophonePermission}
              disabled={microphoneGranted}
            >
              <Text style={[
                styles.permissionButtonText,
                microphoneGranted && styles.permissionButtonTextGranted
              ]}>
                {microphoneGranted ? '✓' : 'Grant'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card>
          <View style={styles.permissionItem}>
            <View style={styles.permissionIcon}>
              <Text style={styles.iconText}>💾</Text>
            </View>
            <View style={styles.permissionContent}>
              <Text style={styles.permissionTitle}>Storage Access</Text>
              <Text style={styles.permissionDescription}>
                Save patient records and medical data locally
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.permissionButton,
                storageGranted && styles.permissionButtonGranted
              ]}
              onPress={requestStoragePermission}
              disabled={storageGranted}
            >
              <Text style={[
                styles.permissionButtonText,
                storageGranted && styles.permissionButtonTextGranted
              ]}>
                {storageGranted ? '✓' : 'Grant'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!microphoneGranted || !storageGranted) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionsList: {
    flex: 1,
    paddingVertical: 16,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  permissionButtonGranted: {
    backgroundColor: '#10b981',
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  permissionButtonTextGranted: {
    fontSize: 16,
  },
  actions: {
    padding: 24,
  },
  continueButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
  },
}); 