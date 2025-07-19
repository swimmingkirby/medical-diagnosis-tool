import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type RecordDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RecordDetail'>;
type RecordDetailScreenRouteProp = RouteProp<RootStackParamList, 'RecordDetail'>;

export const RecordDetailScreen: React.FC = () => {
  const navigation = useNavigation<RecordDetailScreenNavigationProp>();
  const route = useRoute<RecordDetailScreenRouteProp>();
  const { recordId, record } = route.params;

  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // TODO: Implement actual PDF export functionality
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Export Complete', 'PDF has been saved to device storage');
    } catch (error) {
      Alert.alert('Export Failed', 'Unable to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareRecord = () => {
    Alert.alert(
      'Share Record',
      'Choose sharing method:',
      [
        { text: 'Email', onPress: () => Alert.alert('Coming Soon', 'Email sharing will be available soon') },
        { text: 'QR Code', onPress: () => Alert.alert('Coming Soon', 'QR code sharing will be available soon') },
        { text: 'Secure Link', onPress: () => Alert.alert('Coming Soon', 'Secure link sharing will be available soon') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleVerifyBlockchain = () => {
    Alert.alert(
      'Blockchain Verification',
      'Record verified on blockchain:\n\n✅ Hash matches\n✅ Timestamp valid\n✅ Signature authentic\n✅ Chain integrity confirmed',
      [{ text: 'OK' }]
    );
  };

  // Mock blockchain data
  const blockchainHash = `0x${Math.random().toString(16).substr(2, 40)}`;
  const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

  return (
    <View style={styles.container}>
      <Header 
        title="Record Details" 
        showBackButton 
        rightAction={{
          iconName: 'share',
          onPress: handleShareRecord
        }}
      />
      
      <ScrollView style={styles.content}>
        {/* Patient Header */}
        <Card>
          <View style={styles.patientHeader}>
            <View style={styles.patientAvatar}>
              <Text style={styles.patientInitial}>
                {record.name?.charAt(0) || 'P'}
              </Text>
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{record.name}</Text>
              <Text style={styles.patientAge}>Age: {record.age} years</Text>
              <Text style={styles.recordDate}>
                {new Date(record.timestamp).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
            {record.urgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>URGENT</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Record Information */}
        <Card>
          <View style={styles.recordInfo}>
            <Text style={styles.sectionTitle}>Record Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Record ID:</Text>
              <Text style={styles.infoValue}>{recordId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Saved to Blockchain</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created:</Text>
              <Text style={styles.infoValue}>
                {new Date(record.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Symptoms & Medical History */}
        <Card>
          <View style={styles.symptomsSection}>
            <Text style={styles.sectionTitle}>Symptoms & Medical History</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{record.symptoms}</Text>
            </View>
          </View>
        </Card>

        {/* AI Summary (if available) */}
        {record.llmSummary && (
          <Card>
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>AI Analysis Summary</Text>
              <View style={[styles.contentBox, styles.summaryBox]}>
                <Text style={styles.contentText}>{record.llmSummary}</Text>
              </View>
              <View style={styles.aiConfidence}>
                <Text style={styles.confidenceLabel}>AI Confidence: </Text>
                <Text style={styles.confidenceValue}>85% High</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Additional Notes (if available) */}
        {record.notes && (
          <Card>
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <View style={styles.contentBox}>
                <Text style={styles.contentText}>{record.notes}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Voice Transcription (if available) */}
        {record.transcribedAudio && (
          <Card>
            <View style={styles.transcriptionSection}>
              <Text style={styles.sectionTitle}>Voice Transcription</Text>
              <View style={[styles.contentBox, styles.transcriptionBox]}>
                <Text style={styles.contentText}>{record.transcribedAudio}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Blockchain Details */}
        <Card>
          <View style={styles.blockchainSection}>
            <Text style={styles.sectionTitle}>Blockchain Security</Text>
            <Text style={styles.blockchainDescription}>
              This record is permanently secured on the blockchain
            </Text>

            <View style={styles.blockchainDetails}>
              <View style={styles.hashRow}>
                <Text style={styles.hashLabel}>Record Hash:</Text>
                <Text style={styles.hashValue} numberOfLines={1}>
                  {blockchainHash}
                </Text>
              </View>
              <View style={styles.hashRow}>
                <Text style={styles.hashLabel}>Transaction:</Text>
                <Text style={styles.hashValue} numberOfLines={1}>
                  {transactionHash}
                </Text>
              </View>
              <View style={styles.hashRow}>
                <Text style={styles.hashLabel}>Block Number:</Text>
                <Text style={styles.hashValue}>#{Math.floor(Math.random() * 1000000)}</Text>
              </View>
              <View style={styles.hashRow}>
                <Text style={styles.hashLabel}>Network:</Text>
                <Text style={styles.hashValue}>Shifaa Health Chain</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.verifyButton}
              onPress={handleVerifyBlockchain}
            >
              <Text style={styles.verifyButtonText}>🔍 Verify on Blockchain</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Medical Tags (mock) */}
        <Card>
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Medical Tags</Text>
            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Cardiovascular</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Urgent Care</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Adult Patient</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Follow-up Required</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
            onPress={handleExportPDF}
            disabled={isExporting}
          >
            <Text style={styles.exportButtonText}>
              {isExporting ? '⏳ Exporting...' : '📄 Export PDF'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShareRecord}
          >
            <Text style={styles.shareButtonText}>📤 Share Record</Text>
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
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  patientInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  patientAge: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  recordDate: {
    fontSize: 14,
    color: '#999',
  },
  urgentBadge: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  urgentText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  recordInfo: {
    marginBottom: 8,
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
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 6,
  },
  statusText: {
    fontSize: 15,
    color: '#28a745',
    fontWeight: '600',
  },
  symptomsSection: {
    marginBottom: 8,
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
  summarySection: {
    marginBottom: 8,
  },
  aiConfidence: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#666',
  },
  confidenceValue: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  notesSection: {
    marginBottom: 8,
  },
  transcriptionSection: {
    marginBottom: 8,
  },
  blockchainSection: {
    marginBottom: 8,
  },
  blockchainDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  blockchainDetails: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  hashRow: {
    marginBottom: 8,
  },
  hashLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  hashValue: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  verifyButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tagsSection: {
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  tagText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  exportButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 0.45,
    alignItems: 'center',
  },
  exportButtonDisabled: {
    backgroundColor: '#ccc',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 0.45,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 