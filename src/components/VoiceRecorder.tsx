import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartRecording = () => {
    // TODO: Implement actual recording with expo-av
    setIsRecording(true);
    Alert.alert('Recording Started', 'Voice recording functionality will be implemented');
  };

  const handleStopRecording = () => {
    // TODO: Implement stop recording and transcription
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onTranscriptionComplete('Sample transcribed text will appear here');
    }, 2000);
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (isRecording) return 'Stop Recording';
    return 'Start Voice Recording';
  };

  const getButtonStyle = () => {
    if (isProcessing) return [styles.button, styles.processingButton];
    if (isRecording) return [styles.button, styles.recordingButton];
    return [styles.button, styles.defaultButton];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Input</Text>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={isRecording ? handleStopRecording : handleStartRecording}
        disabled={isProcessing}
      >
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>
      
      {isRecording && (
        <Text style={styles.statusText}>🎤 Recording in progress...</Text>
      )}
      
      {isProcessing && (
        <Text style={styles.statusText}>⏳ Transcribing audio...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  defaultButton: {
    backgroundColor: '#4CAF50',
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  processingButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});