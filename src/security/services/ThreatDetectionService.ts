import CryptoService from './CryptoService';
import AuthService from './AuthService';

export interface ThreatEvent {
  id: string;
  type: 'BRUTE_FORCE' | 'DEVICE_COMPROMISE' | 'ANOMALOUS_ACCESS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: number;
  details: any;
  resolved: boolean;
}

export default class ThreatDetectionService {
  private static instance: ThreatDetectionService;
  private cryptoService: CryptoService;
  private authService: AuthService;
  private threatEvents: ThreatEvent[] = [];
  private failedAttempts: Map<string, number[]> = new Map();

  constructor() {
    console.log('🛡️ ThreatDetectionService initializing for Gaza clinic protection...');
    this.cryptoService = CryptoService.getInstance();
    this.authService = AuthService.getInstance();
  }

  public static getInstance(): ThreatDetectionService {
    if (!ThreatDetectionService.instance) {
      ThreatDetectionService.instance = new ThreatDetectionService();
    }
    return ThreatDetectionService.instance;
  }

  public async detectBruteForceAttack(doctorId: string, deviceFingerprint: string): Promise<boolean> {
    try {
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);
      
      const attemptKey = `${doctorId}_${deviceFingerprint}`;
      const attempts = this.failedAttempts.get(attemptKey) || [];
      
      attempts.push(now);
      const recentAttempts = attempts.filter(timestamp => timestamp > oneHourAgo);
      this.failedAttempts.set(attemptKey, recentAttempts);
      
      if (recentAttempts.length >= 10) {
        await this.createThreatEvent('BRUTE_FORCE', 'HIGH', {
          doctorId,
          deviceFingerprint,
          attemptCount: recentAttempts.length
        });
        
        console.log(`🚨 Brute force attack detected: ${doctorId}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Brute force detection failed:', error);
      return false;
    }
  }

  private async createThreatEvent(
    type: ThreatEvent['type'],
    severity: ThreatEvent['severity'],
    details: any
  ): Promise<void> {
    try {
      const threatEvent: ThreatEvent = {
        id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        severity,
        timestamp: Date.now(),
        details,
        resolved: false
      };
      
      this.threatEvents.push(threatEvent);
      console.log(`🚨 Threat Event Created [${severity}]: ${type}`, details);
    } catch (error) {
      console.error('❌ Threat event creation failed:', error);
    }
  }

  public getSecurityMetrics() {
    const criticalThreats = this.threatEvents.filter(t => t.severity === 'CRITICAL' && !t.resolved);
    
    return {
      totalThreats: this.threatEvents.length,
      activeCriticalThreats: criticalThreats.length,
      overallSecurityScore: Math.max(0, 100 - (criticalThreats.length * 20))
    };
  }
}

export default ThreatDetectionService;