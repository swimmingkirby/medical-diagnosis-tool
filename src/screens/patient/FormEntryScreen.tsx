import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { PatientIntakeForm } from '../../components/PatientIntakeForm';
import { LLMSummarizer } from '../../components/LLMSummarizer';
import { PatientData } from '../../types';

type FormEntryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FormEntry'>;
type FormEntryScreenRouteProp = RouteProp<RootStackParamList, 'FormEntry'>;

export const FormEntryScreen: React.FC = () => {
  const navigation = useNavigation<FormEntryScreenNavigationProp>();
  const route = useRoute<FormEntryScreenRouteProp>();
  const { mode, initialData } = route.params;

  const [currentPatient, setCurrentPatient] = useState<Partial<PatientData>>(initialData || {});
  const [showSummarizer, setShowSummarizer] = useState(false);

  const handlePatientSubmit = (data: PatientData) => {
    // Navigate to Summary screen for AI analysis
    navigation.navigate('Summary', { 
      patientData: data,
      summaryText: currentPatient.llmSummary 
    });
  };

  const handleSummaryComplete = (summary: string) => {
    setCurrentPatient(prev => ({
      ...prev,
      llmSummary: summary,
      notes: prev.notes ? `${prev.notes}\n\nAI Summary: ${summary}` : `AI Summary: ${summary}`,
    }));
    setShowSummarizer(false);
  };

  const handleShowSummarizer = () => {
    if (!currentPatient.symptoms) {
      // TODO: Show alert that symptoms are required
      return;
    }
    setShowSummarizer(true);
  };

  return (
    <View style={styles.container}>
      <Header title="Patient Information" showBackButton />
      
      <ScrollView style={styles.content}>
        {/* AI Summarizer Section */}
        {currentPatient.symptoms && (
          <Card>
            <View style={styles.summarizerSection}>
              <Text style={styles.sectionTitle}>AI Analysis</Text>
              <Text style={styles.sectionDescription}>
                Get AI-powered analysis of patient symptoms
              </Text>
              
              {!showSummarizer ? (
                <TouchableOpacity 
                  style={styles.summarizerButton}
                  onPress={handleShowSummarizer}
                >
                  <Text style={styles.summarizerButtonText}>
                    🤖 Generate AI Summary
                  </Text>
                </TouchableOpacity>
              ) : (
                <LLMSummarizer 
                  symptomText={currentPatient.symptoms || ''} 
                  onSummaryComplete={handleSummaryComplete} 
                />
              )}

              {currentPatient.llmSummary && (
                <View style={styles.summaryResult}>
                  <Text style={styles.summaryLabel}>AI Summary:</Text>
                  <Text style={styles.summaryText}>{currentPatient.llmSummary}</Text>
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Patient Form */}
        <Card>
          <PatientIntakeForm 
            onSubmit={handlePatientSubmit}
            initialData={currentPatient}
          />
        </Card>

        {/* Instructions */}
        <Card>
          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            <Text style={styles.instructionsText}>
              • Fill in all required fields (marked with *)
            </Text>
            <Text style={styles.instructionsText}>
              • Use the AI Summary feature to get intelligent analysis
            </Text>
            <Text style={styles.instructionsText}>
              • Review all information before saving
            </Text>
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
  summarizerSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  summarizerButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  summarizerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryResult: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    marginTop: 16,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  instructionsSection: {
    paddingVertical: 8,
  },
  instructionsTitle: {
    fontSize: 16,
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
}); 