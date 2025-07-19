import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';

type ConfirmationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Confirmation'>;
type ConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'Confirmation'>;

export const ConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<ConfirmationScreenNavigationProp>();
  const route = useRoute<ConfirmationScreenRouteProp>();
  const { patientData, recordId } = route.params;

  const handleViewRecord = () => {
    navigation.navigate('RecordDetail', { 
      recordId, 
      record: patientData 
    });
  };

  const handleNewRecord = () => {
    navigation.navigate('InputMode');
  };

  const handleBackToDashboard = () => {
    navigation.navigate('MainTabs');
  };

  // Generate mock blockchain hash
  const blockchainHash = `0x${Math.random().toString(16).substr(2, 40)}`;
  const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

  return (
    <View style={styles.container}>
      <Header title="Record Saved" showBackButton={false} />
      
      <ScrollView style={styles.content}>
        {/* Success Animation/Icon */}
        <View style={styles.successSection}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Record Saved Successfully!</Text>
          <Text style={styles.successDescription}>
            Patient record has been securely saved to the blockchain
          </Text>
        </View>

        {/* Record Summary */}
        <Card>
          <View style={styles.recordSummary}>
            <Text style={styles.recordTitle}>Record Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Patient:</Text>
              <Text style={styles.summaryValue}>{patientData.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Age:</Text>
              <Text style={styles.summaryValue}>{patientData.age} years</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Record ID:</Text>
              <Text style={styles.summaryValue}>{recordId}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Timestamp:</Text>
              <Text style={styles.summaryValue}>
                {new Date().toLocaleString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Blockchain Information */}
        <Card>
          <View style={styles.blockchainSection}>
            <Text style={styles.blockchainTitle}>Blockchain Details</Text>
            <Text style={styles.blockchainDescription}>
              Your record is now permanently secured on the blockchain
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

            {/* Security Features */}
            <View style={styles.securityFeatures}>
              <View style={styles.securityFeature}>
                <Text style={styles.securityIcon}>🔒</Text>
                <Text style={styles.securityText}>Encrypted & Immutable</Text>
              </View>
              <View style={styles.securityFeature}>
                <Text style={styles.securityIcon}>⏰</Text>
                <Text style={styles.securityText}>Timestamped</Text>
              </View>
              <View style={styles.securityFeature}>
                <Text style={styles.securityIcon}>✅</Text>
                <Text style={styles.securityText}>Verified</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* What's Next */}
        <Card>
          <View style={styles.nextStepsSection}>
            <Text style={styles.nextStepsTitle}>What's Next?</Text>
            <View style={styles.nextStep}>
              <Text style={styles.nextStepIcon}>👁️</Text>
              <Text style={styles.nextStepText}>
                View and export the complete record anytime
              </Text>
            </View>
            <View style={styles.nextStep}>
              <Text style={styles.nextStepIcon}>🔍</Text>
              <Text style={styles.nextStepText}>
                Search and access through the History tab
              </Text>
            </View>
            <View style={styles.nextStep}>
              <Text style={styles.nextStepIcon}>📤</Text>
              <Text style={styles.nextStepText}>
                Share with healthcare providers securely
              </Text>
            </View>
            <View style={styles.nextStep}>
              <Text style={styles.nextStepIcon}>🔗</Text>
              <Text style={styles.nextStepText}>
                Blockchain verification available 24/7
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.viewRecordButton}
            onPress={handleViewRecord}
          >
            <Text style={styles.viewRecordButtonText}>👁️ View Record</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.newRecordButton}
            onPress={handleNewRecord}
          >
            <Text style={styles.newRecordButtonText}>➕ New Record</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.dashboardButton}
          onPress={handleBackToDashboard}
        >
          <Text style={styles.dashboardButtonText}>🏠 Back to Dashboard</Text>
        </TouchableOpacity>
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
  successSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d4edda',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIconText: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 8,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  recordSummary: {
    marginBottom: 8,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  blockchainSection: {
    marginBottom: 8,
  },
  blockchainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  securityFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  securityFeature: {
    alignItems: 'center',
  },
  securityIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  nextStepsSection: {
    marginBottom: 8,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  nextStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextStepIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  nextStepText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewRecordButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 0.45,
    alignItems: 'center',
  },
  viewRecordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newRecordButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 0.45,
    alignItems: 'center',
  },
  newRecordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dashboardButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 