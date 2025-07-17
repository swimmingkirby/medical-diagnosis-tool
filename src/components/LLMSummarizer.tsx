import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

interface LLMSummarizerProps {
  symptomText: string;
  onSummaryComplete: (summary: string) => void;
}

export const LLMSummarizer: React.FC<LLMSummarizerProps> = ({
  symptomText,
  onSummaryComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSummarize = () => {
    if (!symptomText.trim()) {
      Alert.alert('No Text', 'Please enter symptoms before summarizing');
      return;
    }

    setIsProcessing(true);
    
    // TODO: Implement actual LLM API call
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      const mockSummary = `Summary: ${symptomText.substring(0, 50)}... [AI-generated summary will appear here]`;
      onSummaryComplete(mockSummary);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Symptom Analysis</Text>
      <TouchableOpacity
        style={[styles.button, isProcessing && styles.processingButton]}
        onPress={handleSummarize}
        disabled={isProcessing || !symptomText.trim()}
      >
        <Text style={styles.buttonText}>
          {isProcessing ? 'Analyzing...' : 'Generate Summary'}
        </Text>
      </TouchableOpacity>
      
      {isProcessing && (
        <Text style={styles.statusText}>🤖 AI is analyzing symptoms...</Text>
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
    backgroundColor: '#9C27B0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
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