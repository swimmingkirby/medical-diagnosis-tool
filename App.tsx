import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Alert } from 'react-native';
import { PatientIntakeForm } from './src/components/PatientIntakeForm';
import { VoiceRecorder } from './src/components/VoiceRecorder';
import { LLMSummarizer } from './src/components/LLMSummarizer';
import { PatientData } from './src/types';

export default function App() {
  const [currentPatient, setCurrentPatient] = useState<Partial<PatientData>>({});

  const handlePatientSubmit = (data: PatientData) => {
    Alert.alert('Success', `Patient record saved for ${data.name}`);
    console.log('Patient data:', data);
    // TODO: Implement actual storage
  };

  const handleTranscriptionComplete = (text: string) => {
    setCurrentPatient(prev => ({
      ...prev,
      symptoms: prev.symptoms ? `${prev.symptoms}\n${text}` : text,
    }));
  };

  const handleSummaryComplete = (summary: string) => {
    setCurrentPatient(prev => ({
      ...prev,
      llmSummary: summary,
      notes: prev.notes ? `${prev.notes}\n\nAI Summary: ${summary}` : `AI Summary: ${summary}`,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        
        <LLMSummarizer 
          symptomText={currentPatient.symptoms || ''} 
          onSummaryComplete={handleSummaryComplete} 
        />
        
        <PatientIntakeForm 
          onSubmit={handlePatientSubmit}
          initialData={currentPatient}
        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    padding: 10,
  },
});
