import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Splash & Initial Setup
import { SplashScreen } from '../screens/auth/SplashScreen';
import { PermissionsScreen } from '../screens/auth/PermissionsScreen';

// Dashboard
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';

// Patient Flow
import { InputModeScreen } from '../screens/patient/InputModeScreen';
import { PatientLookupScreen } from '../screens/patient/PatientLookupScreen';
import { PatientProfileFormScreen } from '../screens/patient/PatientProfileFormScreen';
import { DemographicsVitalsScreen } from '../screens/patient/DemographicsVitalsScreen';
import { MedsAllergiesScreen } from '../screens/patient/MedsAllergiesScreen';
import { HistoryReviewScreen } from '../screens/patient/HistoryReviewScreen';
import { ChiefComplaintScreen } from '../screens/patient/ChiefComplaintScreen';
import { FormEntryScreen } from '../screens/patient/FormEntryScreen';
import { VoiceEntryScreen } from '../screens/patient/VoiceEntryScreen';
import { SummaryScreen } from '../screens/patient/SummaryScreen';
import { ReviewScreen } from '../screens/patient/ReviewScreen';
import { ConfirmationScreen } from '../screens/patient/ConfirmationScreen';

// Patients
import { PatientsListScreen } from '../screens/patients/PatientsListScreen';
import { PatientDetailScreen } from '../screens/patients/PatientDetailScreen';
import { RecordDetailScreen } from '../screens/history/RecordDetailScreen';

// Settings
import { SettingsScreen } from '../screens/settings/SettingsScreen';

export type RootStackParamList = {
  Splash: undefined;
  Permissions: undefined;
  MainTabs: undefined;
  InputMode: undefined;
  PatientLookup: undefined;
  PatientProfileForm: undefined;
  DemographicsVitals: { patientId?: string };
  MedsAllergies: { patientData: any };
  HistoryReview: { patientData: any };
  ChiefComplaint: { patientData: any };
  FormEntry: { mode?: 'form' | 'voice'; initialData?: any };
  VoiceEntry: { initialData?: any };
  Summary: { patientData: any; summaryText?: string };
  Review: { patientData: any };
  Confirmation: { patientData: any; recordId: string };
  PatientDetail: { patientId: string };
  RecordDetail: { recordId: string; record: any };
};

export type TabParamList = {
  Dashboard: undefined;
  Patients: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Tab bar icon component with vector icons
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  let iconName: keyof typeof Ionicons.glyphMap;
  
  if (name === 'Dashboard') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (name === 'Patients') {
    iconName = focused ? 'people' : 'people-outline';
  } else {
    iconName = focused ? 'settings' : 'settings-outline';
  }

  return (
    <Ionicons 
      name={iconName} 
      size={24} 
      color={focused ? '#2196F3' : '#666'} 
    />
  );
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
      })}
          >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Patients" component={PatientsListScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#f5f5f5' }
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Permissions" component={PermissionsScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="InputMode" component={InputModeScreen} />
        <Stack.Screen name="PatientLookup" component={PatientLookupScreen} />
        <Stack.Screen name="PatientProfileForm" component={PatientProfileFormScreen} />
        <Stack.Screen name="DemographicsVitals" component={DemographicsVitalsScreen} />
        <Stack.Screen name="MedsAllergies" component={MedsAllergiesScreen} />
        <Stack.Screen name="HistoryReview" component={HistoryReviewScreen} />
        <Stack.Screen name="ChiefComplaint" component={ChiefComplaintScreen} />
        <Stack.Screen name="FormEntry" component={FormEntryScreen} />
        <Stack.Screen name="VoiceEntry" component={VoiceEntryScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name="PatientDetail" component={PatientDetailScreen} />
        <Stack.Screen name="RecordDetail" component={RecordDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 