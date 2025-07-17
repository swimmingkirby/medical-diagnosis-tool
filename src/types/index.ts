export interface PatientData {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  notes: string;
  transcribedAudio?: string;
  llmSummary?: string;
  timestamp: Date;
  recordHash?: string;
  blockchainTxHash?: string;
}

export interface VoiceRecording {
  id: string;
  audioUri: string;
  duration: number;
  transcriptionStatus: 'pending' | 'completed' | 'failed';
  transcribedText?: string;
}

export interface BlockchainRecord {
  recordHash: string;
  timestamp: number;
  transactionHash: string;
  blockNumber: number;
}

export interface ServiceStatus {
  whisper: boolean;
  llm: boolean;
  blockchain: boolean;
}