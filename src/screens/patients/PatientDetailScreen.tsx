import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';

type PatientDetailScreenRouteProp = RouteProp<RootStackParamList, 'PatientDetail'>;

export const PatientDetailScreen: React.FC = () => {
  const route = useRoute<PatientDetailScreenRouteProp>();
  const { patientId } = route.params;

  return (
    <View style={styles.container}>
      <Header title="Patient Details" showBackButton />
      
      <View style={styles.content}>
        <Text style={styles.title}>Patient Detail Screen</Text>
        <Text style={styles.patientId}>Patient ID: {patientId}</Text>
        
        {/* TODO: Implement patient detail view with:
            - Patient profile information
            - Medical history
            - Recent records
            - Contact information
            - Appointment history
        */}
        <Text style={styles.todo}>
          // TODO: Implement full patient detail functionality
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
    marginBottom: 16,
  },
  patientId: {
    fontSize: 16,
    color: '#666',
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