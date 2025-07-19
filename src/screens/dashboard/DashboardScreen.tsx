import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { FloatingActionButton } from '../../components/common/FloatingActionButton';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const handleNewRecord = () => {
    navigation.navigate('InputMode');
  };

  const navigateToSettings = () => {
    // Will be handled by tab navigation
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Shifaa Dashboard" 
        rightAction={{
          iconName: 'settings',
          onPress: navigateToSettings
        }}
      />
      
      <ScrollView style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Card>
            <Text style={styles.sectionTitle}>Today's Summary</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Records</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>Voice Notes</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>4</Text>
                <Text style={styles.statLabel}>AI Summaries</Text>
              </View>
            </View>
          </Card>
        </View>



        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <Card>
                         <View style={styles.activityItem}>
               <View style={styles.activityIcon}>
                 <Ionicons name="person" size={20} color="#2196F3" />
               </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Patient Record Saved</Text>
                <Text style={styles.activityDescription}>Ahmad, Age 45 - Chest pain</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>

                         <View style={styles.activityItem}>
               <View style={styles.activityIcon}>
                 <Ionicons name="mic" size={20} color="#2196F3" />
               </View>
               <View style={styles.activityContent}>
                 <Text style={styles.activityTitle}>Voice Note Transcribed</Text>
                 <Text style={styles.activityDescription}>Fatima, Age 32 - Headache symptoms</Text>
                 <Text style={styles.activityTime}>15 minutes ago</Text>
               </View>
             </View>

             <View style={styles.activityItem}>
               <View style={styles.activityIcon}>
                 <MaterialIcons name="smart-toy" size={20} color="#2196F3" />
               </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>AI Summary Generated</Text>
                <Text style={styles.activityDescription}>Omar, Age 28 - Fever and cough</Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* System Status */}
        <View style={styles.statusSection}>
          <Card>
            <Text style={styles.sectionTitle}>System Status</Text>
            <View style={styles.statusGrid}>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, styles.statusOnline]} />
                <Text style={styles.statusText}>Offline Mode</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, styles.statusOnline]} />
                <Text style={styles.statusText}>Local Storage</Text>
              </View>
              <View style={styles.statusItem}>
                <View style={[styles.statusDot, styles.statusOffline]} />
                <Text style={styles.statusText}>Cloud Sync</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
      
      <FloatingActionButton onPress={handleNewRecord} />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  statsSection: {
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },


  recentSection: {
    marginTop: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  statusSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusOnline: {
    backgroundColor: '#10b981',
  },
  statusOffline: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
}); 