import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type PatientLookupScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Mock patient data for search results
const mockPatients = [
  {
    id: 'PAT-001',
    fullName: 'Ahmad Hassan',
    dateOfBirth: '1979-03-15',
    lastVisit: new Date('2024-01-08T10:30:00'),
  },
  {
    id: 'PAT-002', 
    fullName: 'Fatima Omar',
    dateOfBirth: '1992-07-22',
    lastVisit: new Date('2024-01-08T08:15:00'),
  },
  {
    id: 'PAT-003',
    fullName: 'Omar Khalil',
    dateOfBirth: '1996-12-03',
    lastVisit: new Date('2024-01-08T05:45:00'),
  },
];

export const PatientLookupScreen: React.FC = () => {
  const navigation = useNavigation<PatientLookupScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length > 0) {
      // TODO: Implement real search with autocomplete
      const filtered = mockPatients.filter(patient => 
        patient.fullName.toLowerCase().includes(query.toLowerCase()) ||
        patient.dateOfBirth.includes(query) ||
        patient.id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients(mockPatients);
    }
  };

  const handleSelectPatient = (patient: any) => {
    // TODO: Navigate to DemographicsVitalsScreen with selected patient
    navigation.navigate('DemographicsVitals', { patientId: patient.id });
  };

  const handleCreateNewPatient = () => {
    // TODO: Navigate to PatientProfileFormScreen
    navigation.navigate('PatientProfileForm');
  };

  const formatDateOfBirth = (dob: string) => {
    const date = new Date(dob);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <View style={styles.container}>
      <Header title="Patient Lookup" showBackButton />
      
      <View style={styles.content}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Card>
            <View style={styles.searchContainer}>
              <Text style={styles.searchTitle}>Find Existing Patient</Text>
              <Text style={styles.searchSubtitle}>
                Search by name, date of birth, or patient ID
              </Text>
              
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Start typing patient name, DOB, or ID..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoCorrect={false}
                  autoCapitalize="words"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => handleSearch('')}
                  >
                    <Ionicons name="close" size={16} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Card>
          
          {/* Create New Patient Button */}
          <TouchableOpacity 
            style={styles.createNewButton}
            onPress={handleCreateNewPatient}
          >
            <Ionicons name="person-add" size={20} color="#fff" style={styles.createNewButtonIcon} />
            <Text style={styles.createNewButtonText}>Create New Patient</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          {/* Patients List */}
          <View style={styles.patientsSection}>
            <Text style={styles.patientsTitle}>
              {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''}
            </Text>
            {filteredPatients.map((patient) => (
              <Card key={patient.id} style={styles.patientCard}>
                <TouchableOpacity 
                  style={styles.patientItem}
                  onPress={() => handleSelectPatient(patient)}
                >
                  <View style={styles.patientHeader}>
                    <Text style={styles.patientName}>{patient.fullName}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#2196F3" />
                  </View>
                  
                  <View style={styles.patientDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Age:</Text>
                      <Text style={styles.detailValue}>{calculateAge(patient.dateOfBirth)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date of Birth:</Text>
                      <Text style={styles.detailValue}>{formatDateOfBirth(patient.dateOfBirth)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Patient ID:</Text>
                      <Text style={styles.detailValue}>{patient.id}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        </ScrollView>
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
  },
  searchSection: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    gap: 12,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  createNewButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
  },
  createNewButtonIcon: {
    marginRight: 8,
  },
  createNewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  patientsSection: {
    paddingTop: 8,
  },
  patientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  patientCard: {
    marginVertical: 4,
  },
  patientItem: {
    paddingVertical: 4,
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  patientDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
}); 