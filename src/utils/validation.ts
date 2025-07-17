import { PatientData } from '../types';

export const validatePatientData = (data: Partial<PatientData>): string[] => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Patient name is required');
  }

  if (!data.age || data.age < 0 || data.age > 150) {
    errors.push('Valid patient age is required');
  }

  if (!data.symptoms || data.symptoms.trim().length === 0) {
    errors.push('Symptoms description is required');
  }

  return errors;
};

export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatTimestamp = (date: Date): string => {
  return date.toISOString();
};