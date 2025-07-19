import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type SummaryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Summary'>;
type SummaryScreenRouteProp = RouteProp<RootStackParamList, 'Summary'>;

export const SummaryScreen: React.FC = () => {
  const navigation = useNavigation<SummaryScreenNavigationProp>();
  const route = useRoute<SummaryScreenRouteProp>();
  const { patientData, summaryText } = route.params;

  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Simulate AI tag generation
    setTimeout(() => {
      setGeneratedTags([
        'Respiratory', 'Chest Pain', 'Acute', 'Adult Patient', 
        'Fever', 'Requires Follow-up', 'Urgent'
      ]);
      setIsGenerating(false);
    }, 2000);
  }, []);

  const handleContinueToReview = () => {
    const updatedPatientData = {
      ...patientData,
      llmSummary: summaryText,
      // TODO: Add generated tags to patient data structure
    };
    navigation.navigate('Review', { patientData: updatedPatientData });
  };

  const handleRegenerateAnalysis = () => {
    setIsGenerating(true);
    // TODO: Implement actual regeneration logic
    setTimeout(() => {
      setGeneratedTags([
        'Cardiovascular', 'Chronic', 'Moderate Severity', 
        'Follow-up Required', 'Medication Review'
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Header title="AI Analysis Summary" showBackButton />
      
      <ScrollView style={styles.content}>
        {/* Patient Summary Card */}
        <Card>
          <View style={styles.patientSummary}>
            <Text style={styles.patientName}>{patientData.name}</Text>
            <Text style={styles.patientDetails}>Age: {patientData.age}</Text>
            <Text style={styles.patientDetails}>
              Record ID: {patientData.id?.substring(0, 8)}...
            </Text>
          </View>
        </Card>

        {/* Original Symptoms */}
        <Card>
          <View style={styles.symptomsSection}>
            <Text style={styles.sectionTitle}>Original Symptoms</Text>
            <View style={styles.symptomsBox}>
              <Text style={styles.symptomsText}>{patientData.symptoms}</Text>
            </View>
          </View>
        </Card>

        {/* AI Summary */}
        {summaryText && (
          <Card>
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>AI Generated Summary</Text>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{summaryText}</Text>
              </View>
              <TouchableOpacity 
                style={styles.regenerateButton}
                onPress={handleRegenerateAnalysis}
              >
                <Text style={styles.regenerateButtonText}>🔄 Regenerate Analysis</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* AI Tags */}
        <Card>
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>AI Generated Tags</Text>
            <Text style={styles.sectionDescription}>
              Smart categorization to help with medical organization
            </Text>
            
            {isGenerating ? (
              <View style={styles.loadingTags}>
                <Text style={styles.loadingText}>🤖 Generating smart tags...</Text>
              </View>
            ) : (
              <View style={styles.tagsContainer}>
                {generatedTags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Card>

        {/* Confidence Score */}
        <Card>
          <View style={styles.confidenceSection}>
            <Text style={styles.sectionTitle}>Analysis Confidence</Text>
            <View style={styles.confidenceBar}>
              <View style={[styles.confidenceFill, { width: '85%' }]} />
            </View>
            <Text style={styles.confidenceText}>85% - High Confidence</Text>
            <Text style={styles.confidenceNote}>
              Based on symptom clarity and medical terminology accuracy
            </Text>
          </View>
        </Card>

        {/* Recommendations */}
        <Card>
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
            <View style={styles.recommendation}>
              <Text style={styles.recommendationIcon}>🩺</Text>
              <Text style={styles.recommendationText}>
                Consider immediate medical evaluation for chest pain symptoms
              </Text>
            </View>
            <View style={styles.recommendation}>
              <Text style={styles.recommendationIcon}>📝</Text>
              <Text style={styles.recommendationText}>
                Document vital signs and pain scale for complete assessment
              </Text>
            </View>
            <View style={styles.recommendation}>
              <Text style={styles.recommendationIcon}>⏰</Text>
              <Text style={styles.recommendationText}>
                Schedule follow-up within 24-48 hours
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinueToReview}
          >
            <Text style={styles.continueButtonText}>Continue to Review</Text>
          </TouchableOpacity>
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
  patientSummary: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  symptomsSection: {
    marginBottom: 8,
  },
  symptomsBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
  },
  symptomsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  summarySection: {
    marginBottom: 8,
  },
  summaryBox: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  regenerateButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  regenerateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tagsSection: {
    marginBottom: 8,
  },
  loadingTags: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  tagText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  confidenceSection: {
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 4,
  },
  confidenceNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  recommendationsSection: {
    marginBottom: 8,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recommendationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  actions: {
    padding: 16,
  },
  continueButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 