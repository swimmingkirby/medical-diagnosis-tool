import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { PatientData } from '../../types';

type VoiceEntryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VoiceEntry'>;
type VoiceEntryScreenRouteProp = RouteProp<RootStackParamList, 'VoiceEntry'>;

export const VoiceEntryScreen: React.FC = () => {
  const navigation = useNavigation<VoiceEntryScreenNavigationProp>();
  const route = useRoute<VoiceEntryScreenRouteProp>();
  const { initialData } = route.params;

  const [transcribedText, setTranscribedText] = useState('');
  const [patientData, setPatientData] = useState<Partial<PatientData>>(initialData || {});

  const handleTranscriptionComplete = (text: string) => {
    setTranscribedText(text);
    setPatientData(prev => ({
      ...prev,
      symptoms: prev.symptoms ? `${prev.symptoms}\n${text}` : text,
      transcribedAudio: text,
    }));
  };

  const handleAcceptAndContinue = () => {
    if (!transcribedText) return;
    
    // Navigate to form entry with the transcribed data
    navigation.navigate('FormEntry', { 
      mode: 'voice', 
      initialData: patientData 
    });
  };

  const handleRetry = () => {
    setTranscribedText('');
    setPatientData(prev => ({
      ...prev,
      symptoms: '',
      transcribedAudio: '',
    }));
  };

  return (
    <View style={styles.container}>
      <Header title="Voice Recording" showBackButton />
      
      <ScrollView style={styles.content}>
        {/* Recording Instructions */}
        <Card>
          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsTitle}>Voice Recording Instructions</Text>
            <Text style={styles.instructionsText}>
              • Speak clearly and naturally about the patient's symptoms
            </Text>
            <Text style={styles.instructionsText}>
              • Include patient name, age, and detailed symptom description
            </Text>
            <Text style={styles.instructionsText}>
              • You can record multiple times if needed
            </Text>
            <Text style={styles.instructionsText}>
              • The audio will be automatically transcribed to text
            </Text>
          </View>
        </Card>

        {/* Voice Recorder Component */}
        <Card>
          <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
          
          {/* TODO: Add waveform visualization */}
          <View style={styles.waveformPlaceholder}>
            <Text style={styles.waveformText}>🎵 Waveform visualization will appear here</Text>
          </View>
        </Card>

        {/* Transcription Results */}
        {transcribedText && (
          <Card>
            <View style={styles.transcriptionSection}>
              <Text style={styles.transcriptionTitle}>Transcribed Text</Text>
              <View style={styles.transcriptionBox}>
                <Text style={styles.transcriptionText}>{transcribedText}</Text>
              </View>
              
              <View style={styles.transcriptionActions}>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={handleRetry}
                >
                  <Text style={styles.retryButtonText}>🔄 Re-record</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={handleAcceptAndContinue}
                >
                  <Text style={styles.acceptButtonText}>✓ Accept & Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}

        {/* Language Selection */}
        <Card>
          <View style={styles.languageSection}>
            <Text style={styles.languageTitle}>Recording Language</Text>
            <View style={styles.languageOptions}>
              <TouchableOpacity style={[styles.languageOption, styles.languageOptionSelected]}>
                <Text style={styles.languageOptionText}>🇺🇸 English</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.languageOption}>
                <Text style={styles.languageOptionText}>🇵🇸 Arabic</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.languageOption}>
                <Text style={styles.languageOptionText}>🇫🇷 French</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.languageNote}>
              {/* TODO: Implement language switching functionality */}
              Note: Language selection coming soon
            </Text>
          </View>
        </Card>

        {/* Recording Tips */}
        <Card>
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Recording Tips</Text>
            <Text style={styles.tipItem}>🎤 Hold device 6-8 inches from mouth</Text>
            <Text style={styles.tipItem}>🔇 Find a quiet environment</Text>
            <Text style={styles.tipItem}>📱 Keep device stable while recording</Text>
            <Text style={styles.tipItem}>⏱️ Speak at normal pace, don't rush</Text>
          </View>
        </Card>
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
  instructionsSection: {
    marginBottom: 8,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  waveformPlaceholder: {
    height: 60,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  waveformText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  transcriptionSection: {
    marginTop: 8,
  },
  transcriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  transcriptionBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    marginBottom: 16,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  transcriptionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  retryButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.45,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  languageSection: {
    marginTop: 8,
  },
  languageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  languageOption: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flex: 0.3,
    alignItems: 'center',
  },
  languageOptionSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  languageOptionText: {
    fontSize: 14,
    color: '#333',
  },
  languageNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  tipsSection: {
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
}); 