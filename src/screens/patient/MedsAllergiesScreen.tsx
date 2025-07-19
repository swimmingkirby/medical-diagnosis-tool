import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type MedsAllergiesScreenRouteProp = RouteProp<RootStackParamList, 'MedsAllergies'>;
type MedsAllergiesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Mock medication database (SNOMED/ATC codes)
const mockMedications = [
  { id: '1', name: 'Aspirin', code: 'ATC:N02BA01', type: 'OTC' },
  { id: '2', name: 'Metformin', code: 'ATC:A10BA02', type: 'Prescription' },
  { id: '3', name: 'Lisinopril', code: 'ATC:C09AA03', type: 'Prescription' },
  { id: '4', name: 'Vitamin D3', code: 'ATC:A11CC05', type: 'Supplement' },
  { id: '5', name: 'Ibuprofen', code: 'ATC:M01AE01', type: 'OTC' },
  { id: '6', name: 'Omega-3', code: 'ATC:A11AB03', type: 'Supplement' },
];

// Mock diagnoses database
const mockDiagnoses = [
  { id: '1', name: 'Hypertension', code: 'ICD:I10', category: 'Cardiovascular' },
  { id: '2', name: 'Type 2 Diabetes', code: 'ICD:E11', category: 'Endocrine' },
  { id: '3', name: 'Asthma', code: 'ICD:J45', category: 'Respiratory' },
  { id: '4', name: 'Depression', code: 'ICD:F32', category: 'Mental Health' },
  { id: '5', name: 'Arthritis', code: 'ICD:M13', category: 'Musculoskeletal' },
];

interface Allergy {
  id: string;
  type: 'Drug' | 'Food' | 'Environmental';
  allergen: string;
  reaction: string;
}

export const MedsAllergiesScreen: React.FC = () => {
  const route = useRoute<MedsAllergiesScreenRouteProp>();
  const navigation = useNavigation<MedsAllergiesScreenNavigationProp>();
  const { patientData } = route.params;

  // Form state
  const [medications, setMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState('');

  const [allergies, setAllergies] = useState<Allergy[]>([
    { id: '1', type: 'Drug', allergen: '', reaction: '' }
  ]);

  // Medication functions
  const addMedication = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const removeMedication = (medication: string) => {
    setMedications(medications.filter(med => med !== medication));
  };

  // Allergy functions
  const addAllergyRow = () => {
    const newId = (allergies.length + 1).toString();
    setAllergies([...allergies, { id: newId, type: 'Drug', allergen: '', reaction: '' }]);
  };

  const removeAllergyRow = (id: string) => {
    if (allergies.length > 1) {
      setAllergies(allergies.filter(allergy => allergy.id !== id));
    }
  };

  const updateAllergy = (id: string, field: keyof Allergy, value: string) => {
    setAllergies(allergies.map(allergy => 
      allergy.id === id ? { ...allergy, [field]: value } : allergy
    ));
  };

  const handleNext = () => {
    // TODO: Validate and save medications and allergies data
    const medsAllergiesData = {
      medications: medications,
      allergies: allergies.filter(allergy => allergy.allergen.trim() !== ''),
    };

    const updatedPatientData = {
      ...patientData,
      ...medsAllergiesData,
    };

    navigation.navigate('HistoryReview', { patientData: updatedPatientData });
  };

  return (
    <View style={styles.container}>
      <Header title="Medications & Allergies" showBackButton />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Medications Section */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Medications</Text>
            <Text style={styles.sectionSubtitle}>
              Include prescriptions, over-the-counter medications, and supplements
            </Text>
            
            {/* Add New Medication */}
            <View style={styles.addMedicationContainer}>
              <View style={styles.addInputContainer}>
                <TextInput
                  style={styles.addInput}
                  placeholder="Enter medication name (e.g., Aspirin 325mg daily)"
                  value={newMedication}
                  onChangeText={setNewMedication}
                  onSubmitEditing={addMedication}
                  returnKeyType="done"
                />
                <TouchableOpacity
                  style={[styles.addButton, !newMedication.trim() && styles.addButtonDisabled]}
                  onPress={addMedication}
                  disabled={!newMedication.trim()}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Medications List */}
            <View style={styles.medicationsContainer}>
              {medications.map((medication, index) => (
                <View key={index} style={styles.medicationItem}>
                  <Text style={styles.medicationText}>{medication}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeMedication(medication)}
                  >
                    <Ionicons name="close" size={16} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              ))}
              {medications.length === 0 && (
                <Text style={styles.emptyText}>No medications added yet</Text>
              )}
            </View>
          </View>
        </Card>

        {/* Allergies Section */}
        <Card>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Allergies & Reactions</Text>
              <TouchableOpacity style={styles.addButton} onPress={addAllergyRow}>
                <Ionicons name="add" size={20} color="#2196F3" />
                <Text style={styles.addButtonText}>Add Allergy</Text>
              </TouchableOpacity>
            </View>
            
            {allergies.map((allergy, index) => (
              <View key={allergy.id} style={styles.allergyRow}>
                <View style={styles.allergyRowHeader}>
                  <Text style={styles.allergyRowTitle}>Allergy {index + 1}</Text>
                  {allergies.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeRowButton}
                      onPress={() => removeAllergyRow(allergy.id)}
                    >
                      <Ionicons name="trash" size={16} color="#dc3545" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Allergy Type Dropdown */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Type</Text>
                  <View style={styles.allergyTypeContainer}>
                    {(['Drug', 'Food', 'Environmental'] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.allergyTypeButton,
                          allergy.type === type && styles.allergyTypeButtonSelected
                        ]}
                        onPress={() => updateAllergy(allergy.id, 'type', type)}
                      >
                        <Text style={[
                          styles.allergyTypeButtonText,
                          allergy.type === type && styles.allergyTypeButtonTextSelected
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Allergen Input */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Allergen</Text>
                  <TextInput
                    style={styles.textInput}
                    value={allergy.allergen}
                    onChangeText={(value) => updateAllergy(allergy.id, 'allergen', value)}
                    placeholder={`Enter ${allergy.type.toLowerCase()} allergen`}
                  />
                </View>

                {/* Reaction Input */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>Reaction</Text>
                  <TextInput
                    style={[styles.textInput, styles.multilineInput]}
                    value={allergy.reaction}
                    onChangeText={(value) => updateAllergy(allergy.id, 'reaction', value)}
                    placeholder="Describe the allergic reaction..."
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            ))}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    height: 80,
    textAlignVertical: 'top',
  },
  addMedicationContainer: {
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  medicationsContainer: {
    gap: 8,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  medicationText: {
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
  allergyRow: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  allergyRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allergyRowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  removeRowButton: {
    padding: 4,
  },
  allergyTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  allergyTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  allergyTypeButtonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  allergyTypeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  allergyTypeButtonTextSelected: {
    color: '#2196F3',
  },

  checkbox: {
    width: 24,
    height: 24,
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
  bottomSpacing: {
    height: 24,
  },
}); 