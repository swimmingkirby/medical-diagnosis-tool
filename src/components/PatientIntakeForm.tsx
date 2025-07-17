import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { PatientData } from '../types';
import { validatePatientData, generateUniqueId } from '../utils/validation';

interface PatientIntakeFormProps {
  onSubmit: (data: PatientData) => void;
  initialData?: Partial<PatientData>;
}

export const PatientIntakeForm: React.FC<PatientIntakeFormProps> = ({
  onSubmit,
  initialData = {},
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    age: initialData.age?.toString() || '',
    symptoms: initialData.symptoms || '',
    notes: initialData.notes || '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const patientData: Partial<PatientData> = {
      name: formData.name,
      age: parseInt(formData.age) || 0,
      symptoms: formData.symptoms,
      notes: formData.notes,
    };

    const validationErrors = validatePatientData(patientData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      Alert.alert('Validation Error', validationErrors.join('\n'));
      return;
    }

    const completeData: PatientData = {
      id: initialData.id || generateUniqueId(),
      name: patientData.name!,
      age: patientData.age!,
      symptoms: patientData.symptoms!,
      notes: patientData.notes!,
      timestamp: new Date(),
    };

    setErrors([]);
    onSubmit(completeData);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Patient Information</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Patient Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter patient name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          placeholder="Enter patient age"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Symptoms *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.symptoms}
          onChangeText={(text) => setFormData({ ...formData, symptoms: text })}
          placeholder="Describe patient symptoms"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          placeholder="Additional notes or observations"
          multiline
          numberOfLines={3}
        />
      </View>

      {errors.length > 0 && (
        <View style={styles.errorContainer}>
          {errors.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Patient Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});