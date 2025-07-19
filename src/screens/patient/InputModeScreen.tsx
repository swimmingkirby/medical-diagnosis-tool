import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type InputModeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'InputMode'>;

export const InputModeScreen: React.FC = () => {
  const navigation = useNavigation<InputModeScreenNavigationProp>();
  const [selectedMode, setSelectedMode] = useState<'form' | 'voice' | null>(null);

  const handleModeSelect = (mode: 'form' | 'voice') => {
    setSelectedMode(mode);
  };

  const handleContinue = () => {
    if (!selectedMode) return;
    
    if (selectedMode === 'form') {
      navigation.navigate('PatientLookup');
    } else {
      navigation.navigate('VoiceEntry', { initialData: {} });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="New Patient Record" showBackButton />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Input Method</Text>
          <Text style={styles.subtitle}>
            How would you like to record patient information?
          </Text>
        </View>

        <View style={styles.modesContainer}>
          <Card style={styles.modeCard}>
            <TouchableOpacity
              style={[
                styles.modeOption,
                selectedMode === 'form' && styles.modeOptionSelected
              ]}
              onPress={() => handleModeSelect('form')}
            >
              <View style={styles.modeIcon}>
                <Text style={styles.modeIconText}>📝</Text>
              </View>
              <Text style={styles.modeTitle}>Form Entry</Text>
              <Text style={styles.modeDescription}>
                Enter patient details using traditional form fields
              </Text>
              <View style={styles.modeFeatures}>
                <Text style={styles.modeFeature}>• Quick and structured</Text>
                <Text style={styles.modeFeature}>• Guided input fields</Text>
                <Text style={styles.modeFeature}>• Validation included</Text>
              </View>
              {selectedMode === 'form' && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedIndicatorText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </Card>

          <Card style={styles.modeCard}>
            <TouchableOpacity
              style={[
                styles.modeOption,
                selectedMode === 'voice' && styles.modeOptionSelected
              ]}
              onPress={() => handleModeSelect('voice')}
            >
              <View style={styles.modeIcon}>
                <Text style={styles.modeIconText}>🎤</Text>
              </View>
              <Text style={styles.modeTitle}>Voice Recording</Text>
              <Text style={styles.modeDescription}>
                Record patient symptoms and history using voice
              </Text>
              <View style={styles.modeFeatures}>
                <Text style={styles.modeFeature}>• Natural conversation</Text>
                <Text style={styles.modeFeature}>• Auto transcription</Text>
                <Text style={styles.modeFeature}>• Multiple languages</Text>
              </View>
              {selectedMode === 'voice' && (
                <View style={styles.selectedIndicator}>
                  <Text style={styles.selectedIndicatorText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedMode && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedMode}
          >
            <Text style={styles.continueButtonText}>
              Continue with {selectedMode === 'form' ? 'Form' : selectedMode === 'voice' ? 'Voice' : 'Selected Method'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
  modesContainer: {
    flex: 1,
  },
  modeCard: {
    marginBottom: 16,
  },
  modeOption: {
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  modeOptionSelected: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  modeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modeIconText: {
    fontSize: 32,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  modeFeatures: {
    alignItems: 'flex-start',
  },
  modeFeature: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actions: {
    paddingVertical: 16,
  },
  continueButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 