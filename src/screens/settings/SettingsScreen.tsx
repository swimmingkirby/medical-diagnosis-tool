import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  // Settings state
  const [settings, setSettings] = useState({
    offlineMode: true,
    autoSave: true,
    voiceRecording: true,
    aiAnalysis: true,
    notifications: false,
    biometricAuth: false,
    darkMode: false,
    autoBackup: true,
  });

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Local Data',
      'This will delete all locally stored patient records. Records saved to blockchain will remain secure. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'Local data cleared successfully')
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export all local data as encrypted backup file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => Alert.alert('Success', 'Data exported to device storage')
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Shifaa',
      'Medical Diagnosis Assistant\nVersion 1.0.0\n\nBuilt for Gaza Hackathon\nMade with ❤️ for better healthcare\n\n© 2024 Shifaa Team',
      [{ text: 'OK' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'Need help?\n\n📧 Email: support@shifaa.app\n🌐 Web: shifaa.app/help\n📱 WhatsApp: +970-XX-XXXXX\n\nCommon topics:\n• Voice recording setup\n• Blockchain verification\n• Data privacy\n• Troubleshooting',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView style={styles.content}>
        {/* General Settings */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Offline Mode</Text>
                <Text style={styles.settingDescription}>Work without internet connection</Text>
              </View>
              <Switch
                value={settings.offlineMode}
                onValueChange={(value) => updateSetting('offlineMode', value)}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auto Save</Text>
                <Text style={styles.settingDescription}>Automatically save drafts</Text>
              </View>
              <Switch
                value={settings.autoSave}
                onValueChange={(value) => updateSetting('autoSave', value)}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Use dark theme</Text>
              </View>
              <Switch
                value={settings.darkMode}
                onValueChange={(value) => updateSetting('darkMode', value)}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
              />
            </View>
          </View>
        </Card>

        {/* Recording & AI */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recording & AI</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Voice Recording</Text>
                <Text style={styles.settingDescription}>Enable voice-to-text features</Text>
              </View>
              <Switch
                value={settings.voiceRecording}
                onValueChange={(value) => updateSetting('voiceRecording', value)}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>AI Analysis</Text>
                <Text style={styles.settingDescription}>Generate smart summaries</Text>
              </View>
              <Switch
                value={settings.aiAnalysis}
                onValueChange={(value) => updateSetting('aiAnalysis', value)}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
              />
            </View>

            <TouchableOpacity style={styles.settingButton}>
              <View style={styles.settingButtonContent}>
                <Ionicons name="mic" size={20} color="#333" />
                <Text style={styles.settingButtonText}>Voice Recording Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Security */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security & Privacy</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Biometric Authentication</Text>
                <Text style={styles.settingDescription}>Use fingerprint/face unlock</Text>
              </View>
              <Switch
                value={settings.biometricAuth}
                onValueChange={(value) => updateSetting('biometricAuth', value)}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>System notifications</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => updateSetting('notifications', value)}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
              />
            </View>

            <TouchableOpacity style={styles.settingButton}>
              <View style={styles.settingButtonContent}>
                <Ionicons name="lock-closed" size={20} color="#333" />
                <Text style={styles.settingButtonText}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <View style={styles.settingButtonContent}>
                <Ionicons name="shield" size={20} color="#333" />
                <Text style={styles.settingButtonText}>Security Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Storage Management */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storage Management</Text>
            
            <View style={styles.storageInfo}>
              <View style={styles.storageItem}>
                <Text style={styles.storageLabel}>Local Storage Used:</Text>
                <Text style={styles.storageValue}>24.5 MB</Text>
              </View>
              <View style={styles.storageItem}>
                <Text style={styles.storageLabel}>Patient Records:</Text>
                <Text style={styles.storageValue}>127 files</Text>
              </View>
              <View style={styles.storageItem}>
                <Text style={styles.storageLabel}>Voice Recordings:</Text>
                <Text style={styles.storageValue}>15.2 MB</Text>
              </View>
              <View style={styles.storageItem}>
                <Text style={styles.storageLabel}>Cache Data:</Text>
                <Text style={styles.storageValue}>2.1 MB</Text>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Auto Backup</Text>
                <Text style={styles.settingDescription}>Backup to blockchain automatically</Text>
              </View>
              <Switch
                value={settings.autoBackup}
                onValueChange={(value) => updateSetting('autoBackup', value)}
                trackColor={{ false: '#ccc', true: '#2196F3' }}
              />
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
              <Ionicons name="download" size={20} color="#fff" style={styles.actionButtonIcon} />
              <Text style={styles.actionButtonText}>Export All Data</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.dangerButton]} 
              onPress={handleClearData}
            >
              <Ionicons name="trash" size={20} color="#fff" style={styles.actionButtonIcon} />
              <Text style={[styles.actionButtonText, styles.dangerButtonText]}>Clear Local Data</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Blockchain */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blockchain</Text>
            
            <View style={styles.blockchainStatus}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Network:</Text>
                <View style={styles.statusValue}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Shifaa Health Chain</Text>
                </View>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Node Status:</Text>
                <Text style={styles.statusConnected}>Connected</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Sync Status:</Text>
                <Text style={styles.statusSynced}>Synced</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.settingButton}>
              <View style={styles.settingButtonContent}>
                <Ionicons name="settings" size={20} color="#333" />
                <Text style={styles.settingButtonText}>Blockchain Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <View style={styles.settingButtonContent}>
                <Ionicons name="search" size={20} color="#333" />
                <Text style={styles.settingButtonText}>View on Explorer</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* About & Help */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About & Support</Text>
            
            <TouchableOpacity style={styles.settingButton} onPress={handleAbout}>
              <View style={styles.settingButtonContent}>
                <Ionicons name="information-circle" size={20} color="#333" />
                <Text style={styles.settingButtonText}>About Shifaa</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton} onPress={handleHelp}>
              <View style={styles.settingButtonContent}>
                <Ionicons name="help-circle" size={20} color="#333" />
                <Text style={styles.settingButtonText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <View style={styles.settingButtonContent}>
                <Ionicons name="book" size={20} color="#333" />
                <Text style={styles.settingButtonText}>User Guide</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <View style={styles.settingButtonContent}>
                <Ionicons name="bug" size={20} color="#333" />
                <Text style={styles.settingButtonText}>Report Issue</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingButton}>
              <View style={styles.settingButtonContent}>
                <Ionicons name="star" size={20} color="#333" />
                <Text style={styles.settingButtonText}>Rate App</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Shifaa v1.0.0</Text>
          <Text style={styles.appTagline}>Made with ❤️ for Gaza</Text>
          <Text style={styles.appCopyright}>© 2024 Shifaa Team</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginLeft: 12,
  },
  storageInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  storageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  storageLabel: {
    fontSize: 14,
    color: '#666',
  },
  storageValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  dangerButtonText: {
    color: '#fff',
  },
  blockchainStatus: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  statusConnected: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  statusSynced: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  appVersion: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  appCopyright: {
    fontSize: 12,
    color: '#999',
  },
}); 