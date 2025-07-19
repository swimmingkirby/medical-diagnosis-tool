import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/common/Header';

export const PatientProfileFormScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header title="New Patient Profile" showBackButton />
      
      <View style={styles.content}>
        <Text style={styles.title}>Patient Profile Form</Text>
        
        {/* TODO: Implement new patient profile form with:
            - Basic information (name, DOB, gender, etc.)
            - Contact information
            - Emergency contact
            - Insurance information
            - Medical history
            - Current medications
            - Allergies
            - Form validation
            - Save patient profile
            - Navigate to DemographicsVitalsScreen with new patientId
        */}
        <Text style={styles.todo}>
          // TODO: Implement new patient profile creation form{'\n'}
          // - Personal information{'\n'}
          // - Contact details{'\n'}
          // - Emergency contact{'\n'}
          // - Insurance information{'\n'}
          // - Medical history{'\n'}
          // - Save profile and continue to demographics
        </Text>
      </View>
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
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  todo: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 