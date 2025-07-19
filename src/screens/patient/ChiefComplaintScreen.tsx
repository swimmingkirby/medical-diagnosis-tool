import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type ChiefComplaintScreenRouteProp = RouteProp<RootStackParamList, 'ChiefComplaint'>;
type ChiefComplaintScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ChiefComplaintScreen: React.FC = () => {
  const route = useRoute<ChiefComplaintScreenRouteProp>();
  const navigation = useNavigation<ChiefComplaintScreenNavigationProp>();
  const { patientData } = route.params;

  // Form state
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [historyOfPresentingComplaint, setHistoryOfPresentingComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const validateForm = () => {
    if (!chiefComplaint.trim()) {
      Alert.alert('Validation Error', 'Please enter the chief complaint.');
      return false;
    }
    if (!historyOfPresentingComplaint.trim()) {
      Alert.alert('Validation Error', 'Please provide the history of presenting complaint.');
      return false;
    }
    return true;
  };

  const handleFinishAndSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement comprehensive patient record save functionality
      const completePatientRecord = {
        ...patientData,
        chiefComplaint: chiefComplaint.trim(),
        historyOfPresentingComplaint: historyOfPresentingComplaint.trim(),
        recordCreatedAt: new Date().toISOString(),
        recordStatus: 'completed',
      };

      // TODO: Save to database/API
      // const savedRecord = await savePatientRecord(completePatientRecord);
      
      // TODO: Generate record ID and navigate to confirmation
      const mockRecordId = `REC-${Date.now()}`;
      
      // Show success message
      Alert.alert(
        'Record Saved',
        'Patient record has been successfully created.',
        [
          {
            text: 'View Record',
            onPress: () => {
              navigation.navigate('Confirmation', {
                patientData: completePatientRecord,
                recordId: mockRecordId,
              });
            },
          },
        ]
      );

    } catch (error) {
      console.error('Error saving patient record:', error);
      Alert.alert(
        'Save Error',
        'Failed to save the patient record. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Chief Complaint" showBackButton={false} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Patient Summary */}
        <Card>
          <View style={styles.patientSummary}>
            <Text style={styles.patientName}>{patientData?.name || 'New Patient'}</Text>
            {patientData?.dateOfBirth && (
              <Text style={styles.patientInfo}>DOB: {patientData.dateOfBirth}</Text>
            )}
            {patientData?.patientId && (
              <Text style={styles.patientInfo}>ID: {patientData.patientId}</Text>
            )}
          </View>
        </Card>

        {/* Chief Complaint Section */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chief Complaint</Text>
            <Text style={styles.sectionSubtitle}>
              Primary reason for today's visit in the patient's own words
            </Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Chief Complaint *</Text>
              <TextInput
                style={[styles.textInput, styles.chiefComplaintInput]}
                value={chiefComplaint}
                onChangeText={setChiefComplaint}
                placeholder="e.g., Chest pain, Shortness of breath, Headache..."
                maxLength={200}
                autoCapitalize="sentences"
                autoCorrect={true}
              />
              <Text style={styles.characterCount}>
                {chiefComplaint.length}/200 characters
              </Text>
            </View>
          </View>
        </Card>

        {/* History of Presenting Complaint Section */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>History of Presenting Complaint</Text>
            <Text style={styles.sectionSubtitle}>
              Detailed description of the current symptoms and their progression
            </Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                History of Presenting Complaint *
              </Text>
              <Text style={styles.fieldHint}>
                Include: onset, duration, severity, quality, radiation, associated symptoms, 
                aggravating/relieving factors, and previous episodes
              </Text>
              <TextInput
                style={[styles.textInput, styles.historyTextarea]}
                value={historyOfPresentingComplaint}
                onChangeText={setHistoryOfPresentingComplaint}
                placeholder="Describe the current symptoms in detail...&#10;&#10;• When did the symptoms start?&#10;• How severe are they (1-10)?&#10;• What makes them better or worse?&#10;• Any associated symptoms?&#10;• Previous similar episodes?"
                multiline
                numberOfLines={12}
                textAlignVertical="top"
                autoCapitalize="sentences"
                autoCorrect={true}
              />
              <Text style={styles.characterCount}>
                {historyOfPresentingComplaint.length} characters
              </Text>
            </View>


          </View>
        </Card>

                 {/* Action Buttons */}
         <View style={styles.actionButtons}>
           <TouchableOpacity 
             style={styles.backButton} 
             onPress={handleBack}
             disabled={isSubmitting}
           >
             <Text style={styles.backButtonText}>Back</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
             onPress={handleFinishAndSubmit}
             disabled={isSubmitting}
           >
             <Text style={styles.submitButtonText}>
               {isSubmitting ? 'Saving...' : 'Submit'}
             </Text>
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
  patientSummary: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 14,
    color: '#666',
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
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  fieldHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 16,
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
  chiefComplaintInput: {
    height: 50,
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

  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 16,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 24,
  },
}); 