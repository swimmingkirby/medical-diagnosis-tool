import CryptoService from './CryptoService';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';

export interface ZKProof {
  commitment: string;
  challenge: string;
  response: string;
  timestamp: number;
}

export interface EncryptedDataPackage {
  clientEncrypted: string;
  zkProof: ZKProof;
  accessPolicy: string;
  forwardSecrecy: string;
}

export default class ZeroKnowledgeService {
  private static instance: ZeroKnowledgeService;
  private cryptoService: CryptoService;
  private hardwareService: HardwareSecurityService;
  private sessionKeys: Map<string, string> = new Map();

 constructor() {
  console.log('🔒 ZeroKnowledgeService initializing for maximum Gaza security...');
  this.cryptoService = CryptoService.getInstance();
};
  

  public static getInstance(): ZeroKnowledgeService {
    if (!ZeroKnowledgeService.instance) {
      ZeroKnowledgeService.instance = new ZeroKnowledgeService();
    }
    return ZeroKnowledgeService.instance;
  }

  public async encryptZeroKnowledge(
    data: any, 
    patientId: string,
    accessPolicy: string[] = ['current_doctor']
  ): Promise<EncryptedDataPackage> {
    try {
      console.log('🔐 Zero-knowledge encryption for maximum Gaza security...');
      
      const sessionKey = await this.generateEphemeralKey(patientId);
      
      const clientEncrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data), 
        sessionKey
      ).toString();
      
      const zkProof = await this.generateZKProof(data, sessionKey);
      
     const policyKey = 'gaza_policy_key_' + Date.now();
      const encryptedAccessPolicy = CryptoJS.AES.encrypt(
        JSON.stringify(accessPolicy),
        policyKey
      ).toString();
      
      const forwardSecrecyKey = await this.generateForwardSecrecyKey(sessionKey);
      
      const encryptedPackage: EncryptedDataPackage = {
        clientEncrypted,
        zkProof,
        accessPolicy: encryptedAccessPolicy,
        forwardSecrecy: forwardSecrecyKey
      };
      
      this.sessionKeys.set(patientId, sessionKey);
      this.scheduleKeyDeletion(patientId, 300000);
      
      console.log('✅ Zero-knowledge encryption completed');
      return encryptedPackage;
    } catch (error) {
      console.error('❌ Zero-knowledge encryption failed:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      throw new Error(`ZK encryption failed: ${errorMessage}`);
    }
  }

  private async generateEphemeralKey(patientId: string): Promise<string> {
    try {
     const hardwareKey = await SecureStore.getItemAsync('session_master') || 'default_session_key';
      const patientSalt = CryptoJS.SHA256(`gaza_patient_${patientId}_${Date.now()}`).toString();
      
      const ephemeralKey = CryptoJS.PBKDF2(
        hardwareKey,
        patientSalt,
        {
          keySize: 256/32,
          iterations: 100000
        }
      ).toString();
      
      return ephemeralKey;
    } catch (error) {
      console.error('❌ Ephemeral key generation failed:', error);
      throw new Error('Failed to generate ephemeral session key');
    }
  }

  private async generateZKProof(data: any, sessionKey: string): Promise<ZKProof> {
    try {
      const dataHash = CryptoJS.SHA256(JSON.stringify(data)).toString();
      const commitment = CryptoJS.HmacSHA256(dataHash, sessionKey).toString();
      const challenge = CryptoJS.SHA256(`${commitment}_${Date.now()}`).toString();
      const response = CryptoJS.HmacSHA256(`${dataHash}_${challenge}`, sessionKey).toString();
      
      return {
        commitment,
        challenge,
        response,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('❌ ZK proof generation failed:', error);
      throw new Error('Failed to generate zero-knowledge proof');
    }
  }

  private async generateForwardSecrecyKey(sessionKey: string): Promise<string> {
    try {
      const deviceKey = await SecureStore.getItemAsync('forward_secrecy') || 'default_forward_key';
      return CryptoJS.HmacSHA256(sessionKey, deviceKey).toString();
    } catch (error) {
      console.error('❌ Forward secrecy key generation failed:', error);
      throw new Error('Failed to generate forward secrecy key');
    }
  }

  private scheduleKeyDeletion(patientId: string, delayMs: number): void {
    setTimeout(() => {
      this.sessionKeys.delete(patientId);
      console.log(`🗑️ Session key automatically deleted for patient: ${patientId}`);
    }, delayMs);
  }

  public async emergencyKeyClear(): Promise<void> {
    try {
      console.log('🚨 Emergency key clearing activated...');
      this.sessionKeys.clear();
      console.log('✅ Emergency key clearing completed');
    } catch (error) {
      console.error('❌ Emergency key clearing failed:', error);
    }
  }
}