import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type ReviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Review'>;
type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'Review'>;

export const ReviewScreen: React.FC = () => {
  const navigation = useNavigation<ReviewScreenNavigationProp>();
  const route = useRoute<ReviewScreenRouteProp>();
  const { patientData } = route.params;

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveToBlockchain = async () => {
    setIsSaving(true);
    
    try {
      // TODO: Implement actual blockchain saving logic
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const recordId = `BC-${Date.now()}`;
      navigation.navigate('Confirmation', { 
        patientData, 
        recordId 
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save to blockchain. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditRecord = () => {
    navigation.navigate('FormEntry', { 
      mode: 'form', 
      initialData: patientData 
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Review Record" showBackButton />
      
      <ScrollView style={styles.content}>
        {/* Review Header */}
        <Card>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewTitle}>Final Review</Text>
            <Text style={styles.reviewDescription}>
              Please review all information before saving to blockchain. 
              Once saved, this record will be permanently stored and secured.
            </Text>
          </View>
        </Card>

        {/* Patient Information */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{patientData.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age:</Text>
              <Text style={styles.infoValue}>{patientData.age} years</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Record ID:</Text>
              <Text style={styles.infoValue}>{patientData.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>
                {new Date(patientData.timestamp).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Symptoms */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Symptoms & Medical History</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{patientData.symptoms}</Text>
            </View>
          </View>
        </Card>

        {/* AI Summary */}
        {patientData.llmSummary && (
          <Card>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI Analysis Summary</Text>
              <View style={[styles.contentBox, styles.summaryBox]}>
                <Text style={styles.contentText}>{patientData.llmSummary}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Additional Notes */}
        {patientData.notes && (
          <Card>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <View style={styles.contentBox}>
                <Text style={styles.contentText}>{patientData.notes}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Voice Transcription */}
        {patientData.transcribedAudio && (
          <Card>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voice Transcription</Text>
              <View style={[styles.contentBox, styles.transcriptionBox]}>
                <Text style={styles.contentText}>{patientData.transcribedAudio}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Blockchain Information */}
        <Card>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blockchain Security</Text>
            <View style={styles.blockchainInfo}>
              <View style={styles.securityFeature}>
                <Text style={styles.securityIcon}>🔒</Text>
                <Text style={styles.securityText}>Encrypted and immutable</Text>
              </View>
              <View style={styles.securityFeature}>
                <Text style={styles.securityIcon}>⏰</Text>
                <Text style={styles.securityText}>Timestamped permanently</Text>
              </View>
              <View style={styles.securityFeature}>
                <Text style={styles.securityIcon}>🌐</Text>
                <Text style={styles.securityText}>Decentralized storage</Text>
              </View>
              <View style={styles.securityFeature}>
                <Text style={styles.securityIcon}>✅</Text>
                <Text style={styles.securityText}>Verifiable authenticity</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Warning */}
        <Card style={styles.warningCard}>
          <View style={styles.warningSection}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Important Notice</Text>
              <Text style={styles.warningText}>
                Once saved to blockchain, this record cannot be modified or deleted. 
                Please ensure all information is accurate.
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditRecord}
            disabled={isSaving}
          >
            <Text style={styles.editButtonText}>📝 Edit Record</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSaveToBlockchain}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? '⏳ Saving to Blockchain...' : '🔗 Save to Blockchain'}
            </Text>
          </TouchableOpacity>
        </View>
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
  reviewHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  reviewDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  contentBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#17a2b8',
  },
  summaryBox: {
    borderLeftColor: '#2196F3',
    backgroundColor: '#f0f9ff',
  },
  transcriptionBox: {
    borderLeftColor: '#28a745',
    backgroundColor: '#f8fff8',
  },
  contentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  blockchainInfo: {
    marginTop: 8,
  },
  securityFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  securityText: {
    fontSize: 15,
    color: '#333',
  },
  warningCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
    borderWidth: 1,
  },
  warningSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 18,
  },
  actions: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 0.45,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 0.45,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 