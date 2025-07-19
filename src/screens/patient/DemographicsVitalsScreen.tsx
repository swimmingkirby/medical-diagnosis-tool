import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type DemographicsVitalsScreenRouteProp = RouteProp<RootStackParamList, 'DemographicsVitals'>;
type DemographicsVitalsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Mock patient data for prefilling
const mockPatientData = {
  'PAT-001': {
    name: 'Ahmad Hassan',
    dateOfBirth: '1979-03-15',
    gender: 'Male',
    phone: '+970-XX-XXXXX',
    address: '123 Main St, Gaza',
    emergencyContact: 'Sarah Hassan - +970-XX-XXXXX',
    allergies: 'Penicillin, Shellfish',
    lastVitals: {
      height: '175',
      weight: '75',
      systolic: '120',
      diastolic: '80',
      heartRate: '72',
      temperature: '37.0',
      respiratoryRate: '16',
      oxygenSaturation: '98',
    }
  },
  'PAT-002': {
    name: 'Fatima Omar',
    dateOfBirth: '1992-07-22',
    gender: 'Female',
    phone: '+970-XX-XXXXX',
    address: '456 Oak Ave, Gaza',
    emergencyContact: 'Omar Omar - +970-XX-XXXXX',
    allergies: 'None known',
    lastVitals: {
      height: '165',
      weight: '60',
      systolic: '110',
      diastolic: '70',
      heartRate: '68',
      temperature: '36.8',
      respiratoryRate: '14',
      oxygenSaturation: '99',
    }
  },
};

export const DemographicsVitalsScreen: React.FC = () => {
  const route = useRoute<DemographicsVitalsScreenRouteProp>();
  const navigation = useNavigation<DemographicsVitalsScreenNavigationProp>();
  const { patientId } = route.params || {};

  // Form state
  const [formData, setFormData] = useState({
    // Demographics
    name: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContact: '',
    
    // Vitals
    height: '',
    weight: '',
    systolic: '',
    diastolic: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
  });

  const [isExistingPatient, setIsExistingPatient] = useState(false);

  useEffect(() => {
    // TODO: Replace with real patient data fetching hook
    if (patientId && mockPatientData[patientId as keyof typeof mockPatientData]) {
      const patientData = mockPatientData[patientId as keyof typeof mockPatientData];
      setFormData({
        name: patientData.name,
        dateOfBirth: patientData.dateOfBirth,
        gender: patientData.gender,
        phone: patientData.phone,
        address: patientData.address,
        emergencyContact: patientData.emergencyContact,
        height: patientData.lastVitals.height,
        weight: patientData.lastVitals.weight,
        systolic: patientData.lastVitals.systolic,
        diastolic: patientData.lastVitals.diastolic,
        heartRate: patientData.lastVitals.heartRate,
        temperature: patientData.lastVitals.temperature,
        respiratoryRate: patientData.lastVitals.respiratoryRate,
        oxygenSaturation: patientData.lastVitals.oxygenSaturation,
      });
      setIsExistingPatient(true);
    }
  }, [patientId]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'dateOfBirth', 'gender'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields (Name, Date of Birth, Gender)');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateForm()) return;
    
    // TODO: Save form data using proper data management hook
    const patientData = {
      ...formData,
      patientId,
      isExistingPatient,
    };
    
    navigation.navigate('MedsAllergies', { patientData });
  };

  return (
    <View style={styles.container}>
      <Header title="Demographics & Vitals" showBackButton />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Demographics Section */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Demographics</Text>
            
            {/* Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.textInput, isExistingPatient && styles.readOnlyInput]}
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                placeholder="Enter patient's full name"
                editable={!isExistingPatient}
                autoCapitalize="words"
              />
            </View>

            {/* Date of Birth */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Date of Birth <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                value={formData.dateOfBirth}
                onChangeText={(value) => updateField('dateOfBirth', value)}
                placeholder="YYYY-MM-DD"
              />
            </View>

            {/* Gender */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Gender <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.genderContainer}>
                {['Male', 'Female', 'Other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderButton,
                      formData.gender === gender && styles.genderButtonSelected
                    ]}
                    onPress={() => updateField('gender', gender)}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      formData.gender === gender && styles.genderButtonTextSelected
                    ]}>
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Phone */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                placeholder="+970-XX-XXXXXXX"
                keyboardType="phone-pad"
              />
            </View>

            {/* Address */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Address</Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={formData.address}
                onChangeText={(value) => updateField('address', value)}
                placeholder="Street address, city, region"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Emergency Contact */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Emergency Contact</Text>
              <TextInput
                style={styles.textInput}
                value={formData.emergencyContact}
                onChangeText={(value) => updateField('emergencyContact', value)}
                placeholder="Name - Phone number"
              />
            </View>
          </View>
        </Card>

        {/* Vital Signs Section */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vital Signs</Text>
            
            {/* Height & Weight Row */}
            <View style={styles.vitalsRow}>
              <View style={styles.vitalField}>
                <Text style={styles.fieldLabel}>Height</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={[styles.textInput, styles.numericInput]}
                    value={formData.height}
                    onChangeText={(value) => updateField('height', value)}
                    placeholder="175"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>cm</Text>
                </View>
              </View>
              
              <View style={styles.vitalField}>
                <Text style={styles.fieldLabel}>Weight</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={[styles.textInput, styles.numericInput]}
                    value={formData.weight}
                    onChangeText={(value) => updateField('weight', value)}
                    placeholder="70"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>kg</Text>
                </View>
              </View>
            </View>

            {/* Blood Pressure */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Blood Pressure</Text>
              <View style={styles.bloodPressureContainer}>
                <TextInput
                  style={[styles.textInput, styles.numericInput]}
                  value={formData.systolic}
                  onChangeText={(value) => updateField('systolic', value)}
                  placeholder="120"
                  keyboardType="numeric"
                />
                <Text style={styles.bpSeparator}>/</Text>
                <TextInput
                  style={[styles.textInput, styles.numericInput]}
                  value={formData.diastolic}
                  onChangeText={(value) => updateField('diastolic', value)}
                  placeholder="80"
                  keyboardType="numeric"
                />
                <Text style={styles.unitText}>mmHg</Text>
              </View>
            </View>

            {/* Heart Rate & Temperature Row */}
            <View style={styles.vitalsRow}>
              <View style={styles.vitalField}>
                <Text style={styles.fieldLabel}>Heart Rate</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={[styles.textInput, styles.numericInput]}
                    value={formData.heartRate}
                    onChangeText={(value) => updateField('heartRate', value)}
                    placeholder="72"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>bpm</Text>
                </View>
              </View>
              
              <View style={styles.vitalField}>
                <Text style={styles.fieldLabel}>Temperature</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={[styles.textInput, styles.numericInput]}
                    value={formData.temperature}
                    onChangeText={(value) => updateField('temperature', value)}
                    placeholder="37.0"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>°C</Text>
                </View>
              </View>
            </View>

            {/* Respiratory Rate & O₂ Saturation Row */}
            <View style={styles.vitalsRow}>
              <View style={styles.vitalField}>
                <Text style={styles.fieldLabel}>Respiratory Rate</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={[styles.textInput, styles.numericInput]}
                    value={formData.respiratoryRate}
                    onChangeText={(value) => updateField('respiratoryRate', value)}
                    placeholder="16"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>/min</Text>
                </View>
              </View>
              
              <View style={styles.vitalField}>
                <Text style={styles.fieldLabel}>O₂ Saturation</Text>
                <View style={styles.inputWithUnit}>
                  <TextInput
                    style={[styles.textInput, styles.numericInput]}
                    value={formData.oxygenSaturation}
                    onChangeText={(value) => updateField('oxygenSaturation', value)}
                    placeholder="98"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitText}>%</Text>
                </View>
              </View>
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
    marginBottom: 8,
  },
  fieldContainer: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  required: {
    color: '#dc3545',
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
  readOnlyInput: {
    backgroundColor: '#f8f9fa',
    color: '#666',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  genderButtonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#e3f2fd',
  },
  genderButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  genderButtonTextSelected: {
    color: '#2196F3',
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  vitalField: {
    flex: 1,
    gap: 6,
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingRight: 12,
  },
  numericInput: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  unitText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  bloodPressureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingRight: 12,
  },
  bpSeparator: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginHorizontal: 4,
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