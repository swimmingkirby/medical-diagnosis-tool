import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { SECURITY_CONFIG, PATIENT_DATA_SCHEMA } from '../utils/constants';

export interface PatientData {
  name: string;
  age: number;
  symptoms: string;
  notes: string;
  timestamp?: number;
  doctorId?: string;
}

export interface EncryptedPackage {
  encrypted: string;
  hmac: string;
  timestamp: number;
  algorithm: string;
}

export interface DeviceFingerprint {
  deviceId: string;
  modelName: string;
  brand: string;
  osName: string;
  osVersion: string;
  hash: string;
}

export default class CryptoService {
  private static instance: CryptoService;
  private masterKey: string | null = null;
  private deviceFingerprint: DeviceFingerprint | null = null;

  constructor() {
    console.log('🔐 CryptoService initializing for Gaza medical security...');
  }

  // Singleton pattern for consistent encryption across app
  public static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService();
    }
    return CryptoService.instance;
  }

  /**
   * Initialize the crypto service - call this first!
   * Generates device fingerprint and master key for Gaza deployment
   */
  public async initialize(): Promise<void> {
    try {
      console.log('🔐 Initializing crypto service for Gaza conditions...');
      
      // Generate device fingerprint for unique device identification
      this.deviceFingerprint = await this.generateDeviceFingerprint();
      
      // Generate or retrieve master key
      this.masterKey = await this.generateMasterKey();
      
      console.log('✅ CryptoService ready - Gaza medical data protected!');
    } catch (error) {
      console.error('❌ CryptoService initialization failed:', error);
      if (error instanceof Error) {
        throw new Error(`Crypto initialization failed: ${error.message}`);
      } else {
        throw new Error(`Crypto initialization failed: ${String(error)}`);
      }
    }
  }

  /**
   * Generate unique device fingerprint for Gaza clinic devices
   * Uses hardware characteristics to create device-specific identity
   */
  private async generateDeviceFingerprint(): Promise<DeviceFingerprint> {
    try {
      console.log('📱 Generating device fingerprint for Gaza clinic device...');
      
      const deviceInfo = {
        deviceId: Device.osInternalBuildId || 'unknown',
        modelName: Device.modelName || 'unknown',
        brand: Device.brand || 'unknown',
        osName: Device.osName || 'unknown',
        osVersion: Device.osVersion || 'unknown',
        platformApiLevel: Device.platformApiLevel || 0,
        totalMemory: Device.totalMemory || 0
      };

      // Create hash of device characteristics
      const deviceString = JSON.stringify(deviceInfo);
      const hash = CryptoJS.SHA256(deviceString).toString();

      const fingerprint: DeviceFingerprint = {
        deviceId: deviceInfo.deviceId,
        modelName: deviceInfo.modelName,
        brand: deviceInfo.brand,
        osName: deviceInfo.osName,
        osVersion: deviceInfo.osVersion,
        hash
      };

      console.log('✅ Device fingerprint generated for Gaza device');
      return fingerprint;
    } catch (error) {
      console.error('❌ Device fingerprinting failed:', error);
      throw new Error('Failed to generate device fingerprint');
    }
  }

  /**
   * Generate master encryption key using device-specific entropy
   * Gaza-optimized for offline operation
   */
  private async generateMasterKey(): Promise<string> {
    try {
      console.log('🔑 Generating master key for Gaza medical encryption...');
      
      // Check if master key already exists
      const existingKey = await SecureStore.getItemAsync('master_encryption_key');
      if (existingKey) {
        console.log('✅ Using existing master key');
        return existingKey;
      }

      // Generate new master key using device fingerprint + random entropy
      const randomBytes = await Crypto.getRandomBytesAsync(32);
      const deviceEntropy = this.deviceFingerprint?.hash || 'fallback_entropy';
      const timestamp = Date.now().toString();
      
      // Combine entropy sources for Gaza-specific key generation
      const combinedEntropy = deviceEntropy + randomBytes.toString() + timestamp;
      
      // Derive strong master key using PBKDF2
      const masterKey = CryptoJS.PBKDF2(
        combinedEntropy,
        'gaza_medical_salt_2024',
        {
          keySize: 256 / 32,
          iterations: SECURITY_CONFIG.KEY_DERIVATION_ITERATIONS
        }
      ).toString();

      // Store master key securely
      await SecureStore.setItemAsync('master_encryption_key', masterKey);
      
      console.log('✅ Master key generated and stored securely');
      return masterKey;
    } catch (error) {
      console.error('❌ Master key generation failed:', error);
      throw new Error('Failed to generate master key');
    }
  }

  /**
   * Derive purpose-specific encryption key
   * Gaza medical data requires different keys for different purposes
   */
  private async deriveKey(purpose: string = 'general'): Promise<string> {
    if (!this.masterKey) {
      throw new Error('CryptoService not initialized - call initialize() first');
    }

    try {
      // Create purpose-specific salt for key derivation
      const purposeSalt = `gaza_medical_${purpose}_${this.deviceFingerprint?.hash}`;
      
      // Derive key using PBKDF2 for Gaza security requirements
      const derivedKey = CryptoJS.PBKDF2(
        this.masterKey,
        purposeSalt,
        {
          keySize: 256 / 32,
          iterations: SECURITY_CONFIG.KEY_DERIVATION_ITERATIONS
        }
      ).toString();

      return derivedKey;
    } catch (error) {
      console.error('❌ Key derivation failed:', error);
      throw new Error(`Failed to derive key for purpose: ${purpose}`);
    }
  }

  /**
   * Encrypt patient data for Gaza medical records
   * Uses AES-256 with HMAC for integrity verification
   */
  public async encryptPatientData(
    data: PatientData, 
    purpose: string = 'patient_data'
  ): Promise<EncryptedPackage> {
    try {
      console.log('🔐 Encrypting Gaza patient data...');
      
      if (!this.masterKey) {
        throw new Error('CryptoService not initialized');
      }

      // Validate patient data structure
      this.validatePatientData(data);

      // Add timestamp and prepare data for encryption
      const dataWithTimestamp = {
        ...data,
        timestamp: Date.now(),
        deviceId: this.deviceFingerprint?.hash
      };

      // Derive encryption key for this purpose
      const encryptionKey = await this.deriveKey(purpose);
      
      // Encrypt using AES-256
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(dataWithTimestamp),
        encryptionKey
      ).toString();

      // Generate HMAC for integrity verification
      const hmac = CryptoJS.HmacSHA256(encrypted, encryptionKey).toString();

      const encryptedPackage: EncryptedPackage = {
        encrypted,
        hmac,
        timestamp: Date.now(),
        algorithm: 'AES-256'
      };

      console.log('✅ Gaza patient data encrypted successfully');
      return encryptedPackage;
    } catch (error) {
      console.error('❌ Patient data encryption failed:', error);
      if (error instanceof Error) {
        throw new Error(`Encryption failed: ${error.message}`);
      } else {
        throw new Error(`Encryption failed: ${String(error)}`);
      }
    }
  }

  /**
   * Decrypt patient data for Gaza medical access
   * Verifies integrity before decryption
   */
  public async decryptPatientData(
    encryptedPackage: EncryptedPackage,
    purpose: string = 'patient_data'
  ): Promise<PatientData> {
    try {
      console.log('🔓 Decrypting Gaza patient data...');
      
      if (!this.masterKey) {
        throw new Error('CryptoService not initialized');
      }

      // Derive decryption key
      const decryptionKey = await this.deriveKey(purpose);

      // Verify HMAC integrity first - critical for Gaza medical data
      const computedHmac = CryptoJS.HmacSHA256(
        encryptedPackage.encrypted,
        decryptionKey
      ).toString();

      if (computedHmac !== encryptedPackage.hmac) {
        console.error('❌ Data integrity check failed - possible tampering!');
        throw new Error('Data integrity verification failed - data may be corrupted or tampered');
      }

      // Decrypt the data
      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedPackage.encrypted,
        decryptionKey
      );
      
      const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Decryption failed - invalid key or corrupted data');
      }

      const decryptedData = JSON.parse(decryptedString);
      
      console.log('✅ Gaza patient data decrypted successfully');
      return decryptedData as PatientData;
    } catch (error) {
      console.error('❌ Patient data decryption failed:', error);
      if (error instanceof Error) {
        throw new Error(`Decryption failed: ${error.message}`);
      } else {
        throw new Error(`Decryption failed: ${String(error)}`);
      }
    }
  }

  /**
   * Generate SHA-256 hash for blockchain storage
   * Gaza medical records need tamper-proof blockchain hashes
   */
  public async generateBlockchainHash(data: PatientData): Promise<string> {
    try {
      console.log('⛓️ Generating blockchain hash for Gaza medical record...');
      
      // Add device and timestamp info for unique hash
      const hashData = {
        ...data,
        deviceId: this.deviceFingerprint?.hash,
        timestamp: Date.now()
      };

      // Generate SHA-256 hash for blockchain storage
      const hash = CryptoJS.SHA256(JSON.stringify(hashData)).toString();
      
      console.log('✅ Blockchain hash generated for Gaza medical record');
      return hash;
    } catch (error) {
      console.error('❌ Blockchain hash generation failed:', error);
      if (error instanceof Error) {
        throw new Error(`Hash generation failed: ${error.message}`);
      } else {
        throw new Error(`Hash generation failed: ${String(error)}`);
      }
    }
  }

  /**
   * Strengthen doctor PIN using PBKDF2
   * Gaza clinic security requires strong PIN protection
   */
  public async strengthenDoctorPin(pin: string, doctorId: string): Promise<string> {
    try {
      console.log('🔑 Strengthening doctor PIN for Gaza clinic security...');
      
      // Create doctor-specific salt
      const doctorSalt = `gaza_doctor_${doctorId}_${this.deviceFingerprint?.hash}`;
      
      // Strengthen PIN using PBKDF2 with high iteration count
      const strengthenedPin = CryptoJS.PBKDF2(
        pin,
        doctorSalt,
        {
          keySize: 256 / 32,
          iterations: SECURITY_CONFIG.KEY_DERIVATION_ITERATIONS * 2 // Extra strong for Gaza
        }
      ).toString();

      console.log('✅ Doctor PIN strengthened for Gaza security');
      return strengthenedPin;
    } catch (error) {
      console.error('❌ PIN strengthening failed:', error);
      if (error instanceof Error) {
        throw new Error(`PIN strengthening failed: ${error.message}`);
      } else {
        throw new Error(`PIN strengthening failed: ${String(error)}`);
      }
    }
  }

  /**
   * Validate patient data structure for Gaza medical requirements
   */
  private validatePatientData(data: PatientData): void {
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Patient name is required and must be a string');
    }
    
    if (typeof data.age !== 'number' || data.age < 0 || data.age > 150) {
      throw new Error('Patient age must be a valid number between 0 and 150');
    }
    
    if (!data.symptoms || typeof data.symptoms !== 'string') {
      throw new Error('Patient symptoms are required and must be a string');
    }
    
    if (data.notes && typeof data.notes !== 'string') {
      throw new Error('Patient notes must be a string if provided');
    }
  }

  /**
   * Get device fingerprint for Gaza clinic device identification
   */
  public getDeviceFingerprint(): DeviceFingerprint | null {
    return this.deviceFingerprint;
  }

  /**
   * Clear all cryptographic data (for security logout)
   * Gaza emergency security clearance
   */
  public async clearCryptoData(): Promise<void> {
    try {
      console.log('🧹 Clearing crypto data for Gaza security logout...');
      
      this.masterKey = null;
      this.deviceFingerprint = null;
      
      // Note: We keep the master key in SecureStore for persistence
      // Only clear memory values for security
      
      console.log('✅ Crypto data cleared from memory');
    } catch (error) {
      console.error('❌ Crypto data clearing failed:', error);
      throw new Error('Failed to clear crypto data');
    }
  }
}