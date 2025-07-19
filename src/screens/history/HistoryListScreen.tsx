import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { FloatingActionButton } from '../../components/common/FloatingActionButton';

type HistoryListScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Mock data for demonstration
const mockRecords = [
  {
    id: 'BC-1704876543210',
    name: 'Ahmad Hassan',
    age: 45,
    symptoms: 'Chest pain, shortness of breath, fatigue',
    timestamp: new Date('2024-01-08T10:30:00'),
    status: 'completed',
    urgent: true,
  },
  {
    id: 'BC-1704863943210',
    name: 'Fatima Omar',
    age: 32,
    symptoms: 'Severe headache, nausea, sensitivity to light',
    timestamp: new Date('2024-01-08T08:15:00'),
    status: 'completed',
    urgent: false,
  },
  {
    id: 'BC-1704850343210',
    name: 'Omar Khalil',
    age: 28,
    symptoms: 'Fever, cough, body aches, sore throat',
    timestamp: new Date('2024-01-08T05:45:00'),
    status: 'completed',
    urgent: false,
  },
  {
    id: 'BC-1704836743210',
    name: 'Aisha Said',
    age: 67,
    symptoms: 'Joint pain, stiffness, difficulty walking',
    timestamp: new Date('2024-01-08T02:10:00'),
    status: 'completed',
    urgent: false,
  },
  {
    id: 'BC-1704823143210',
    name: 'Mohammed Ali',
    age: 54,
    symptoms: 'Diabetes follow-up, blood sugar monitoring',
    timestamp: new Date('2024-01-07T18:30:00'),
    status: 'completed',
    urgent: false,
  },
];

export const HistoryListScreen: React.FC = () => {
  const navigation = useNavigation<HistoryListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState(mockRecords);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredRecords(mockRecords);
    } else {
      const filtered = mockRecords.filter(record => 
        record.name.toLowerCase().includes(query.toLowerCase()) ||
        record.symptoms.toLowerCase().includes(query.toLowerCase()) ||
        record.id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  };

  const handleRecordPress = (record: any) => {
    navigation.navigate('RecordDetail', { 
      recordId: record.id, 
      record 
    });
  };

  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Patient Records" />
      
      <View style={styles.content}>
        {/* Search Bar */}
        <Card>
          <View style={styles.searchSection}>
            <Text style={styles.searchTitle}>Search Records</Text>
            <View style={styles.searchInputContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, symptoms, or record ID..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => handleSearch('')}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card>

        {/* Summary Stats */}
        <Card>
          <View style={styles.statsSection}>
            <Text style={styles.statsTitle}>Records Summary</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockRecords.length}</Text>
                <Text style={styles.statLabel}>Total Records</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mockRecords.filter(r => r.urgent).length}</Text>
                <Text style={styles.statLabel}>Urgent Cases</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {mockRecords.filter(r => {
                    const daysDiff = (new Date().getTime() - r.timestamp.getTime()) / (1000 * 60 * 60 * 24);
                    return daysDiff <= 7;
                  }).length}
                </Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Records List */}
        <ScrollView style={styles.recordsList} showsVerticalScrollIndicator={false}>
          {filteredRecords.length === 0 ? (
            <Card>
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No Records Found</Text>
                <Text style={styles.emptyDescription}>
                  {searchQuery.trim() 
                    ? 'Try adjusting your search terms'
                    : 'No patient records available yet'
                  }
                </Text>
              </View>
            </Card>
          ) : (
            filteredRecords.map((record) => (
              <Card key={record.id}>
                <TouchableOpacity 
                  style={styles.recordItem}
                  onPress={() => handleRecordPress(record)}
                >
                  {/* Record Header */}
                  <View style={styles.recordHeader}>
                    <View style={styles.recordBasicInfo}>
                      <Text style={styles.recordName}>{record.name}</Text>
                      <Text style={styles.recordAge}>Age: {record.age}</Text>
                    </View>
                    <View style={styles.recordMeta}>
                      {record.urgent && (
                        <View style={styles.urgentBadge}>
                          <Text style={styles.urgentText}>URGENT</Text>
                        </View>
                      )}
                      <Text style={styles.recordTime}>
                        {formatRelativeTime(record.timestamp)}
                      </Text>
                    </View>
                  </View>

                  {/* Symptoms Preview */}
                  <Text style={styles.symptomsPreview} numberOfLines={2}>
                    {record.symptoms}
                  </Text>

                  {/* Record Footer */}
                  <View style={styles.recordFooter}>
                    <View style={styles.recordId}>
                      <Text style={styles.recordIdLabel}>ID:</Text>
                      <Text style={styles.recordIdValue}>
                        {record.id.substring(0, 15)}...
                      </Text>
                    </View>
                    <View style={styles.recordStatus}>
                      <View style={[styles.statusDot, styles.statusCompleted]} />
                      <Text style={styles.statusText}>Saved to Blockchain</Text>
                    </View>
                  </View>

                  {/* View Arrow */}
                  <View style={styles.viewArrow}>
                    <Ionicons name="chevron-forward" size={20} color="#2196F3" />
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
  searchSection: {
    marginBottom: 8,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 16,
    color: '#999',
  },
  statsSection: {
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  recordsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  recordItem: {
    position: 'relative',
    paddingRight: 32,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recordBasicInfo: {
    flex: 1,
  },
  recordName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  recordAge: {
    fontSize: 14,
    color: '#666',
  },
  recordMeta: {
    alignItems: 'flex-end',
  },
  urgentBadge: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  urgentText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  recordTime: {
    fontSize: 12,
    color: '#999',
  },
  symptomsPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordId: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordIdLabel: {
    fontSize: 12,
    color: '#999',
    marginRight: 4,
  },
  recordIdValue: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  recordStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusCompleted: {
    backgroundColor: '#28a745',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  viewArrow: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
}); 