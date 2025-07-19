import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import CryptoJS from 'crypto-js';
import CryptoService from './CryptoService';
import { SECURITY_CONFIG } from '../utils/constants';

export interface DoctorProfile {
  doctorId: string;
  name: string;
  role: 'doctor' | 'nurse' | 'resident' | 'observer';
  pinHash: string;
  createdAt: number;
  lastLogin: number;
  failedAttempts: number;
}

export interface SessionData {
  doctorId: string;
  deviceFingerprint: string;
  timestamp: number;
  expiresAt: number;
  permissions: string[];
  sessionId: string;
}

export interface AuthResult {
  success: boolean;
  sessionToken?: string;
  doctorProfile?: DoctorProfile;
  error?: string;
}

export interface BiometricCapabilities {
  isAvailable: boolean;
  isEnrolled: boolean;
  supportedTypes: number[];
  hasHardware: boolean;
}

export default class AuthService {
  private static instance: AuthService;
  private cryptoService: CryptoService;
  private currentSession: SessionData | null = null;
  private biometricCapabilities: BiometricCapabilities | null = null;

  constructor() {
    console.log('🔑 AuthService initializing for Gaza medical security...');
    this.cryptoService = CryptoService.getInstance();
  }

  // Singleton pattern for consistent authentication across app
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize authentication service for Gaza clinic deployment
   * Checks biometric capabilities and prepares multi-doctor support
   */
  public async initialize(): Promise<void> {
    try {
      console.log('🔑 Initializing auth service for Gaza clinic...');
      
      // Initialize crypto service first
      await this.cryptoService.initialize();
      
      // Check biometric capabilities for Gaza clinic devices
      this.biometricCapabilities = await this.checkBiometricCapabilities();
      
      // Restore any existing session
      await this.restoreSession();
      
      console.log('✅ AuthService ready - Gaza clinic authentication prepared!');
    } catch (error) {
      console.error('❌ AuthService initialization failed:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`Auth initialization failed: ${errorMsg}`);
    }
  }

  /**
   * Check biometric authentication capabilities of Gaza clinic device
   * Supports fingerprint, face recognition, and iris scanning
   */
  private async checkBiometricCapabilities(): Promise<BiometricCapabilities> {
    try {
      console.log('📱 Checking biometric capabilities for Gaza clinic device...');
      
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      const capabilities: BiometricCapabilities = {
        isAvailable: hasHardware && isEnrolled,
        isEnrolled,
        supportedTypes,
        hasHardware
      };

      if (capabilities.isAvailable) {
        console.log('✅ Biometric authentication available on Gaza clinic device');
      } else {
        console.log('⚠️ Biometric authentication not available - PIN-only mode for Gaza clinic');
      }

      return capabilities;
    } catch (error) {
      console.error('❌ Biometric capability check failed:', error);
      return {
        isAvailable: false,
        isEnrolled: false,
        supportedTypes: [],
        hasHardware: false
      };
    }
  }

  /**
   * Register new doctor for Gaza clinic device
   * Supports unlimited doctors per device for clinic flexibility
   */
  public async registerDoctor(
    doctorId: string, 
    name: string, 
    pin: string, 
    role: DoctorProfile['role'] = 'doctor'
  ): Promise<boolean> {
    try {
      console.log(`🏥 Registering doctor ${name} for Gaza clinic access...`);
      
      // Validate input data
      if (!doctorId || !name || !pin) {
        throw new Error('Doctor ID, name, and PIN are required');
      }

      if (pin.length !== SECURITY_CONFIG.PIN_LENGTH) {
        throw new Error(`PIN must be exactly ${SECURITY_CONFIG.PIN_LENGTH} digits`);
      }

      // Check if doctor already exists
      const existingDoctor = await this.getDoctorProfile(doctorId);
      if (existingDoctor) {
        throw new Error('Doctor already registered on this Gaza clinic device');
      }

      // Strengthen PIN using crypto service
      const pinHash = await this.cryptoService.strengthenDoctorPin(pin, doctorId);

      // Create doctor profile
      const doctorProfile: DoctorProfile = {
        doctorId,
        name,
        role,
        pinHash,
        createdAt: Date.now(),
        lastLogin: 0,
        failedAttempts: 0
      };

      // Store doctor profile securely
      const profileKey = `${SECURITY_CONFIG.STORAGE_KEYS.DOCTOR_DATA}${doctorId}`;
      const encryptedProfile = await this.cryptoService.encryptPatientData(
        doctorProfile as any, 
        'doctor_profile'
      );
      
      await SecureStore.setItemAsync(profileKey, JSON.stringify(encryptedProfile));

      console.log(`✅ Doctor ${name} registered successfully for Gaza clinic`);
      return true;
    } catch (error) {
      console.error('❌ Doctor registration failed:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`Doctor registration failed: ${errorMsg}`);
    }
  }

  /**
   * Authenticate doctor for Gaza clinic access
   * Supports PIN + biometric multi-factor authentication
   */
  public async authenticateDoctor(
    doctorId: string, 
    pin: string, 
    requireBiometric: boolean = true
  ): Promise<AuthResult> {
    try {
      console.log(`🔐 Authenticating doctor ${doctorId} for Gaza clinic access...`);
      
      // Get doctor profile
      const doctorProfile = await this.getDoctorProfile(doctorId);
      if (!doctorProfile) {
        return { success: false, error: 'Doctor not found on this Gaza clinic device' };
      }

      // Check if account is locked due to failed attempts
      if (doctorProfile.failedAttempts >= SECURITY_CONFIG.MAX_PIN_ATTEMPTS) {
        await this.logSecurityEvent('ACCOUNT_LOCKED', 'HIGH', { doctorId });
        return { success: false, error: 'Account locked due to too many failed attempts' };
      }

      // Step 1: Verify PIN
      const pinHash = await this.cryptoService.strengthenDoctorPin(pin, doctorId);
      if (pinHash !== doctorProfile.pinHash) {
        await this.incrementFailedAttempts(doctorId);
        await this.logSecurityEvent('INVALID_PIN', 'MEDIUM', { doctorId });
        return { success: false, error: 'Invalid PIN' };
      }

      // Step 2: Biometric authentication (if available and required)
      if (requireBiometric && this.biometricCapabilities?.isAvailable) {
        const biometricResult = await this.performBiometricAuth(doctorProfile.name);
        if (!biometricResult.success) {
          await this.logSecurityEvent('BIOMETRIC_FAILED', 'HIGH', { doctorId });
          return { success: false, error: 'Biometric authentication failed' };
        }
      }

      // Step 3: Generate secure session for Gaza clinic access
      const sessionToken = await this.generateSecureSession(doctorProfile);

      // Reset failed attempts and update last login
      await this.resetFailedAttempts(doctorId);
      await this.updateLastLogin(doctorId);

      await this.logSecurityEvent('SUCCESSFUL_AUTH', 'LOW', { doctorId });

      console.log(`✅ Doctor ${doctorProfile.name} authenticated for Gaza clinic access`);
      
      return {
        success: true,
        sessionToken,
        doctorProfile
      };
    } catch (error) {
      console.error('❌ Doctor authentication failed:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      await this.logSecurityEvent('AUTH_ERROR', 'HIGH', { doctorId, error: errorMsg });
      return { success: false, error: `Authentication failed: ${errorMsg}` };
    }
  }

  /**
   * Perform biometric authentication for Gaza clinic security
   * Supports fingerprint, face recognition based on device capabilities
   */
  private async performBiometricAuth(doctorName: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('👆 Performing biometric authentication for Gaza clinic...');
      
      if (!this.biometricCapabilities?.isAvailable) {
        return { success: false, error: 'Biometric authentication not available' };
      }

      const biometricResult = await LocalAuthentication.authenticateAsync({
        promptMessage: `Gaza Clinic Access - Verify identity for Dr. ${doctorName}`,
        fallbackLabel: 'Use PIN instead',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        requireConfirmation: true
      });

      if (biometricResult.success) {
        console.log('✅ Biometric authentication successful for Gaza clinic');
        return { success: true };
      } else {
        console.log('❌ Biometric authentication failed:', biometricResult.error);
        return { success: false, error: biometricResult.error || 'Biometric authentication failed' };
      }
    } catch (error) {
      console.error('❌ Biometric authentication error:', error);
      return { success: false, error: 'Biometric authentication error' };
    }
  }

  /**
   * Generate secure session token for Gaza clinic access
   * Includes device binding and permission management
   */
  private async generateSecureSession(doctorProfile: DoctorProfile): Promise<string> {
    try {
      console.log('🎫 Generating secure session for Gaza clinic access...');
      
      const deviceFingerprint = this.cryptoService.getDeviceFingerprint();
      if (!deviceFingerprint) {
        throw new Error('Device fingerprint not available');
      }

      const sessionId = CryptoJS.lib.WordArray.random(16).toString();
      const timestamp = Date.now();
      const expiresAt = timestamp + SECURITY_CONFIG.SESSION_TIMEOUT;

      const sessionData: SessionData = {
        doctorId: doctorProfile.doctorId,
        deviceFingerprint: deviceFingerprint.hash,
        timestamp,
        expiresAt,
        permissions: await this.getDoctorPermissions(doctorProfile.role),
        sessionId
      };

      // Encrypt session data
      const encryptedSession = await this.cryptoService.encryptPatientData(
        sessionData as any,
        'session_data'
      );

      const sessionToken = JSON.stringify(encryptedSession);
      
      // Store active session
      await SecureStore.setItemAsync(SECURITY_CONFIG.STORAGE_KEYS.ACTIVE_SESSION, sessionToken);
      this.currentSession = sessionData;

      console.log('✅ Secure session generated for Gaza clinic access');
      return sessionToken;
    } catch (error) {
      console.error('❌ Session generation failed:', error);
      throw new Error('Failed to generate secure session');
    }
  }

  /**
   * Validate existing session for Gaza clinic access
   * Checks expiration, device binding, and permissions
   */
  public async validateSession(): Promise<boolean> {
    try {
      const sessionToken = await SecureStore.getItemAsync(SECURITY_CONFIG.STORAGE_KEYS.ACTIVE_SESSION);
      if (!sessionToken) {
        return false;
      }

      // Decrypt session data
      const encryptedSession = JSON.parse(sessionToken);
      const sessionData = await this.cryptoService.decryptPatientData(
        encryptedSession,
        'session_data'
      ) as any as SessionData;

      // Check expiration
      if (Date.now() > sessionData.expiresAt) {
        console.log('⏰ Session expired for Gaza clinic access');
        await this.clearSession();
        return false;
      }

      // Verify device hasn't changed (security for Gaza clinic shared devices)
      const currentDevice = this.cryptoService.getDeviceFingerprint();
      if (!currentDevice || currentDevice.hash !== sessionData.deviceFingerprint) {
        console.log('🔒 Device fingerprint mismatch - clearing session for Gaza security');
        await this.logSecurityEvent('DEVICE_MISMATCH', 'CRITICAL', { 
          sessionDoctorId: sessionData.doctorId 
        });
        await this.clearSession();
        return false;
      }

      this.currentSession = sessionData;
      console.log('✅ Session valid for Gaza clinic access');
      return true;
    } catch (error) {
      console.error('❌ Session validation failed:', error);
      await this.clearSession();
      return false;
    }
  }

  /**
   * Get doctor permissions based on role for Gaza clinic hierarchy
   */
  private async getDoctorPermissions(role: DoctorProfile['role']): Promise<string[]> {
    const permissions = {
      'doctor': ['read_patients', 'write_patients', 'delete_patients', 'access_ai', 'view_all_records'],
      'nurse': ['read_patients', 'write_patients', 'access_ai', 'view_assigned_records'],
      'resident': ['read_patients', 'write_patients', 'view_assigned_records'],
      'observer': ['read_patients', 'view_assigned_records']
    };

    return permissions[role] || permissions['observer'];
  }

  /**
   * Check if current user has specific permission for Gaza clinic access control
   */
  public async checkPermission(action: string): Promise<boolean> {
    if (!this.currentSession) {
      return false;
    }

    const hasPermission = this.currentSession.permissions.includes(action);
    
    if (!hasPermission) {
      await this.logSecurityEvent('UNAUTHORIZED_ACTION', 'HIGH', { 
        doctorId: this.currentSession.doctorId,
        action 
      });
    }
    
    return hasPermission;
  }

  /**
   * Get doctor profile from secure storage
   */
  private async getDoctorProfile(doctorId: string): Promise<DoctorProfile | null> {
    try {
      const profileKey = `${SECURITY_CONFIG.STORAGE_KEYS.DOCTOR_DATA}${doctorId}`;
      const encryptedProfile = await SecureStore.getItemAsync(profileKey);
      
      if (!encryptedProfile) {
        return null;
      }

      const profileData = JSON.parse(encryptedProfile);
      const decryptedProfile = await this.cryptoService.decryptPatientData(
        profileData,
        'doctor_profile'
      );

      return decryptedProfile as any as DoctorProfile;
    } catch (error) {
      console.error('❌ Failed to get doctor profile:', error);
      return null;
    }
  }

  /**
   * Increment failed login attempts for security
   */
  private async incrementFailedAttempts(doctorId: string): Promise<void> {
    try {
      const profile = await this.getDoctorProfile(doctorId);
      if (profile) {
        profile.failedAttempts += 1;
        await this.updateDoctorProfile(profile);
      }
    } catch (error) {
      console.error('❌ Failed to increment failed attempts:', error);
    }
  }

  /**
   * Reset failed login attempts after successful authentication
   */
  private async resetFailedAttempts(doctorId: string): Promise<void> {
    try {
      const profile = await this.getDoctorProfile(doctorId);
      if (profile) {
        profile.failedAttempts = 0;
        await this.updateDoctorProfile(profile);
      }
    } catch (error) {
      console.error('❌ Failed to reset failed attempts:', error);
    }
  }

  /**
   * Update last login timestamp
   */
  private async updateLastLogin(doctorId: string): Promise<void> {
    try {
      const profile = await this.getDoctorProfile(doctorId);
      if (profile) {
        profile.lastLogin = Date.now();
        await this.updateDoctorProfile(profile);
      }
    } catch (error) {
      console.error('❌ Failed to update last login:', error);
    }
  }

  /**
   * Update doctor profile in secure storage
   */
  private async updateDoctorProfile(profile: DoctorProfile): Promise<void> {
    try {
      const profileKey = `${SECURITY_CONFIG.STORAGE_KEYS.DOCTOR_DATA}${profile.doctorId}`;
      const encryptedProfile = await this.cryptoService.encryptPatientData(
        profile as any,
        'doctor_profile'
      );
      
      await SecureStore.setItemAsync(profileKey, JSON.stringify(encryptedProfile));
    } catch (error) {
      console.error('❌ Failed to update doctor profile:', error);
      throw error;
    }
  }

  /**
   * Restore session from storage on app startup
   */
  private async restoreSession(): Promise<void> {
    try {
      const isValid = await this.validateSession();
      if (isValid) {
        console.log('✅ Session restored for Gaza clinic access');
      }
    } catch (error) {
      console.error('❌ Session restoration failed:', error);
      await this.clearSession();
    }
  }

  /**
   * Clear current session (logout)
   */
  public async clearSession(): Promise<void> {
    try {
      console.log('🧹 Clearing session for Gaza clinic security logout...');
      
      this.currentSession = null;
      await SecureStore.deleteItemAsync(SECURITY_CONFIG.STORAGE_KEYS.ACTIVE_SESSION);
      
      console.log('✅ Session cleared for Gaza clinic security');
    } catch (error) {
      console.error('❌ Session clearing failed:', error);
    }
  }

  /**
   * Get current session data
   */
  public getCurrentSession(): SessionData | null {
    return this.currentSession;
  }

  /**
   * Get biometric capabilities of device
   */
  public getBiometricCapabilities(): BiometricCapabilities | null {
    return this.biometricCapabilities;
  }

  /**
   * Log security events for Gaza clinic audit trail
   */
  private async logSecurityEvent(
    event: string, 
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', 
    details: any = {}
  ): Promise<void> {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        severity,
        details,
        deviceId: this.cryptoService.getDeviceFingerprint()?.hash,
        sessionId: this.currentSession?.sessionId
      };

      console.log(`🔍 Security Event [${severity}]: ${event}`, details);
      
      // Store security log entry
      const logKey = `security_log_${Date.now()}`;
      const encryptedLog = await this.cryptoService.encryptPatientData(
        logEntry as any,
        'security_log'
      );
      
      await SecureStore.setItemAsync(logKey, JSON.stringify(encryptedLog));
    } catch (error) {
      console.error('❌ Security logging failed:', error);
    }
  }
}