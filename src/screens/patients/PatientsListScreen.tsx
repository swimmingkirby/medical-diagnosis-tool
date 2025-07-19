import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { FloatingActionButton } from '../../components/common/FloatingActionButton';

type PatientsListScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Mock patient profiles data
const mockPatients = [
  {
    id: 'PAT-001',
    fullName: 'Ahmad Hassan',
    dateOfBirth: '1979-03-15',
    lastVisit: new Date('2024-01-08T10:30:00'),
    totalRecords: 3,
    urgent: false,
  },
  {
    id: 'PAT-002', 
    fullName: 'Fatima Omar',
    dateOfBirth: '1992-07-22',
    lastVisit: new Date('2024-01-08T08:15:00'),
    totalRecords: 1,
    urgent: true,
  },
  {
    id: 'PAT-003',
    fullName: 'Omar Khalil',
    dateOfBirth: '1996-12-03',
    lastVisit: new Date('2024-01-08T05:45:00'),
    totalRecords: 2,
    urgent: false,
  },
  {
    id: 'PAT-004',
    fullName: 'Aisha Said',
    dateOfBirth: '1957-04-10',
    lastVisit: new Date('2024-01-08T02:10:00'),
    totalRecords: 5,
    urgent: false,
  },
  {
    id: 'PAT-005',
    fullName: 'Mohammed Ali',
    dateOfBirth: '1970-09-25',
    lastVisit: new Date('2024-01-07T18:30:00'),
    totalRecords: 8,
    urgent: false,
  },
];

export const PatientsListScreen: React.FC = () => {
  const navigation = useNavigation<PatientsListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPatients(mockPatients);
    } else {
      const filtered = mockPatients.filter(patient => 
        patient.fullName.toLowerCase().includes(query.toLowerCase()) ||
        patient.id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const handlePatientPress = (patient: any) => {
    navigation.navigate('PatientDetail', { 
      patientId: patient.id
    });
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

  const formatLastVisit = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Today';
    } else if (diffInHours < 24) {
      return 'Today';
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Patients" />
      
            <View style={styles.content}>
        {/* Search Section */}
        <View style={styles.stickySearchSection}>
          <Card>
            <View style={styles.searchSection}>
              <Text style={styles.searchTitle}>Search Patients</Text>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name or patient ID..."
                  value={searchQuery}
                  onChangeText={handleSearch}
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
        </View>

        {/* Patients List */}
        <ScrollView style={styles.patientsList} contentContainerStyle={styles.patientsListContent} showsVerticalScrollIndicator={false}>
          {filteredPatients.length === 0 ? (
            <Card>
              <View style={styles.emptyState}>
                <Ionicons name="people" size={48} color="#ccc" style={styles.emptyIcon} />
                <Text style={styles.emptyTitle}>No Patients Found</Text>
                <Text style={styles.emptyDescription}>
                  {searchQuery.trim() 
                    ? 'Try adjusting your search terms'
                    : 'No patient profiles available yet'
                  }
                </Text>
              </View>
            </Card>
          ) : (
            filteredPatients.map((patient) => (
              <Card key={patient.id} style={styles.patientCard}>
                <TouchableOpacity 
                  style={styles.patientItem}
                  onPress={() => handlePatientPress(patient)}
                >
                  {/* Patient Header - Name, Badge, and Chevron on same line */}
                  <View style={styles.patientHeader}>
                    <Text style={styles.patientName}>{patient.fullName}</Text>
                    {patient.urgent && (
                      <View style={styles.urgentBadge}>
                        <Text style={styles.urgentText}>FOLLOW-UP</Text>
                      </View>
                    )}
                    <View style={styles.spacer} />
                    <Ionicons name="chevron-forward" size={20} color="#2196F3" />
                  </View>

                  {/* Patient Details - Everything else flows below */}
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientAge}>Age: {calculateAge(patient.dateOfBirth)}</Text>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Date of Birth:</Text>
                      <Text style={styles.detailValue}>{formatDateOfBirth(patient.dateOfBirth)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Last Visit:</Text>
                      <Text style={styles.detailValue}>{formatLastVisit(patient.lastVisit)}</Text>
                    </View>
                    
                    <View style={styles.patientFooter}>
                      <View style={styles.patientId}>
                        <Text style={styles.patientIdLabel}>ID:</Text>
                        <Text style={styles.patientIdValue}>{patient.id}</Text>
                      </View>
                      <View style={styles.recordCount}>
                        <Text style={styles.recordCountText}>
                          {patient.totalRecords} record{patient.totalRecords !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Card>
            ))
          )}
        </ScrollView>
      </View>
      
      <FloatingActionButton onPress={() => navigation.navigate('InputMode')} />
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
  stickySearchSection: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchSection: {
    marginBottom: 8,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },

  patientsList: {
    flex: 1,
  },
  patientsListContent: {
    paddingTop: 8,
  },
  patientCard: {
    marginVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  patientItem: {
    paddingVertical: 4,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  spacer: {
    flex: 1,
  },
  patientAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  urgentBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  urgentText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  patientDetails: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
  patientFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  patientId: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientIdLabel: {
    fontSize: 12,
    color: '#999',
    marginRight: 4,
  },
  patientIdValue: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  recordCount: {
    alignItems: 'flex-end',
  },
  recordCountText: {
    fontSize: 12,
    color: '#666',
  },
}); 