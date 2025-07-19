import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type HistoryReviewScreenRouteProp = RouteProp<RootStackParamList, 'HistoryReview'>;
type HistoryReviewScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Mock diagnoses for active problem list
const mockDiagnoses = [
  { id: '1', name: 'Hypertension', code: 'ICD:I10', category: 'Cardiovascular' },
  { id: '2', name: 'Type 2 Diabetes', code: 'ICD:E11', category: 'Endocrine' },
  { id: '3', name: 'Asthma', code: 'ICD:J45', category: 'Respiratory' },
  { id: '4', name: 'Depression', code: 'ICD:F32', category: 'Mental Health' },
  { id: '5', name: 'Arthritis', code: 'ICD:M13', category: 'Musculoskeletal' },
  { id: '6', name: 'GERD', code: 'ICD:K21', category: 'Gastrointestinal' },
  { id: '7', name: 'Thyroid Disease', code: 'ICD:E07', category: 'Endocrine' },
  { id: '8', name: 'Heart Disease', code: 'ICD:I25', category: 'Cardiovascular' },
];

export const HistoryReviewScreen: React.FC = () => {
  const route = useRoute<HistoryReviewScreenRouteProp>();
  const navigation = useNavigation<HistoryReviewScreenNavigationProp>();
  const { patientData } = route.params;

  // Simplified form state
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [otherHistory, setOtherHistory] = useState('');

  const addDiagnosis = () => {
    if (newDiagnosis.trim() && !selectedDiagnoses.includes(newDiagnosis.trim())) {
      setSelectedDiagnoses([...selectedDiagnoses, newDiagnosis.trim()]);
      setNewDiagnosis('');
    }
  };

  const removeDiagnosis = (diagnosis: string) => {
    setSelectedDiagnoses(selectedDiagnoses.filter(diag => diag !== diagnosis));
  };

  const handleNext = () => {
    // TODO: Save simplified history data using proper data management hook
    const historyData = {
      activeDiagnoses: selectedDiagnoses.map(id => mockDiagnoses.find(d => d.id === id)),
      otherHistory: otherHistory.trim(),
    };

    const updatedPatientData = {
      ...patientData,
      ...historyData,
    };

    navigation.navigate('ChiefComplaint', { patientData: updatedPatientData });
  };



  return (
    <View style={styles.container}>
      <Header title="Problem List & History" showBackButton />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Problem List */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Problem List</Text>
            <Text style={styles.sectionSubtitle}>
              Select chronic conditions and active diagnoses
            </Text>
            
            {/* Add New Diagnosis */}
            <View style={styles.addDiagnosisContainer}>
              <View style={styles.addInputContainer}>
                <TextInput
                  style={styles.addInput}
                  placeholder="Enter active diagnosis (e.g., Hypertension, Type 2 Diabetes)"
                  value={newDiagnosis}
                  onChangeText={setNewDiagnosis}
                  onSubmitEditing={addDiagnosis}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[styles.addButton, !newDiagnosis.trim() && styles.addButtonDisabled]}
                  onPress={addDiagnosis}
                  disabled={!newDiagnosis.trim()}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Diagnoses List */}
            <View style={styles.diagnosesContainer}>
              {selectedDiagnoses.map((diagnosis, index) => (
                <View key={index} style={styles.diagnosisItem}>
                  <Text style={styles.diagnosisText}>{diagnosis}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeDiagnosis(diagnosis)}
                  >
                    <Ionicons name="close" size={16} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              ))}
              {selectedDiagnoses.length === 0 && (
                <Text style={styles.emptyText}>No diagnoses added yet</Text>
              )}
            </View>
          </View>
        </Card>

        {/* Other History */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other History</Text>
            <Text style={styles.sectionSubtitle}>
              Include past medical history, surgical history, family history, and social history
            </Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Medical, Surgical, Family & Social History</Text>
              <Text style={styles.fieldHint}>
                Include: past medical conditions, surgeries, family medical history, 
                smoking/alcohol use, occupation, and other relevant history
              </Text>
              <TextInput
                style={[styles.textInput, styles.historyTextarea]}
                value={otherHistory}
                onChangeText={setOtherHistory}
                placeholder="Enter relevant medical, surgical, family and social history...&#10;&#10;Example:&#10;• Past medical: HTN, DM2&#10;• Past surgical: Appendectomy 2015&#10;• Family history: Mother - breast cancer&#10;• Social: Non-smoker, occasional alcohol&#10;• Occupation: Teacher"
                multiline
                numberOfLines={10}
                textAlignVertical="top"
                autoCapitalize="sentences"
                autoCorrect={true}
              />
              <Text style={styles.characterCount}>
                {otherHistory.length} characters
              </Text>
            </View>
          </View>
        </Card>

                 {/* Action Buttons */}
         <View style={styles.actionButtons}>
           <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
             <Text style={styles.backButtonText}>Back</Text>
           </TouchableOpacity>
           
           <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
             <Text style={styles.nextButtonText}>Next</Text>
           </TouchableOpacity>
         </View>

        <View style={styles.bottomSpacing} />
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
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionContent: {
    gap: 16,
    marginTop: 8,
  },
  subsection: {
    gap: 12,
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fieldContainer: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxGrid: {
    gap: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  dropdownContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  dropdownOptionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#666',
  },
  dropdownOptionTextSelected: {
    color: '#2196F3',
    fontWeight: '500',
  },

  familyHistoryRow: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  familyHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  familyHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  familyHistoryFields: {
    gap: 12,
  },
  familyField: {
    gap: 6,
  },
  relationDropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  relationOption: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  relationOptionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  relationOptionText: {
    fontSize: 12,
    color: '#666',
  },
  relationOptionTextSelected: {
    color: '#2196F3',
    fontWeight: '500',
  },
  rosSection: {
    gap: 8,
  },
  rosSystemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rosItemsGrid: {
    gap: 6,
  },
  rosItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  rosItemLabel: {
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addDiagnosisContainer: {
    gap: 8,
  },
  addInputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  diagnosesContainer: {
    gap: 8,
  },
  diagnosisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  diagnosisText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  fieldHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  historyTextarea: {
    height: 200,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  bottomSpacing: {
    height: 24,
  },
}); 