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

// Mock data for common medical conditions
const commonMedicalConditions = [
  { id: '1', name: 'Hypertension', category: 'Cardiovascular' },
  { id: '2', name: 'Diabetes', category: 'Endocrine' },
  { id: '3', name: 'Asthma', category: 'Respiratory' },
  { id: '4', name: 'Depression', category: 'Mental Health' },
  { id: '5', name: 'Arthritis', category: 'Musculoskeletal' },
  { id: '6', name: 'GERD', category: 'Gastrointestinal' },
  { id: '7', name: 'Thyroid Disease', category: 'Endocrine' },
  { id: '8', name: 'Heart Disease', category: 'Cardiovascular' },
];

const commonSurgicalProcedures = [
  { id: '1', name: 'Appendectomy', category: 'General Surgery' },
  { id: '2', name: 'Cholecystectomy', category: 'General Surgery' },
  { id: '3', name: 'Knee Replacement', category: 'Orthopedic' },
  { id: '4', name: 'Cataract Surgery', category: 'Ophthalmologic' },
  { id: '5', name: 'Cardiac Bypass', category: 'Cardiac Surgery' },
  { id: '6', name: 'Hernia Repair', category: 'General Surgery' },
];

// Review of Systems categories
const reviewOfSystems = [
  { id: 'constitutional', name: 'Constitutional', items: ['Fever', 'Chills', 'Weight Loss', 'Weight Gain', 'Fatigue', 'Night Sweats'] },
  { id: 'cardiovascular', name: 'Cardiovascular', items: ['Chest Pain', 'Palpitations', 'Shortness of Breath', 'Leg Swelling', 'Syncope'] },
  { id: 'respiratory', name: 'Respiratory', items: ['Cough', 'Shortness of Breath', 'Wheezing', 'Chest Pain', 'Sputum Production'] },
  { id: 'gastrointestinal', name: 'Gastrointestinal', items: ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal Pain', 'Blood in Stool'] },
  { id: 'neurologic', name: 'Neurologic', items: ['Headache', 'Dizziness', 'Seizures', 'Weakness', 'Numbness', 'Memory Problems'] },
  { id: 'musculoskeletal', name: 'Musculoskeletal', items: ['Joint Pain', 'Muscle Pain', 'Back Pain', 'Stiffness', 'Swelling'] },
  { id: 'skin', name: 'Skin', items: ['Rash', 'Itching', 'Changes in Moles', 'Hair Loss', 'Nail Changes'] },
];

interface FamilyHistory {
  id: string;
  relation: string;
  condition: string;
}

export const HistoryReviewScreen: React.FC = () => {
  const route = useRoute<HistoryReviewScreenRouteProp>();
  const navigation = useNavigation<HistoryReviewScreenNavigationProp>();
  const { patientData } = route.params;

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    medical: true,
    family: false,
    review: false,
  });

  // Form state
  const [selectedMedicalConditions, setSelectedMedicalConditions] = useState<string[]>([]);
  const [selectedSurgicalProcedures, setSelectedSurgicalProcedures] = useState<string[]>([]);
  const [additionalMedicalHistory, setAdditionalMedicalHistory] = useState('');

  // Family & Social History
  const [smokingStatus, setSmokingStatus] = useState('');
  const [alcoholUse, setAlcoholUse] = useState('');
  const [occupation, setOccupation] = useState('');
  const [familyHistory, setFamilyHistory] = useState<FamilyHistory[]>([
    { id: '1', relation: '', condition: '' }
  ]);

  // Review of Systems
  const [reviewOfSystemsData, setReviewOfSystemsData] = useState<{[key: string]: string[]}>({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleMedicalCondition = (conditionId: string) => {
    if (selectedMedicalConditions.includes(conditionId)) {
      setSelectedMedicalConditions(selectedMedicalConditions.filter(id => id !== conditionId));
    } else {
      setSelectedMedicalConditions([...selectedMedicalConditions, conditionId]);
    }
  };

  const toggleSurgicalProcedure = (procedureId: string) => {
    if (selectedSurgicalProcedures.includes(procedureId)) {
      setSelectedSurgicalProcedures(selectedSurgicalProcedures.filter(id => id !== procedureId));
    } else {
      setSelectedSurgicalProcedures([...selectedSurgicalProcedures, procedureId]);
    }
  };

  const addFamilyHistoryEntry = () => {
    const newId = (familyHistory.length + 1).toString();
    setFamilyHistory([...familyHistory, { id: newId, relation: '', condition: '' }]);
  };

  const removeFamilyHistoryEntry = (id: string) => {
    if (familyHistory.length > 1) {
      setFamilyHistory(familyHistory.filter(entry => entry.id !== id));
    }
  };

  const updateFamilyHistory = (id: string, field: keyof FamilyHistory, value: string) => {
    setFamilyHistory(familyHistory.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const toggleReviewOfSystemsItem = (category: string, item: string) => {
    setReviewOfSystemsData(prev => {
      const categoryItems = prev[category] || [];
      if (categoryItems.includes(item)) {
        return {
          ...prev,
          [category]: categoryItems.filter(i => i !== item)
        };
      } else {
        return {
          ...prev,
          [category]: [...categoryItems, item]
        };
      }
    });
  };

  const handleNext = () => {
    // TODO: Save history review data using proper data management hook
    const historyData = {
      medicalHistory: {
        conditions: selectedMedicalConditions.map(id => commonMedicalConditions.find(c => c.id === id)),
        surgeries: selectedSurgicalProcedures.map(id => commonSurgicalProcedures.find(s => s.id === id)),
        additional: additionalMedicalHistory,
      },
      socialHistory: {
        smoking: smokingStatus,
        alcohol: alcoholUse,
        occupation,
      },
      familyHistory: familyHistory.filter(entry => entry.relation.trim() !== '' || entry.condition.trim() !== ''),
      reviewOfSystems: reviewOfSystemsData,
    };

    const updatedPatientData = {
      ...patientData,
      ...historyData,
    };

    navigation.navigate('ChiefComplaint', { patientData: updatedPatientData });
  };

  const CollapsibleSection = ({ title, expanded, onToggle, children }: {
    title: string;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <Card>
      <View style={styles.section}>
        <TouchableOpacity style={styles.sectionHeader} onPress={onToggle}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Ionicons 
            name={expanded ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color="#666" 
          />
        </TouchableOpacity>
        
        {expanded && (
          <View style={styles.sectionContent}>
            {children}
          </View>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="History & Review" showBackButton />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Past Medical & Surgical History */}
        <CollapsibleSection
          title="Past Medical & Surgical History"
          expanded={expandedSections.medical}
          onToggle={() => toggleSection('medical')}
        >
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Medical Conditions</Text>
            <View style={styles.checkboxGrid}>
              {commonMedicalConditions.map((condition) => (
                <TouchableOpacity
                  key={condition.id}
                  style={styles.checkboxItem}
                  onPress={() => toggleMedicalCondition(condition.id)}
                >
                  <View style={[
                    styles.checkbox,
                    selectedMedicalConditions.includes(condition.id) && styles.checkboxSelected
                  ]}>
                    {selectedMedicalConditions.includes(condition.id) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{condition.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Surgical Procedures</Text>
            <View style={styles.checkboxGrid}>
              {commonSurgicalProcedures.map((procedure) => (
                <TouchableOpacity
                  key={procedure.id}
                  style={styles.checkboxItem}
                  onPress={() => toggleSurgicalProcedure(procedure.id)}
                >
                  <View style={[
                    styles.checkbox,
                    selectedSurgicalProcedures.includes(procedure.id) && styles.checkboxSelected
                  ]}>
                    {selectedSurgicalProcedures.includes(procedure.id) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{procedure.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Additional Medical History</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={additionalMedicalHistory}
              onChangeText={setAdditionalMedicalHistory}
              placeholder="Add any other medical conditions, hospitalizations, or significant medical events..."
              multiline
              numberOfLines={4}
            />
          </View>
        </CollapsibleSection>

        {/* Family & Social History */}
        <CollapsibleSection
          title="Family & Social History"
          expanded={expandedSections.family}
          onToggle={() => toggleSection('family')}
        >
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Social History</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Smoking Status</Text>
              <View style={styles.dropdownContainer}>
                {['Never smoked', 'Former smoker', 'Current smoker'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      smokingStatus === option && styles.dropdownOptionSelected
                    ]}
                    onPress={() => setSmokingStatus(option)}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      smokingStatus === option && styles.dropdownOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Alcohol Use</Text>
              <View style={styles.dropdownContainer}>
                {['Never', 'Occasional', 'Social', 'Daily'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      alcoholUse === option && styles.dropdownOptionSelected
                    ]}
                    onPress={() => setAlcoholUse(option)}
                  >
                    <Text style={[
                      styles.dropdownOptionText,
                      alcoholUse === option && styles.dropdownOptionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Occupation</Text>
              <TextInput
                style={styles.textInput}
                value={occupation}
                onChangeText={setOccupation}
                placeholder="Enter current occupation"
              />
            </View>
          </View>

          <View style={styles.subsection}>
            <View style={styles.subsectionHeader}>
              <Text style={styles.subsectionTitle}>Family History</Text>
              <TouchableOpacity style={styles.addButton} onPress={addFamilyHistoryEntry}>
                <Ionicons name="add" size={20} color="#2196F3" />
                <Text style={styles.addButtonText}>Add Entry</Text>
              </TouchableOpacity>
            </View>
            
            {familyHistory.map((entry, index) => (
              <View key={entry.id} style={styles.familyHistoryRow}>
                <View style={styles.familyHistoryHeader}>
                  <Text style={styles.familyHistoryTitle}>Family Member {index + 1}</Text>
                  {familyHistory.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeFamilyHistoryEntry(entry.id)}
                    >
                      <Ionicons name="trash" size={16} color="#dc3545" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.familyHistoryFields}>
                  <View style={styles.familyField}>
                    <Text style={styles.fieldLabel}>Relation</Text>
                    <View style={styles.relationDropdown}>
                      {['Parent', 'Sibling', 'Grandparent', 'Child', 'Other'].map((relation) => (
                        <TouchableOpacity
                          key={relation}
                          style={[
                            styles.relationOption,
                            entry.relation === relation && styles.relationOptionSelected
                          ]}
                          onPress={() => updateFamilyHistory(entry.id, 'relation', relation)}
                        >
                          <Text style={[
                            styles.relationOptionText,
                            entry.relation === relation && styles.relationOptionTextSelected
                          ]}>
                            {relation}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.familyField}>
                    <Text style={styles.fieldLabel}>Condition</Text>
                    <TextInput
                      style={styles.textInput}
                      value={entry.condition}
                      onChangeText={(value) => updateFamilyHistory(entry.id, 'condition', value)}
                      placeholder="Enter medical condition"
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </CollapsibleSection>

        {/* Review of Systems */}
        <CollapsibleSection
          title="Review of Systems"
          expanded={expandedSections.review}
          onToggle={() => toggleSection('review')}
        >
          {reviewOfSystems.map((system) => (
            <View key={system.id} style={styles.rosSection}>
              <Text style={styles.rosSystemTitle}>{system.name}</Text>
              <View style={styles.rosItemsGrid}>
                {system.items.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.rosItem}
                    onPress={() => toggleReviewOfSystemsItem(system.id, item)}
                  >
                    <View style={[
                      styles.checkbox,
                      (reviewOfSystemsData[system.id] || []).includes(item) && styles.checkboxSelected
                    ]}>
                      {(reviewOfSystemsData[system.id] || []).includes(item) && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                    <Text style={styles.rosItemLabel}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </CollapsibleSection>

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
  removeButton: {
    padding: 4,
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
  bottomSpacing: {
    height: 24,
  },
}); 