/**
 * Estado de una licencia
 */
export type LicenseStatus = 'Activa' | 'Pendiente' | 'Expirada' | 'Revocada';

/**
 * Tipo de licencia
 */
export type LicenseType = 'Creative Commons' | 'MIT' | 'GPL' | 'Apache' | 'Propietaria' | 'Dominio Público';

/**
 * Representa un archivo adjunto a una licencia
 */
export interface LicenseFile {
  id: number;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

/**
 * Representa una política de aceptación
 */
export interface AcceptancePolicy {
  id: number;
  code: string;
  name: string;
  description: string;
  required: boolean;
}

/**
 * Estado de aceptación de una política por parte del usuario
 */
export interface PolicyAcceptance {
  policyId: number;
  accepted: boolean;
  acceptedAt?: Date;
}

/**
 * Modelo principal de Licencia
 */
export interface License {
  id: number;
  name: string;
  description: string;
  type: LicenseType;
  status: LicenseStatus;
  version: string;
  file?: LicenseFile;
  policyAcceptances: PolicyAcceptance[];
  validFrom: Date;
  validUntil?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * DTO para crear una nueva licencia
 */
export interface LicenseCreate {
  name: string;
  description: string;
  type: LicenseType;
  version: string;
  file?: File;
  policyAcceptances: PolicyAcceptance[];
  validFrom: Date;
  validUntil?: Date;
}

/**
 * DTO para actualizar una licencia existente
 */
export interface LicenseUpdate {
  id: number;
  name?: string;
  description?: string;
  type?: LicenseType;
  version?: string;
  file?: File;
  policyAcceptances?: PolicyAcceptance[];
  validFrom?: Date;
  validUntil?: Date;
}

/**
 * DTO para cambiar el estado de una licencia
 */
export interface LicenseStatusChange {
  id: number;
  status: LicenseStatus;
  reason?: string;
}
