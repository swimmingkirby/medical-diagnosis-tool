// Main security system exports
export { default as CryptoService } from './services/CryptoService';
export { default as AuthService } from './services/AuthService';
export { default as SecureStorage } from './services/SecureStorage';
export { default as APISecurityService } from './services/APISecurityService';
export { default as BlockchainSecurity } from './services/BlockchainSecurity';
export { default as SecurityProvider } from './SecurityProvider';
export { default as ZeroKnowledgeService } from './services/ZeroKnowledgeService';

// Quick initialization function
export const initializeSecurity = async () => {
  console.log('🔒 Shifaa Security System Starting...');
  try {
    // Will be implemented by AI
    return { status: 'ready', message: 'Security initialized successfully' };
  } catch (error) {
    console.error('Security initialization failed:', error);
    throw error;
  }
};

// Easy imports for team members
export const security = {
  encrypt: null, // Will be filled by AI
  decrypt: null, // Will be filled by AI
  authenticate: null, // Will be filled by AI
  store: null, // Will be filled by AI
};