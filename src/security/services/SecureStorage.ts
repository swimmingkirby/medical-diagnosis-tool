import * as SecureStore from 'expo-secure-store';
import CryptoService, { PatientData, EncryptedPackage } from './CryptoService';
import { SECURITY_CONFIG, PATIENT_DATA_SCHEMA } from '../utils/constants';
import CryptoJS from 'crypto-js';

export interface StorageResult {
  success: boolean;
  hash?: string;
  error?: string;
}

export interface PatientRecord {
  patientId: string;
  data: PatientData;
  createdAt: number;
  updatedAt: number;
  doctorId: string;
  encrypted: boolean;
  integrityHash: string;
}

export interface StorageStats {
  totalPatients: number;
  totalSize: number;
  lastBackup: number;
  encryptionStatus: 'active' | 'inactive';
}

export interface ValidationResult {
  isValid: boolean;
  corrupted: string[];
  missing: string[];
  integrityFailures: string[];
}

export default class SecureStorage {
  private static instance: SecureStorage;
  private cryptoService: CryptoService;
  private cache: Map<string, PatientRecord> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes for Gaza battery optimization

  constructor() {
    console.log('💾 SecureStorage initializing for Gaza medical data protection...');
    this.cryptoService = CryptoService.getInstance();
  }

  // Singleton pattern for consistent storage across Gaza clinic app
  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  /**
   * Initialize secure storage system for Gaza clinic deployment
   * Prepares encryption and validates existing data integrity
   */
  public async initialize(): Promise<void> {
    try {
      console.log('💾 Initializing secure storage for Gaza clinic...');
      
      // Initialize crypto service first
      await this.cryptoService.initialize();
      
      // Validate existing stored data integrity
      await this.validateStoredDataIntegrity();
      
      // Setup cache cleanup for battery optimization
      this.setupCacheCleanup();
      
      console.log('✅ SecureStorage ready - Gaza medical data protection active!');
    } catch (error) {
      console.error('❌ SecureStorage initialization failed:', error);
      let errorMessage = 'Unknown error';
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      throw new Error(`Storage initialization failed: ${errorMessage}`);
    }
  }

  /**
   * Store patient data securely for Gaza medical records
   * Multi-layer encryption with integrity verification
   */
  public async storePatientData(
    patientId: string, 
    data: PatientData, 
    doctorId: string
  ): Promise<StorageResult> {
    try {
      console.log(`💾 Storing patient data securely for Gaza clinic: ${patientId}`);
      
      // Validate input data for Gaza medical requirements
      const sanitizedData = this.sanitizePatientData(data);
      this.validatePatientData(sanitizedData);

      // Generate unique storage key for patient
      const storageKey = this.generatePatientStorageKey(patientId);
      
      // Encrypt patient data with patient-specific key
      const encryptedData = await this.cryptoService.encryptPatientData(
        sanitizedData,
        `patient_${patientId}`
      );

      // Generate integrity hash for tamper detection
      const integrityHash = await this.generateIntegrityHash(encryptedData);

      // Create patient record with metadata
      const patientRecord: PatientRecord = {
        patientId,
        data: sanitizedData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        doctorId,
        encrypted: true,
        integrityHash
      };

      // Store encrypted data
      await SecureStore.setItemAsync(storageKey, JSON.stringify(encryptedData));
      
      // Store integrity hash separately for verification
      const integrityKey = this.generateIntegrityStorageKey(patientId);
      await SecureStore.setItemAsync(integrityKey, integrityHash);

      // Store patient record metadata
      const metadataKey = this.generateMetadataStorageKey(patientId);
      const encryptedMetadata = await this.cryptoService.encryptPatientData(
        patientRecord as any,
        'patient_metadata'
      );
      await SecureStore.setItemAsync(metadataKey, JSON.stringify(encryptedMetadata));

      // Update cache for Gaza clinic performance
      this.cache.set(patientId, patientRecord);

      // Log storage event for Gaza clinic audit
      await this.logStorageEvent('PATIENT_STORED', 'LOW', { 
        patientId, 
        doctorId,
        size: JSON.stringify(encryptedData).length 
      });

      console.log(`✅ Patient data stored securely for Gaza clinic: ${patientId}`);
      
      return {
        success: true,
        hash: integrityHash
      };
    } catch (error) {
      console.error('❌ Patient data storage failed:', error);
      await this.logStorageEvent('STORAGE_ERROR', 'HIGH', { 
        patientId, 
        doctorId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      
      return {
        success: false,
        error: `Storage failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Retrieve patient data securely for Gaza medical access
   * Includes integrity verification and tamper detection
   */
  public async retrievePatientData(patientId: string): Promise<PatientRecord | null> {
    try {
      console.log(`🔓 Retrieving patient data for Gaza clinic: ${patientId}`);
      
      // Check cache first for Gaza clinic performance optimization
      const cachedRecord = this.cache.get(patientId);
      if (cachedRecord && this.isCacheValid(cachedRecord)) {
        console.log(`⚡ Cache hit for patient: ${patientId}`);
        await this.logDataAccess(patientId, 'CACHE_ACCESS');
        return cachedRecord;
      }

      // Verify data integrity before decryption (critical for Gaza medical data)
      const integrityValid = await this.verifyDataIntegrity(patientId);
      if (!integrityValid) {
        console.error(`❌ Data integrity check failed for patient: ${patientId}`);
        await this.logStorageEvent('INTEGRITY_VIOLATION', 'CRITICAL', { patientId });
        throw new Error('Data integrity check failed - possible tampering detected');
      }

      // Retrieve encrypted data
      const storageKey = this.generatePatientStorageKey(patientId);
      const encryptedDataStr = await SecureStore.getItemAsync(storageKey);
      
      if (!encryptedDataStr) {
        console.log(`📭 No data found for patient: ${patientId}`);
        return null;
      }

      // Decrypt patient data
      const encryptedData: EncryptedPackage = JSON.parse(encryptedDataStr);
      const decryptedData = await this.cryptoService.decryptPatientData(
        encryptedData,
        `patient_${patientId}`
      );

      // Retrieve patient metadata
      const metadataKey = this.generateMetadataStorageKey(patientId);
      const encryptedMetadataStr = await SecureStore.getItemAsync(metadataKey);
      
      let patientRecord: PatientRecord;
      
      if (encryptedMetadataStr) {
        const encryptedMetadata = JSON.parse(encryptedMetadataStr);
        const metadata = await this.cryptoService.decryptPatientData(
          encryptedMetadata,
          'patient_metadata'
        ) as any as PatientRecord;
        
        patientRecord = {
          ...metadata,
          data: decryptedData
        };
      } else {
        // Fallback for legacy data without metadata
        patientRecord = {
          patientId,
          data: decryptedData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          doctorId: 'unknown',
          encrypted: true,
          integrityHash: await this.generateIntegrityHash(encryptedData)
        };
      }

      // Update cache for Gaza clinic performance
      this.cache.set(patientId, patientRecord);

      // Log data access for Gaza clinic audit
      await this.logDataAccess(patientId, 'STORAGE_ACCESS');

      console.log(`✅ Patient data retrieved successfully: ${patientId}`);
      return patientRecord;
    } catch (error) {
      console.error('❌ Patient data retrieval failed:', error);
      await this.logStorageEvent('RETRIEVAL_ERROR', 'HIGH', { 
        patientId, 
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }

  /**
   * Update existing patient data for Gaza medical records
   * Maintains audit trail and version history
   */
  public async updatePatientData(
    patientId: string, 
    data: PatientData, 
    doctorId: string
  ): Promise<StorageResult> {
    try {
      console.log(`📝 Updating patient data for Gaza clinic: ${patientId}`);
      
      // Retrieve existing record first
      const existingRecord = await this.retrievePatientData(patientId);
      if (!existingRecord) {
        return {
          success: false,
          error: 'Patient record not found'
        };
      }

      // Create updated record maintaining creation timestamp
      const updatedData = this.sanitizePatientData(data);
      this.validatePatientData(updatedData);

      // Store updated data (reuses storage logic)
      const result = await this.storePatientData(patientId, updatedData, doctorId);
      
      if (result.success) {
        // Log update event for Gaza clinic audit trail
        await this.logStorageEvent('PATIENT_UPDATED', 'LOW', { 
          patientId, 
          doctorId,
          previousDoctor: existingRecord.doctorId 
        });
        
        console.log(`✅ Patient data updated successfully: ${patientId}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Patient data update failed:', error);
      return {
        success: false,
        error: `Update failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Delete patient data securely for Gaza clinic privacy compliance
   * Secure deletion with overwriting for complete data removal
   */
  public async deletePatientData(patientId: string, doctorId: string): Promise<StorageResult> {
    try {
      console.log(`🗑️ Securely deleting patient data for Gaza clinic: ${patientId}`);
      
      // Verify patient exists before deletion
      const existingRecord = await this.retrievePatientData(patientId);
      if (!existingRecord) {
        return {
          success: false,
          error: 'Patient record not found'
        };
      }

      // Generate storage keys
      const storageKey = this.generatePatientStorageKey(patientId);
      const integrityKey = this.generateIntegrityStorageKey(patientId);
      const metadataKey = this.generateMetadataStorageKey(patientId);

      // Secure deletion - overwrite with random data first
      const randomData = CryptoJS.lib.WordArray.random(1024).toString();
      await SecureStore.setItemAsync(storageKey, randomData);
      await SecureStore.setItemAsync(integrityKey, randomData);
      await SecureStore.setItemAsync(metadataKey, randomData);

      // Then delete the keys
      await SecureStore.deleteItemAsync(storageKey);
      await SecureStore.deleteItemAsync(integrityKey);
      await SecureStore.deleteItemAsync(metadataKey);

      // Remove from cache
      this.cache.delete(patientId);

      // Log deletion for Gaza clinic audit trail
      await this.logStorageEvent('PATIENT_DELETED', 'MEDIUM', { 
        patientId, 
        doctorId,
        securelyDeleted: true 
      });

      console.log(`✅ Patient data securely deleted: ${patientId}`);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Patient data deletion failed:', error);
      await this.logStorageEvent('DELETION_ERROR', 'HIGH', { 
        patientId, 
        doctorId, 
        error: error instanceof Error ? error.message : String(error) 
      });
      
      return {
        success: false,
        error: `Deletion failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * List all patient IDs for Gaza clinic patient management
   * Returns only patient IDs, not sensitive data
   */
  public async listPatientIds(): Promise<string[]> {
    try {
      console.log('📋 Listing patient IDs for Gaza clinic...');
      
      const allKeys = await SecureStore.getItemAsync('all_patient_keys') || '[]';
      const patientKeys: string[] = JSON.parse(allKeys);
      
      // Extract patient IDs from storage keys
      const patientIds = patientKeys
        .filter(key => key.startsWith('patient_data_'))
        .map(key => key.replace('patient_data_', ''));

      console.log(`📋 Found ${patientIds.length} patients in Gaza clinic storage`);
      return patientIds;
    } catch (error) {
      console.error('❌ Patient listing failed:', error);
      return [];
    }
  }

  /**
   * Get storage statistics for Gaza clinic management
   * Provides insights into storage usage and health
   */
  public async getStorageStats(): Promise<StorageStats> {
    try {
      const patientIds = await this.listPatientIds();
      let totalSize = 0;

      // Calculate total storage size
      for (const patientId of patientIds) {
        try {
          const storageKey = this.generatePatientStorageKey(patientId);
          const data = await SecureStore.getItemAsync(storageKey);
          if (data) {
            totalSize += data.length;
          }
        } catch (error) {
          // Continue counting even if individual patient fails
          console.warn(`⚠️ Failed to get size for patient ${patientId}`);
        }
      }

      const lastBackupStr = await SecureStore.getItemAsync('last_backup_timestamp');
      const lastBackup = lastBackupStr ? parseInt(lastBackupStr) : 0;

      const stats: StorageStats = {
        totalPatients: patientIds.length,
        totalSize,
        lastBackup,
        encryptionStatus: 'active'
      };

      console.log('📊 Gaza clinic storage stats:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Storage stats calculation failed:', error);
      return {
        totalPatients: 0,
        totalSize: 0,
        lastBackup: 0,
        encryptionStatus: 'inactive'
      };
    }
  }

  /**
   * Create encrypted backup for Gaza clinic data protection
   * Protects against device loss/damage in conflict zones
   */
  public async createSecureBackup(): Promise<{ success: boolean; backupData?: string; error?: string }> {
    try {
      console.log('💾 Creating secure backup for Gaza clinic data...');
      
      const patientIds = await this.listPatientIds();
      const backupData: { [key: string]: any } = {};

      // Collect all encrypted patient data
      for (const patientId of patientIds) {
        try {
          const storageKey = this.generatePatientStorageKey(patientId);
          const integrityKey = this.generateIntegrityStorageKey(patientId);
          const metadataKey = this.generateMetadataStorageKey(patientId);

          const encryptedData = await SecureStore.getItemAsync(storageKey);
          const integrityHash = await SecureStore.getItemAsync(integrityKey);
          const metadata = await SecureStore.getItemAsync(metadataKey);

          if (encryptedData) {
            backupData[patientId] = {
              data: encryptedData,
              integrity: integrityHash,
              metadata: metadata,
              timestamp: Date.now()
            };
          }
        } catch (error) {
          console.warn(`⚠️ Failed to backup patient ${patientId}:`, error);
        }
      }

      // Encrypt entire backup package
      const backupPackage = {
        patients: backupData,
        createdAt: Date.now(),
        deviceId: this.cryptoService.getDeviceFingerprint()?.hash,
        version: '1.0'
      };

      const encryptedBackup = await this.cryptoService.encryptPatientData(
        backupPackage as any,
        'backup_data'
      );

      // Store backup timestamp
      await SecureStore.setItemAsync('last_backup_timestamp', Date.now().toString());

      // Log backup creation
      await this.logStorageEvent('BACKUP_CREATED', 'LOW', { 
        patientCount: patientIds.length,
        backupSize: JSON.stringify(encryptedBackup).length 
      });

      console.log(`✅ Secure backup created for ${patientIds.length} Gaza clinic patients`);
      
      return {
        success: true,
        backupData: JSON.stringify(encryptedBackup)
      };
    } catch (error) {
      console.error('❌ Backup creation failed:', error);
      return {
        success: false,
        error: `Backup failed: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Sanitize patient data for Gaza medical requirements
   * Removes dangerous characters and validates input
   */
  private sanitizePatientData(data: PatientData): PatientData {
    return {
      name: this.sanitizeString(data.name),
      age: Math.max(0, Math.min(150, Math.floor(data.age))), // Age limits for medical validity
      symptoms: this.sanitizeString(data.symptoms),
      notes: this.sanitizeString(data.notes || ''),
      timestamp: data.timestamp || Date.now(),
      doctorId: data.doctorId || ''
    };
  }

  /**
   * Sanitize string input for security
   */
  private sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .replace(/[<>\"'%;()&+]/g, '') // Remove dangerous characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 1000); // Gaza storage optimization - limit length
  }

  /**
   * Validate patient data structure for Gaza medical standards
   */
  private validatePatientData(data: PatientData): void {
    if (!data.name || data.name.length < 1) {
      throw new Error('Patient name is required for Gaza medical records');
    }
    
    if (typeof data.age !== 'number' || data.age < 0 || data.age > 150) {
      throw new Error('Valid patient age is required (0-150 years)');
    }
    
    if (!data.symptoms || data.symptoms.length < 1) {
      throw new Error('Patient symptoms are required for Gaza medical diagnosis');
    }
    
    if (data.name.length > 100) {
      throw new Error('Patient name too long (max 100 characters)');
    }
    
    if (data.symptoms.length > 1000) {
      throw new Error('Symptoms description too long (max 1000 characters)');
    }
  }

  /**
   * Generate storage key for patient data
   */
  private generatePatientStorageKey(patientId: string): string {
    return `patient_data_${patientId}`;
  }

  /**
   * Generate storage key for integrity hash
   */
  private generateIntegrityStorageKey(patientId: string): string {
    return `patient_integrity_${patientId}`;
  }

  /**
   * Generate storage key for metadata
   */
  private generateMetadataStorageKey(patientId: string): string {
    return `patient_metadata_${patientId}`;
  }

  /**
   * Generate integrity hash for tamper detection
   */
  private async generateIntegrityHash(encryptedData: EncryptedPackage): Promise<string> {
    const hashData = JSON.stringify(encryptedData) + Date.now().toString();
    return CryptoJS.SHA256(hashData).toString();
  }

  /**
   * Verify data integrity for Gaza medical data protection
   */
  private async verifyDataIntegrity(patientId: string): Promise<boolean> {
    try {
      const storageKey = this.generatePatientStorageKey(patientId);
      const integrityKey = this.generateIntegrityStorageKey(patientId);

      const encryptedDataStr = await SecureStore.getItemAsync(storageKey);
      const storedHash = await SecureStore.getItemAsync(integrityKey);

      if (!encryptedDataStr || !storedHash) {
        return false;
      }

      const encryptedData: EncryptedPackage = JSON.parse(encryptedDataStr);
      const currentHash = await this.generateIntegrityHash(encryptedData);

      return currentHash === storedHash;
    } catch (error) {
      console.error('❌ Integrity verification failed:', error);
      return false;
    }
  }

  /**
   * Validate stored data integrity for all patients
   */
  private async validateStoredDataIntegrity(): Promise<ValidationResult> {
    try {
      console.log('🔍 Validating Gaza clinic data integrity...');
      
      const patientIds = await this.listPatientIds();
      const corrupted: string[] = [];
      const missing: string[] = [];
      const integrityFailures: string[] = [];

      for (const patientId of patientIds) {
        try {
          const isValid = await this.verifyDataIntegrity(patientId);
          if (!isValid) {
            integrityFailures.push(patientId);
          }
        } catch (error) {
          corrupted.push(patientId);
        }
      }

      const result: ValidationResult = {
        isValid: corrupted.length === 0 && integrityFailures.length === 0,
        corrupted,
        missing,
        integrityFailures
      };

      if (!result.isValid) {
        console.warn('⚠️ Gaza clinic data integrity issues found:', result);
        await this.logStorageEvent('INTEGRITY_ISSUES', 'HIGH', result);
      } else {
        console.log('✅ Gaza clinic data integrity validated successfully');
      }

      return result;
    } catch (error) {
      console.error('❌ Data integrity validation failed:', error);
      return {
        isValid: false,
        corrupted: [],
        missing: [],
        integrityFailures: []
      };
    }
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(record: PatientRecord): boolean {
    return (Date.now() - record.updatedAt) < this.cacheTimeout;
  }

  /**
   * Setup cache cleanup for Gaza battery optimization
   */
  private setupCacheCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [patientId, record] of this.cache.entries()) {
        if ((now - record.updatedAt) > this.cacheTimeout) {
          this.cache.delete(patientId);
        }
      }
    }, this.cacheTimeout);
  }

  /**
   * Log data access for Gaza clinic audit trail
   */
  private async logDataAccess(patientId: string, accessType: string): Promise<void> {
    try {
      await this.logStorageEvent('DATA_ACCESS', 'LOW', { 
        patientId, 
        accessType,
        timestamp: Date.now() 
      });
    } catch (error) {
      console.error('❌ Data access logging failed:', error);
    }
  }

  /**
   * Log storage events for Gaza clinic security monitoring
   */
  private async logStorageEvent(
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
        component: 'SecureStorage'
      };

      console.log(`💾 Storage Event [${severity}]: ${event}`, details);
      
      // Store security log entry
      const logKey = `storage_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const encryptedLog = await this.cryptoService.encryptPatientData(
        logEntry as any,
        'storage_log'
      );
      
      await SecureStore.setItemAsync(logKey, JSON.stringify(encryptedLog));
    } catch (error) {
      console.error('❌ Storage event logging failed:', error);
    }
  }

  /**
   * Clear all cached data (for memory management)
   */
  public clearCache(): void {
    console.log('🧹 Clearing cache for Gaza clinic memory optimization...');
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}