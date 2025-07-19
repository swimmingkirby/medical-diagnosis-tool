// Security configuration constants
export const SECURITY_CONFIG = {
  // Encryption settings
  ENCRYPTION_ALGORITHM: 'AES-256-GCM',
  KEY_DERIVATION_ITERATIONS: 10000,
  SALT_LENGTH: 32,
  
  // Authentication settings
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_PIN_ATTEMPTS: 5,
  PIN_LENGTH: 4,
  
  // Storage keys
  STORAGE_KEYS: {
    USER_PIN_HASH: 'user_pin_hash',
    DEVICE_FINGERPRINT: 'device_fingerprint',
    ACTIVE_SESSION: 'active_session',
    DOCTOR_DATA: 'doctor_data_',
  },
  
  // Security events
  SECURITY_EVENTS: {
    LOGIN_SUCCESS: 'login_success',
    LOGIN_FAILED: 'login_failed',
    DATA_ENCRYPTED: 'data_encrypted',
    DATA_DECRYPTED: 'data_decrypted',
    UNAUTHORIZED_ACCESS: 'unauthorized_access',
  },
  
  // Gaza-specific settings
  GAZA_CONFIG: {
    OFFLINE_MODE: true,
    BATTERY_OPTIMIZATION: true,
    ARABIC_SUPPORT: true,
  }
};

// Patient data structure template
export const PATIENT_DATA_SCHEMA = {
  name: '',
  age: 0,
  symptoms: '',
  notes: '',
  timestamp: null,
  doctorId: '',
  encrypted: true
};