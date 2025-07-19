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
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [medicationSearch, setMedicationSearch] = useState('');
  const [showMedicationResults, setShowMedicationResults] = useState(false);

  const [allergies, setAllergies] = useState<Allergy[]>([
    { id: '1', type: 'Drug', allergen: '', reaction: '' }
  ]);

  const [selectedDiagnoses, setSelectedDiagnoses] = useState<string[]>([]);
  const [otherDiagnosis, setOtherDiagnosis] = useState('');

  // Medication functions
  const handleMedicationSearch = (query: string) => {
    setMedicationSearch(query);
    setShowMedicationResults(query.length > 0);
  };

  const addMedication = (medicationId: string) => {
    if (!selectedMedications.includes(medicationId)) {
      setSelectedMedications([...selectedMedications, medicationId]);
    }
    setMedicationSearch('');
    setShowMedicationResults(false);
  };

  const removeMedication = (medicationId: string) => {
    setSelectedMedications(selectedMedications.filter(id => id !== medicationId));
  };

  const filteredMedications = mockMedications.filter(med => 
    med.name.toLowerCase().includes(medicationSearch.toLowerCase()) &&
    !selectedMedications.includes(med.id)
  );

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

  // Diagnosis functions
  const toggleDiagnosis = (diagnosisId: string) => {
    if (selectedDiagnoses.includes(diagnosisId)) {
      setSelectedDiagnoses(selectedDiagnoses.filter(id => id !== diagnosisId));
    } else {
      setSelectedDiagnoses([...selectedDiagnoses, diagnosisId]);
    }
  };

  const handleNext = () => {
    // TODO: Validate and save medications, allergies, and diagnoses data
    const medsAllergiesData = {
      medications: selectedMedications.map(id => mockMedications.find(med => med.id === id)),
      allergies: allergies.filter(allergy => allergy.allergen.trim() !== ''),
      diagnoses: selectedDiagnoses.map(id => mockDiagnoses.find(diag => diag.id === id)),
      otherDiagnosis: otherDiagnosis.trim(),
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
            
            {/* Medication Search */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search medications (e.g., Aspirin, Metformin)..."
                  value={medicationSearch}
                  onChangeText={handleMedicationSearch}
                />
                {medicationSearch.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => handleMedicationSearch('')}
                  >
                    <Ionicons name="close" size={16} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Search Results */}
              {showMedicationResults && (
                <View style={styles.searchResults}>
                  {filteredMedications.length > 0 ? (
                    filteredMedications.map((medication) => (
                      <TouchableOpacity
                        key={medication.id}
                        style={styles.searchResultItem}
                        onPress={() => addMedication(medication.id)}
                      >
                        <View style={styles.medicationInfo}>
                          <Text style={styles.medicationName}>{medication.name}</Text>
                          <Text style={styles.medicationCode}>{medication.code} • {medication.type}</Text>
                        </View>
                        <Ionicons name="add" size={20} color="#2196F3" />
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.noResults}>
                      <Text style={styles.noResultsText}>No medications found</Text>
                      <Text style={styles.noResultsSubtext}>
                        // TODO: Connect to pharmacy API/SNOMED database
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Selected Medications Tags */}
            <View style={styles.tagsContainer}>
              {selectedMedications.map((medId) => {
                const medication = mockMedications.find(med => med.id === medId);
                return medication ? (
                  <View key={medId} style={styles.medicationTag}>
                    <Text style={styles.tagText}>{medication.name}</Text>
                    <TouchableOpacity
                      style={styles.tagRemove}
                      onPress={() => removeMedication(medId)}
                    >
                      <Ionicons name="close" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                ) : null;
              })}
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

        {/* Problem List Section */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Problem List</Text>
            <Text style={styles.sectionSubtitle}>
              Select chronic conditions and active diagnoses
            </Text>
            
            <View style={styles.diagnosesContainer}>
              {mockDiagnoses.map((diagnosis) => (
                <TouchableOpacity
                  key={diagnosis.id}
                  style={[
                    styles.diagnosisItem,
                    selectedDiagnoses.includes(diagnosis.id) && styles.diagnosisItemSelected
                  ]}
                  onPress={() => toggleDiagnosis(diagnosis.id)}
                >
                  <View style={styles.diagnosisInfo}>
                    <Text style={[
                      styles.diagnosisName,
                      selectedDiagnoses.includes(diagnosis.id) && styles.diagnosisNameSelected
                    ]}>
                      {diagnosis.name}
                    </Text>
                    <Text style={styles.diagnosisCategory}>
                      {diagnosis.category} • {diagnosis.code}
                    </Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedDiagnoses.includes(diagnosis.id) && styles.checkboxSelected
                  ]}>
                    {selectedDiagnoses.includes(diagnosis.id) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Other Diagnosis */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Other Conditions</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={otherDiagnosis}
                onChangeText={setOtherDiagnosis}
                placeholder="List any other active conditions not mentioned above..."
                multiline
                numberOfLines={3}
              />
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
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
  searchContainer: {
    position: 'relative',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  searchResults: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  medicationCode: {
    fontSize: 14,
    color: '#666',
  },
  noResults: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#666',
  },
  noResultsSubtext: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  medicationTag: {
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
  tagRemove: {
    padding: 2,
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
  diagnosesContainer: {
    gap: 8,
  },
  diagnosisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  diagnosisItemSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#f3f8ff',
  },
  diagnosisInfo: {
    flex: 1,
  },
  diagnosisName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  diagnosisNameSelected: {
    color: '#2196F3',
  },
  diagnosisCategory: {
    fontSize: 14,
    color: '#666',
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