import { Injectable, signal, computed } from '@angular/core';
import {
  License,
  LicenseCreate,
  LicenseFile,
  LicenseStatus,
  LicenseType,
  AcceptancePolicy,
  PolicyAcceptance,
} from '../models';

@Injectable({ providedIn: 'root' })
export class LicensesService {
  // Mock de políticas de aceptación disponibles
  private readonly policiesData = signal<AcceptancePolicy[]>([
    {
      id: 1,
      code: 'TERMS_USE',
      name: 'Términos de Uso',
      description: 'Acepto los términos y condiciones de uso de esta licencia.',
      required: true,
    },
    {
      id: 2,
      code: 'DATA_SHARING',
      name: 'Compartir Datos',
      description: 'Autorizo compartir los datos derivados bajo las mismas condiciones.',
      required: true,
    },
    {
      id: 3,
      code: 'ATTRIBUTION',
      name: 'Atribución',
      description: 'Me comprometo a dar crédito al autor original en cualquier uso.',
      required: true,
    },
    {
      id: 4,
      code: 'NON_COMMERCIAL',
      name: 'Uso No Comercial',
      description: 'Confirmo que el uso será exclusivamente para fines no comerciales.',
      required: false,
    },
    {
      id: 5,
      code: 'MODIFICATIONS',
      name: 'Modificaciones',
      description: 'Acepto documentar cualquier modificación realizada al material original.',
      required: false,
    },
    {
      id: 6,
      code: 'DISTRIBUTION',
      name: 'Distribución',
      description: 'Me comprometo a distribuir el material solo bajo esta misma licencia.',
      required: false,
    },
  ]);

  // Mock de licencias con datos de ejemplo
  private readonly licensesData = signal<License[]>([
    {
      id: 1,
      name: 'Licencia Creative Commons BY-SA 4.0',
      description: 'Permite compartir y adaptar el material para cualquier propósito, incluso comercialmente, siempre que se atribuya correctamente y se comparta bajo la misma licencia.',
      type: 'Creative Commons',
      status: 'Activa',
      version: '4.0',
      file: {
        id: 1,
        name: 'cc-by-sa-4.0.pdf',
        originalName: 'Creative Commons BY-SA 4.0.pdf',
        mimeType: 'application/pdf',
        size: 245678,
        url: '/assets/licenses/cc-by-sa-4.0.pdf',
        uploadedAt: new Date('2024-01-15'),
      },
      policyAcceptances: [
        { policyId: 1, accepted: true, acceptedAt: new Date('2024-01-15') },
        { policyId: 2, accepted: true, acceptedAt: new Date('2024-01-15') },
        { policyId: 3, accepted: true, acceptedAt: new Date('2024-01-15') },
        { policyId: 6, accepted: true, acceptedAt: new Date('2024-01-15') },
      ],
      validFrom: new Date('2024-01-01'),
      validUntil: new Date('2025-12-31'),
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Licencia MIT para Software',
      description: 'Licencia permisiva que permite el uso, copia, modificación y distribución del software sin restricciones.',
      type: 'MIT',
      status: 'Activa',
      version: '1.0',
      file: {
        id: 2,
        name: 'mit-license.pdf',
        originalName: 'MIT License.pdf',
        mimeType: 'application/pdf',
        size: 128456,
        url: '/assets/licenses/mit-license.pdf',
        uploadedAt: new Date('2024-02-10'),
      },
      policyAcceptances: [
        { policyId: 1, accepted: true, acceptedAt: new Date('2024-02-10') },
        { policyId: 3, accepted: true, acceptedAt: new Date('2024-02-10') },
      ],
      validFrom: new Date('2024-02-01'),
      createdAt: new Date('2024-02-10'),
    },
    {
      id: 3,
      name: 'Licencia GPL v3',
      description: 'Licencia copyleft que garantiza la libertad de usar, estudiar, compartir y modificar el software.',
      type: 'GPL',
      status: 'Pendiente',
      version: '3.0',
      policyAcceptances: [
        { policyId: 1, accepted: true, acceptedAt: new Date('2024-03-05') },
        { policyId: 2, accepted: false },
        { policyId: 3, accepted: false },
        { policyId: 6, accepted: false },
      ],
      validFrom: new Date('2024-03-01'),
      validUntil: new Date('2026-03-01'),
      createdAt: new Date('2024-03-05'),
    },
    {
      id: 4,
      name: 'Licencia Propietaria Institucional',
      description: 'Licencia de uso interno exclusivo para la institución. No permite redistribución ni modificación sin autorización expresa.',
      type: 'Propietaria',
      status: 'Expirada',
      version: '2.1',
      file: {
        id: 3,
        name: 'proprietary-license.pdf',
        originalName: 'Licencia Propietaria v2.1.pdf',
        mimeType: 'application/pdf',
        size: 567890,
        url: '/assets/licenses/proprietary-license.pdf',
        uploadedAt: new Date('2023-06-20'),
      },
      policyAcceptances: [
        { policyId: 1, accepted: true, acceptedAt: new Date('2023-06-20') },
        { policyId: 4, accepted: true, acceptedAt: new Date('2023-06-20') },
      ],
      validFrom: new Date('2023-06-01'),
      validUntil: new Date('2024-06-01'),
      createdAt: new Date('2023-06-20'),
      updatedAt: new Date('2024-06-02'),
    },
    {
      id: 5,
      name: 'Licencia Apache 2.0',
      description: 'Licencia permisiva que permite el uso del software para cualquier propósito, distribuir, modificar y distribuir versiones modificadas.',
      type: 'Apache',
      status: 'Activa',
      version: '2.0',
      file: {
        id: 4,
        name: 'apache-2.0.pdf',
        originalName: 'Apache License 2.0.pdf',
        mimeType: 'application/pdf',
        size: 189234,
        url: '/assets/licenses/apache-2.0.pdf',
        uploadedAt: new Date('2024-04-12'),
      },
      policyAcceptances: [
        { policyId: 1, accepted: true, acceptedAt: new Date('2024-04-12') },
        { policyId: 3, accepted: true, acceptedAt: new Date('2024-04-12') },
        { policyId: 5, accepted: true, acceptedAt: new Date('2024-04-12') },
      ],
      validFrom: new Date('2024-04-01'),
      createdAt: new Date('2024-04-12'),
    },
    {
      id: 6,
      name: 'Dominio Público - CC0',
      description: 'Renuncia a todos los derechos de autor y derechos conexos, dedicando la obra al dominio público.',
      type: 'Dominio Público',
      status: 'Revocada',
      version: '1.0',
      policyAcceptances: [
        { policyId: 1, accepted: true, acceptedAt: new Date('2024-01-20') },
      ],
      validFrom: new Date('2024-01-01'),
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-05-15'),
    },
  ]);

  // Signals de solo lectura
  readonly licenses = this.licensesData.asReadonly();
  readonly policies = this.policiesData.asReadonly();

  // Computed: licencias con conteo de políticas aceptadas
  readonly licensesWithPolicyCount = computed(() =>
    this.licensesData().map((license) => ({
      ...license,
      acceptedPoliciesCount: license.policyAcceptances.filter((p) => p.accepted).length,
      totalPoliciesCount: license.policyAcceptances.length,
    }))
  );

  // Computed: políticas requeridas
  readonly requiredPolicies = computed(() =>
    this.policiesData().filter((p) => p.required)
  );

  // Computed: tipos de licencia disponibles
  readonly licenseTypes: LicenseType[] = [
    'Creative Commons',
    'MIT',
    'GPL',
    'Apache',
    'Propietaria',
    'Dominio Público',
  ];

  // Computed: estados de licencia disponibles
  readonly licenseStatuses: LicenseStatus[] = [
    'Activa',
    'Pendiente',
    'Expirada',
    'Revocada',
  ];

  /**
   * Obtiene una licencia por su ID
   */
  getLicenseById(id: number): License | undefined {
    return this.licensesData().find((l) => l.id === id);
  }

  /**
   * Obtiene una política por su ID
   */
  getPolicyById(id: number): AcceptancePolicy | undefined {
    return this.policiesData().find((p) => p.id === id);
  }

  /**
   * Crea una nueva licencia
   */
  createLicense(data: LicenseCreate): License {
    const newId = Math.max(...this.licensesData().map((l) => l.id), 0) + 1;

    let licenseFile: LicenseFile | undefined;
    if (data.file) {
      licenseFile = this.createMockFile(data.file, newId);
    }

    const newLicense: License = {
      id: newId,
      name: data.name,
      description: data.description,
      type: data.type,
      status: 'Pendiente',
      version: data.version,
      file: licenseFile,
      policyAcceptances: data.policyAcceptances,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      createdAt: new Date(),
    };

    this.licensesData.update((licenses) => [...licenses, newLicense]);
    return newLicense;
  }

  /**
   * Actualiza una licencia existente
   */
  updateLicense(id: number, data: Partial<LicenseCreate>): void {
    this.licensesData.update((licenses) =>
      licenses.map((license) => {
        if (license.id !== id) return license;

        let updatedFile = license.file;
        if (data.file) {
          updatedFile = this.createMockFile(data.file, id);
        }

        return {
          ...license,
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.type && { type: data.type }),
          ...(data.version && { version: data.version }),
          ...(data.policyAcceptances && { policyAcceptances: data.policyAcceptances }),
          ...(data.validFrom && { validFrom: data.validFrom }),
          ...(data.validUntil !== undefined && { validUntil: data.validUntil }),
          file: updatedFile,
          updatedAt: new Date(),
        };
      })
    );
  }

  /**
   * Elimina una licencia
   */
  deleteLicense(id: number): void {
    this.licensesData.update((licenses) => licenses.filter((l) => l.id !== id));
  }

  /**
   * Cambia el estado de una licencia
   */
  changeStatus(id: number, status: LicenseStatus): void {
    this.licensesData.update((licenses) =>
      licenses.map((l) =>
        l.id === id ? { ...l, status, updatedAt: new Date() } : l
      )
    );
  }

  /**
   * Verifica si todas las políticas requeridas están aceptadas
   */
  areRequiredPoliciesAccepted(acceptances: PolicyAcceptance[]): boolean {
    const requiredPolicyIds = this.requiredPolicies().map((p) => p.id);
    return requiredPolicyIds.every((policyId) => {
      const acceptance = acceptances.find((a) => a.policyId === policyId);
      return acceptance?.accepted === true;
    });
  }

  /**
   * Crea un archivo mock simulando una subida
   */
  private createMockFile(file: File, licenseId: number): LicenseFile {
    const fileId = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();

    return {
      id: fileId,
      name: `license-${licenseId}-${safeName}`,
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      url: `/assets/licenses/license-${licenseId}-${safeName}`,
      uploadedAt: new Date(),
    };
  }

  /**
   * Formatea el tamaño de archivo a texto legible
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
