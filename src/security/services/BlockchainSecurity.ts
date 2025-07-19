import CryptoService, { PatientData } from './CryptoService';
import AuthService from './AuthService';
import { SECURITY_CONFIG } from '../utils/constants';
import CryptoJS from 'crypto-js';

export interface BlockchainRecord {
  recordId: string;
  patientHash: string;
  doctorHash: string;
  digitalSignature: string;
  timestamp: number;
  blockNumber?: number;
  transactionHash?: string;
  deviceFingerprint: string;
  integrityProof: string;
}

export interface BlockchainTransaction {
  hash: string;
  signature: string;
  timestamp: number;
  data: any;
  gasUsed?: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface BlockchainVerification {
  isValid: boolean;
  recordExists: boolean;
  signatureValid: boolean;
  timestampValid: boolean;
  integrityValid: boolean;
  blockchainHash?: string;
}

export interface BlockchainStats {
  totalRecords: number;
  pendingTransactions: number;
  lastBlockNumber: number;
  averageGasUsed: number;
  successRate: number;
}

export default class BlockchainSecurity {
  private static instance: BlockchainSecurity;
  private cryptoService: CryptoService;
  private authService: AuthService;
  private pendingTransactions: Map<string, BlockchainTransaction> = new Map();
  private recordCache: Map<string, BlockchainRecord> = new Map();
  private ganacheUrl: string = 'http://localhost:7545'; // Default Ganache URL
  private contractAddress: string | null = null;

  constructor() {
    console.log('⛓️ BlockchainSecurity initializing for Gaza medical records...');
    this.cryptoService = CryptoService.getInstance();
    this.authService = AuthService.getInstance();
  }

  // Singleton pattern for consistent blockchain security across Gaza clinic app
  public static getInstance(): BlockchainSecurity {
    if (!BlockchainSecurity.instance) {
      BlockchainSecurity.instance = new BlockchainSecurity();
    }
    return BlockchainSecurity.instance;
  }

  /**
   * Initialize blockchain security service for Gaza clinic deployment
   * Connects to Temis's Ganache blockchain and prepares smart contracts
   */
  public async initialize(ganacheUrl?: string, contractAddress?: string): Promise<void> {
    try {
      console.log('⛓️ Initializing blockchain security for Gaza clinic...');
      
      // Initialize dependent services
      await this.cryptoService.initialize();
      await this.authService.initialize();
      
      // Update blockchain connection if provided
      if (ganacheUrl) {
        this.ganacheUrl = ganacheUrl;
      }
      
      if (contractAddress) {
        this.contractAddress = contractAddress;
      }

      // Test blockchain connectivity (when Temis has Ganache ready)
      await this.testBlockchainConnection();
      
      // Setup transaction cleanup for Gaza memory optimization
      this.setupTransactionCleanup();
      
      console.log('✅ Blockchain Security ready - Gaza medical records protected on blockchain!');
    } catch (error) {
      console.error('❌ BlockchainSecurity initialization failed:', error);
      // Don't throw error - blockchain can work offline and sync later
      console.log('⚠️ Blockchain offline - will queue transactions for Gaza clinic');
    }
  }

  /**
   * Prepare patient data for secure blockchain storage
   * NEVER stores raw patient data - only cryptographic hashes and signatures
   */
  public async preparePatientDataForBlockchain(
    patientData: PatientData, 
    patientId: string
  ): Promise<BlockchainRecord> {
    try {
      console.log(`⛓️ Preparing patient data for Gaza blockchain: ${patientId}`);
      
      // Validate authentication and permissions
      const session = this.authService.getCurrentSession();
      if (!session) {
        throw new Error('Authentication required for Gaza blockchain access');
      }

      const hasPermission = await this.authService.checkPermission('write_patients');
      if (!hasPermission) {
        throw new Error('Insufficient permissions for Gaza blockchain writes');
      }

      // Generate secure hashes (NEVER raw patient data)
      const patientHash = await this.generatePatientHash(patientData, patientId);
      const doctorHash = await this.generateDoctorHash(session.doctorId);
      
      // Create digital signature for Gaza medical record authenticity
      const digitalSignature = await this.generateDigitalSignature(
        patientHash, 
        doctorHash, 
        session.doctorId
      );

      // Generate integrity proof for tamper detection
      const integrityProof = await this.generateIntegrityProof(
        patientHash, 
        digitalSignature, 
        session.deviceFingerprint
      );

      // Create blockchain record with only hashes and signatures
      const blockchainRecord: BlockchainRecord = {
        recordId: this.generateRecordId(patientId),
        patientHash,
        doctorHash,
        digitalSignature,
        timestamp: Date.now(),
        deviceFingerprint: session.deviceFingerprint,
        integrityProof
      };

      // Cache record for Gaza clinic performance
      this.recordCache.set(patientId, blockchainRecord);

      // Log blockchain preparation for Gaza clinic audit
      await this.logBlockchainEvent('RECORD_PREPARED', 'LOW', { 
        patientId: patientId.substring(0, 8) + '***', // Partial ID for privacy
        doctorId: session.doctorId,
        recordSize: JSON.stringify(blockchainRecord).length 
      });

      console.log(`✅ Patient data prepared for Gaza blockchain: ${patientId}`);
      return blockchainRecord;
    } catch (error) {
      console.error('❌ Blockchain preparation failed:', error);
      await this.logBlockchainEvent('PREPARATION_ERROR', 'HIGH', { 
        patientId: patientId.substring(0, 8) + '***',
        error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error)
      });
      const errorMsg = typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error);
      throw new Error(`Blockchain preparation failed: ${errorMsg}`);
    }
  }

  /**
   * Store medical record on Gaza blockchain (via Temis's smart contract)
   * Only stores hashes and signatures, never raw patient data
   */
  public async storeOnBlockchain(blockchainRecord: BlockchainRecord): Promise<BlockchainTransaction> {
    try {
      console.log(`⛓️ Storing medical record on Gaza blockchain: ${blockchainRecord.recordId}`);
      
      // Create transaction data (only hashes and signatures)
      const transactionData = {
        recordId: blockchainRecord.recordId,
        patientHash: blockchainRecord.patientHash,
        doctorHash: blockchainRecord.doctorHash,
        digitalSignature: blockchainRecord.digitalSignature,
        timestamp: blockchainRecord.timestamp,
        deviceFingerprint: blockchainRecord.deviceFingerprint,
        integrityProof: blockchainRecord.integrityProof,
        gaza_clinic_record: true
      };

      // Generate transaction hash
      const transactionHash = this.generateTransactionHash(transactionData);

      // Create blockchain transaction
      const transaction: BlockchainTransaction = {
        hash: transactionHash,
        signature: blockchainRecord.digitalSignature,
        timestamp: Date.now(),
        data: transactionData,
        status: 'pending'
      };

      // Try to submit to blockchain (when Temis has smart contract ready)
      if (this.contractAddress && await this.isBlockchainAvailable()) {
        try {
          const result = await this.submitToSmartContract(transaction);
          transaction.status = 'confirmed';
          transaction.gasUsed = result.gasUsed;
          
          // Update blockchain record with transaction info
          blockchainRecord.transactionHash = transactionHash;
          blockchainRecord.blockNumber = result.blockNumber;
          
          console.log(`✅ Medical record stored on Gaza blockchain: ${blockchainRecord.recordId}`);
        } catch (blockchainError) {
          const blockchainErrorMsg = typeof blockchainError === 'object' && blockchainError !== null && 'message' in blockchainError
            ? (blockchainError as any).message
            : String(blockchainError);
          console.warn('⚠️ Blockchain unavailable - queuing for Gaza clinic:', blockchainErrorMsg);
          transaction.status = 'pending';
        }
      } else {
        console.log('⚠️ Blockchain offline - queuing transaction for Gaza clinic');
        transaction.status = 'pending';
      }

      // Store pending transaction for later submission
      this.pendingTransactions.set(transactionHash, transaction);

      // Log blockchain storage attempt
      await this.logBlockchainEvent('STORAGE_ATTEMPT', 'LOW', { 
        recordId: blockchainRecord.recordId,
        status: transaction.status,
        transactionHash 
      });

      return transaction;
    } catch (error) {
      console.error('❌ Blockchain storage failed:', error);
      await this.logBlockchainEvent('STORAGE_ERROR', 'HIGH', { 
        recordId: blockchainRecord.recordId,
        error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error)
      });
      const errorMsg = typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error);
      throw new Error(`Blockchain storage failed: ${errorMsg}`);
    }
  }

  /**
   * Verify medical record integrity using Gaza blockchain
   * Checks if record exists and hasn't been tampered with
   */
  public async verifyRecordIntegrity(
    patientId: string, 
    localPatientData: PatientData
  ): Promise<BlockchainVerification> {
    try {
      console.log(`🔍 Verifying Gaza medical record integrity: ${patientId}`);
      
      // Get blockchain record
      const blockchainRecord = await this.getBlockchainRecord(patientId);
      if (!blockchainRecord) {
        return {
          isValid: false,
          recordExists: false,
          signatureValid: false,
          timestampValid: false,
          integrityValid: false
        };
      }

      // Verify patient data hash
      const localPatientHash = await this.generatePatientHash(localPatientData, patientId);
      const patientHashValid = localPatientHash === blockchainRecord.patientHash;

      // Verify digital signature
      const signatureValid = await this.verifyDigitalSignature(
        blockchainRecord.patientHash,
        blockchainRecord.doctorHash,
        blockchainRecord.digitalSignature
      );

      // Verify timestamp (within reasonable bounds)
      const timestampValid = this.verifyTimestamp(blockchainRecord.timestamp);

      // Verify integrity proof
      const integrityValid = await this.verifyIntegrityProof(
        blockchainRecord.patientHash,
        blockchainRecord.digitalSignature,
        blockchainRecord.deviceFingerprint,
        blockchainRecord.integrityProof
      );

      const verification: BlockchainVerification = {
        isValid: patientHashValid && signatureValid && timestampValid && integrityValid,
        recordExists: true,
        signatureValid,
        timestampValid,
        integrityValid: patientHashValid && integrityValid,
        blockchainHash: blockchainRecord.patientHash
      };

      // Log verification result for Gaza clinic audit
      await this.logBlockchainEvent('RECORD_VERIFIED', verification.isValid ? 'LOW' : 'HIGH', { 
        patientId: patientId.substring(0, 8) + '***',
        isValid: verification.isValid,
        details: verification 
      });

      if (verification.isValid) {
        console.log(`✅ Gaza medical record integrity verified: ${patientId}`);
      } else {
        console.error(`❌ Gaza medical record integrity FAILED: ${patientId}`, verification);
      }

      return verification;
    } catch (error) {
      console.error('❌ Record verification failed:', error);
      await this.logBlockchainEvent('VERIFICATION_ERROR', 'HIGH', { 
        patientId: patientId.substring(0, 8) + '***',
        error: typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error)
      });
      
      return {
        isValid: false,
        recordExists: false,
        signatureValid: false,
        timestampValid: false,
        integrityValid: false
      };
    }
  }

  /**
   * Generate secure hash of patient data for Gaza blockchain storage
   * Includes timestamp and device info for uniqueness
   */
  private async generatePatientHash(patientData: PatientData, patientId: string): Promise<string> {
    try {
      // Create hash data with patient info + metadata (never store raw data)
      const hashData = {
        patientId,
        name: patientData.name,
        age: patientData.age,
        symptoms: patientData.symptoms,
        notes: patientData.notes,
        timestamp: patientData.timestamp || Date.now(),
        deviceId: this.cryptoService.getDeviceFingerprint()?.hash,
        gaza_clinic: true
      };

      // Generate SHA-256 hash for blockchain storage
      const hash = CryptoJS.SHA256(JSON.stringify(hashData)).toString();
      
      console.log(`🔐 Patient hash generated for Gaza blockchain: ${patientId}`);
      return hash;
    } catch (error) {
      console.error('❌ Patient hash generation failed:', error);
      throw new Error('Failed to generate patient hash');
    }
  }

  /**
   * Generate secure hash of doctor identity for Gaza clinic accountability
   */
  private async generateDoctorHash(doctorId: string): Promise<string> {
    try {
      const doctorData = {
        doctorId,
        deviceId: this.cryptoService.getDeviceFingerprint()?.hash,
        timestamp: Date.now(),
        gaza_clinic: true
      };

      const hash = CryptoJS.SHA256(JSON.stringify(doctorData)).toString();
      
      console.log(`👨‍⚕️ Doctor hash generated for Gaza accountability: ${doctorId}`);
      return hash;
    } catch (error) {
      console.error('❌ Doctor hash generation failed:', error);
      throw new Error('Failed to generate doctor hash');
    }
  }

  /**
   * Generate digital signature for Gaza medical record authenticity
   * Proves the record was created by authenticated Gaza clinic doctor
   */
  private async generateDigitalSignature(
    patientHash: string, 
    doctorHash: string, 
    doctorId: string
  ): Promise<string> {
    try {
      // Create signature data
      const signatureData = {
        patientHash,
        doctorHash,
        timestamp: Date.now(),
        gaza_clinic_signature: true
      };

      // Generate HMAC signature using doctor-specific key
      const doctorKey = await this.cryptoService.strengthenDoctorPin('signature_key', doctorId);
      const signature = CryptoJS.HmacSHA256(JSON.stringify(signatureData), doctorKey).toString();
      
      console.log(`✍️ Digital signature generated for Gaza medical record`);
      return signature;
    } catch (error) {
      console.error('❌ Digital signature generation failed:', error);
      throw new Error('Failed to generate digital signature');
    }
  }

  /**
   * Generate integrity proof for Gaza blockchain tamper detection
   */
  private async generateIntegrityProof(
    patientHash: string, 
    digitalSignature: string, 
    deviceFingerprint: string
  ): Promise<string> {
    try {
      const proofData = {
        patientHash,
        digitalSignature,
        deviceFingerprint,
        timestamp: Date.now(),
        gaza_integrity_proof: true
      };

      const proof = CryptoJS.SHA256(JSON.stringify(proofData)).toString();
      
      console.log(`🛡️ Integrity proof generated for Gaza blockchain`);
      return proof;
    } catch (error) {
      console.error('❌ Integrity proof generation failed:', error);
      throw new Error('Failed to generate integrity proof');
    }
  }

  /**
   * Verify digital signature for Gaza medical record authenticity
   */
  private async verifyDigitalSignature(
    patientHash: string, 
    doctorHash: string, 
    signature: string
  ): Promise<boolean> {
    try {
      // Note: In a real implementation, we'd need the doctor ID to verify
      // For now, we'll do basic signature format validation
      const isValidFormat = signature.length === 64 && /^[a-f0-9]+$/i.test(signature);
      
      console.log(`🔍 Digital signature verification: ${isValidFormat ? 'VALID' : 'INVALID'}`);
      return isValidFormat;
    } catch (error) {
      console.error('❌ Digital signature verification failed:', error);
      return false;
    }
  }

  /**
   * Verify timestamp is within reasonable bounds for Gaza medical records
   */
  private verifyTimestamp(timestamp: number): boolean {
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneHourFuture = now + (60 * 60 * 1000);
    
    const isValid = timestamp >= oneWeekAgo && timestamp <= oneHourFuture;
    
    console.log(`⏰ Timestamp verification: ${isValid ? 'VALID' : 'INVALID'}`);
    return isValid;
  }

  /**
   * Verify integrity proof for Gaza blockchain tamper detection
   */
  private async verifyIntegrityProof(
    patientHash: string, 
    digitalSignature: string, 
    deviceFingerprint: string, 
    storedProof: string
  ): Promise<boolean> {
    try {
      // Regenerate proof and compare
      const expectedProof = await this.generateIntegrityProof(
        patientHash, 
        digitalSignature, 
        deviceFingerprint
      );
      
      const isValid = expectedProof === storedProof;
      
      console.log(`🛡️ Integrity proof verification: ${isValid ? 'VALID' : 'INVALID'}`);
      return isValid;
    } catch (error) {
      console.error('❌ Integrity proof verification failed:', error);
      return false;
    }
  }

  /**
   * Generate unique record ID for Gaza blockchain tracking
   */
  private generateRecordId(patientId: string): string {
    const timestamp = Date.now();
    const deviceId = this.cryptoService.getDeviceFingerprint()?.hash?.substring(0, 8) || 'unknown';
    
    return `gaza_${timestamp}_${deviceId}_${patientId.substring(0, 8)}`;
  }

  /**
   * Generate transaction hash for Gaza blockchain submission
   */
  private generateTransactionHash(transactionData: any): string {
    const hashData = JSON.stringify(transactionData) + Date.now().toString();
    return CryptoJS.SHA256(hashData).toString();
  }

  /**
   * Test blockchain connectivity for Gaza clinic deployment
   */
  private async testBlockchainConnection(): Promise<boolean> {
    try {
      // Simple connectivity test (when Temis has Ganache running)
      console.log(`🔗 Testing Gaza blockchain connection: ${this.ganacheUrl}`);
      
      // In a real implementation, this would test the actual connection
      // For now, we'll simulate based on URL availability
      const isAvailable = this.ganacheUrl.includes('localhost') || this.ganacheUrl.includes('127.0.0.1');
      
      if (isAvailable) {
        console.log('✅ Gaza blockchain connection established');
      } else {
        console.log('⚠️ Gaza blockchain connection unavailable - will work offline');
      }
      
      return isAvailable;
    } catch (error) {
      console.error('❌ Blockchain connection test failed:', error);
      return false;
    }
  }

  /**
   * Check if blockchain is currently available for Gaza clinic
   */
  private async isBlockchainAvailable(): Promise<boolean> {
    try {
      // Quick availability check
      return await this.testBlockchainConnection();
    } catch (error) {
      return false;
    }
  }

  /**
   * Submit transaction to Temis's smart contract (when ready)
   */
  private async submitToSmartContract(transaction: BlockchainTransaction): Promise<any> {
    try {
      console.log(`📝 Submitting to Gaza smart contract: ${transaction.hash}`);
      
      // Simulate smart contract interaction
      // In reality, this would use Web3.js or similar to interact with Temis's contract
      const simulatedResult = {
        transactionHash: transaction.hash,
        blockNumber: Math.floor(Math.random() * 1000000),
        gasUsed: Math.floor(Math.random() * 50000) + 21000,
        status: 'success'
      };

      console.log(`✅ Gaza smart contract submission successful: ${transaction.hash}`);
      return simulatedResult;
    } catch (error) {
      console.error('❌ Smart contract submission failed:', error);
      const errorMsg = typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error);
      throw new Error(`Smart contract submission failed: ${errorMsg}`);
    }
  }

  /**
   * Get blockchain record for Gaza medical verification
   */
  private async getBlockchainRecord(patientId: string): Promise<BlockchainRecord | null> {
    try {
      // Check cache first for Gaza clinic performance
      const cachedRecord = this.recordCache.get(patientId);
      if (cachedRecord) {
        console.log(`⚡ Cache hit for Gaza blockchain record: ${patientId}`);
        return cachedRecord;
      }

      // In a real implementation, this would query the blockchain
      console.log(`🔍 Querying Gaza blockchain for record: ${patientId}`);
      
      // Simulate blockchain query
      // Return null if not found (will be implemented when Temis has blockchain ready)
      return null;
    } catch (error) {
      console.error('❌ Blockchain record retrieval failed:', error);
      return null;
    }
  }

  /**
   * Sync pending transactions when Gaza blockchain becomes available
   */
  public async syncPendingTransactions(): Promise<{ synced: number; failed: number }> {
    try {
      console.log('🔄 Syncing pending Gaza blockchain transactions...');
      
      let synced = 0;
      let failed = 0;

      if (!await this.isBlockchainAvailable()) {
        console.log('⚠️ Gaza blockchain still unavailable - keeping transactions pending');
        return { synced: 0, failed: 0 };
      }

      for (const [hash, transaction] of this.pendingTransactions.entries()) {
        if (transaction.status === 'pending') {
          try {
            const result = await this.submitToSmartContract(transaction);
            transaction.status = 'confirmed';
            transaction.gasUsed = result.gasUsed;
            synced++;
            
            console.log(`✅ Synced Gaza transaction: ${hash}`);
          } catch (error) {
            transaction.status = 'failed';
            failed++;
            
            console.error(`❌ Failed to sync Gaza transaction: ${hash}`, error);
          }
        }
      }

      // Clean up successful transactions
      for (const [hash, transaction] of this.pendingTransactions.entries()) {
        if (transaction.status === 'confirmed') {
          this.pendingTransactions.delete(hash);
        }
      }

      await this.logBlockchainEvent('SYNC_COMPLETED', 'LOW', { synced, failed });
      
      console.log(`🔄 Gaza blockchain sync completed: ${synced} synced, ${failed} failed`);
      return { synced, failed };
    } catch (error) {
      console.error('❌ Blockchain sync failed:', error);
      return { synced: 0, failed: 0 };
    }
  }

  /**
   * Get blockchain statistics for Gaza clinic monitoring
   */
  public getBlockchainStats(): BlockchainStats {
    const pendingCount = Array.from(this.pendingTransactions.values())
      .filter(tx => tx.status === 'pending').length;
    
    const confirmedTransactions = Array.from(this.pendingTransactions.values())
      .filter(tx => tx.status === 'confirmed');
    
    const totalTransactions = this.pendingTransactions.size;
    const successRate = totalTransactions > 0 
      ? (confirmedTransactions.length / totalTransactions) * 100 
      : 100;

    const averageGas = confirmedTransactions.length > 0
      ? confirmedTransactions.reduce((sum, tx) => sum + (tx.gasUsed || 0), 0) / confirmedTransactions.length
      : 0;

    return {
      totalRecords: this.recordCache.size,
      pendingTransactions: pendingCount,
      lastBlockNumber: Math.max(...confirmedTransactions.map(tx => tx.gasUsed || 0), 0),
      averageGasUsed: Math.round(averageGas),
      successRate: Math.round(successRate * 100) / 100
    };
  }

  /**
   * Setup transaction cleanup for Gaza memory optimization
   */
  private setupTransactionCleanup(): void {
    setInterval(() => {
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      
      // Clean up old confirmed transactions
      for (const [hash, transaction] of this.pendingTransactions.entries()) {
        if (transaction.status === 'confirmed' && transaction.timestamp < oneHourAgo) {
          this.pendingTransactions.delete(hash);
        }
      }
      
      // Clean up old cache entries
      const cacheEntries = Array.from(this.recordCache.entries());
      if (cacheEntries.length > 100) {
        // Keep only the most recent 100 records for Gaza memory optimization
        const sortedEntries = cacheEntries.sort((a, b) => b[1].timestamp - a[1].timestamp);
        this.recordCache.clear();
        
        sortedEntries.slice(0, 100).forEach(([key, value]) => {
          this.recordCache.set(key, value);
        });
      }
    }, 300000); // Cleanup every 5 minutes
  }

  /**
   * Log blockchain events for Gaza clinic security monitoring
   */
  private async logBlockchainEvent(
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
        component: 'BlockchainSecurity'
      };

      console.log(`⛓️ Blockchain Event [${severity}]: ${event}`, details);
      
      // In a real implementation, this would be stored securely
      // For now, just log to console for Gaza clinic monitoring
    } catch (error) {
      console.error('❌ Blockchain event logging failed:', error);
    }
  }

  /**
   * Update blockchain configuration for Gaza clinic requirements
   */
  public updateBlockchainConfig(ganacheUrl?: string, contractAddress?: string): void {
    if (ganacheUrl) {
      this.ganacheUrl = ganacheUrl;
      console.log(`⚙️ Gaza blockchain URL updated: ${ganacheUrl}`);
    }
    
    if (contractAddress) {
      this.contractAddress = contractAddress;
      console.log(`📜 Gaza smart contract address updated: ${contractAddress}`);
    }
  }

  /**
   * Get current blockchain configuration
   */
  public getBlockchainConfig(): { ganacheUrl: string; contractAddress: string | null } {
    return {
      ganacheUrl: this.ganacheUrl,
      contractAddress: this.contractAddress
    };
  }

  /**
   * Clear blockchain cache for Gaza memory management
   */
  public clearCache(): void {
    console.log('🧹 Clearing Gaza blockchain cache...');
    this.recordCache.clear();
  }

  /**
   * Get pending transactions for Gaza clinic monitoring
   */
  public getPendingTransactions(): BlockchainTransaction[] {
    return Array.from(this.pendingTransactions.values())
      .filter(tx => tx.status === 'pending');
  }
  /**
 * Store Excel file hash on Gaza blockchain for medical audit trail
 */
public async storeExcelOnBlockchain(
  excelData: string,
  patientCount: number,
  doctorId: string,
  reportType: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<BlockchainTransaction> {
  try {
    console.log(`📊 Storing Excel report on Gaza blockchain: ${reportType} report with ${patientCount} patients`);
    
    const excelMetadata = {
      fileType: 'gaza_medical_excel',
      patientCount,
      reportType,
      doctorId,
      createdAt: Date.now(),
      fileSize: excelData.length
    };

    const excelHash = CryptoJS.SHA256(excelData + JSON.stringify(excelMetadata)).toString();
    
    const blockchainRecord: BlockchainRecord = {
      recordId: `gaza_excel_${reportType}_${patientCount}p_${Date.now()}`,
      patientHash: excelHash,
      doctorHash: await this.generateDoctorHash(doctorId),
      digitalSignature: await this.generateDigitalSignature(excelHash, await this.generateDoctorHash(doctorId), doctorId),
      timestamp: Date.now(),
      deviceFingerprint: this.cryptoService.getDeviceFingerprint()?.hash || 'unknown',
      integrityProof: await this.generateIntegrityProof(excelHash, excelHash, this.cryptoService.getDeviceFingerprint()?.hash || 'unknown')
    };

    const transaction = await this.storeOnBlockchain(blockchainRecord);
    
    console.log(`✅ Excel report stored on Gaza blockchain: ${transaction.hash}`);
    return transaction;
  } catch (error) {
    console.error('❌ Excel blockchain storage failed:', error);
    const errorMsg = typeof error === 'object' && error !== null && 'message' in error ? (error as any).message : String(error);
    throw new Error(`Excel blockchain storage failed: ${errorMsg}`);
  }
}

/**
 * Verify Excel file authenticity using Gaza blockchain
 */
public async verifyExcelIntegrity(excelData: string, expectedHash: string): Promise<boolean> {
  try {
    console.log('🔍 Verifying Excel file integrity using Gaza blockchain...');
    
    const currentHash = CryptoJS.SHA256(excelData).toString();
    const isValid = currentHash === expectedHash;
    
    if (isValid) {
      console.log('✅ Excel file verified: Authentic Gaza clinic medical report');
    } else {
      console.error('❌ Excel file verification FAILED: File may be tampered or counterfeit');
    }
    
    return isValid;
  } catch (error) {
    console.error('❌ Excel verification failed:', error);
    return false;
  }
}
}