import { Component, signal, computed, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { ModalComponent } from "../../shared/components/ui/modal/modal.component";
import { ConfirmModalComponent } from "../../shared/components/ui/confirm-modal/confirm-modal.component";
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { BadgeComponent } from "../../shared/components/ui/badge/badge.component";
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { SelectComponent } from "../../shared/components/form/select/select.component";
import { SearchInputComponent } from "../../shared/components/form/search-input/search-input.component";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { TextAreaComponent } from "../../shared/components/form/input/text-area.component";
import { FileUploaderComponent } from "../../shared/components/form/file-uploader/file-uploader.component";
import { PolicyCheckboxListComponent } from "../../shared/components/form/policy-checkbox-list/policy-checkbox-list.component";
import { LicensesService } from "../../shared/services/licenses.service";
import {
  License,
  LicenseCreate,
  LicenseStatus,
  LicenseType,
  PolicyAcceptance,
  AcceptancePolicy,
} from "../../shared/models";

interface LicenseFormData {
  name: string;
  description: string;
  type: LicenseType;
  version: string;
  file: File | null;
  policyAcceptances: PolicyAcceptance[];
  validFrom: string;
  validUntil: string;
}

@Component({
  selector: "app-licenses",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    ModalComponent,
    ConfirmModalComponent,
    ButtonComponent,
    BadgeComponent,
    LabelComponent,
    SelectComponent,
    SearchInputComponent,
    InputFieldComponent,
    TextAreaComponent,
    FileUploaderComponent,
    PolicyCheckboxListComponent,
  ],
  templateUrl: "./licenses.component.html",
})
export class LicensesComponent implements OnInit {
  // Inject service
  private readonly licensesService = inject(LicensesService);

  // Expose Math for template
  protected readonly Math = Math;

  // Data signals
  readonly licenses = this.licensesService.licenses;
  readonly policies = this.licensesService.policies;
  readonly loading = signal<boolean>(false);
  readonly searchTerm = signal<string>("");
  readonly filterStatus = signal<LicenseStatus | "">("");
  readonly filterType = signal<LicenseType | "">("");

  // Modal states
  readonly isFormModalOpen = signal<boolean>(false);
  readonly isDetailModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly isEditing = signal<boolean>(false);

  // Current item
  readonly currentLicense = signal<License | null>(null);

  // Form data
  readonly formData = signal<LicenseFormData>({
    name: "",
    description: "",
    type: "Creative Commons",
    version: "",
    file: null,
    policyAcceptances: [],
    validFrom: "",
    validUntil: "",
  });

  // Pagination
  readonly currentPage = signal<number>(1);
  readonly itemsPerPage = 5;

  // Computed: filtered licenses
  readonly filteredLicenses = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.filterStatus();
    const type = this.filterType();
    let result = this.licenses();

    if (term) {
      result = result.filter(
        (license) =>
          license.name.toLowerCase().includes(term) ||
          license.description.toLowerCase().includes(term) ||
          license.type.toLowerCase().includes(term),
      );
    }

    if (status) {
      result = result.filter((license) => license.status === status);
    }

    if (type) {
      result = result.filter((license) => license.type === type);
    }

    return result;
  });

  // Computed: paginated licenses
  readonly paginatedLicenses = computed(() => {
    const filtered = this.filteredLicenses();
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  });

  // Computed: total pages
  readonly totalPages = computed(() =>
    Math.ceil(this.filteredLicenses().length / this.itemsPerPage),
  );

  // Computed: page numbers
  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  // License type options for select
  readonly typeOptions = computed(() =>
    this.licensesService.licenseTypes.map((type) => ({
      value: type,
      label: type,
    })),
  );

  // License status options for filter
  readonly statusOptions = computed(() => [
    { value: "", label: "Todos los estados" },
    ...this.licensesService.licenseStatuses.map((status) => ({
      value: status,
      label: status,
    })),
  ]);

  // Type filter options
  readonly typeFilterOptions = computed(() => [
    { value: "", label: "Todos los tipos" },
    ...this.licensesService.licenseTypes.map((type) => ({
      value: type,
      label: type,
    })),
  ]);

  // Computed: check if form is valid
  readonly isFormValid = computed(() => {
    const data = this.formData();
    const requiredPolicies = this.policies().filter((p) => p.required);
    const allRequiredAccepted = requiredPolicies.every((policy) => {
      const acceptance = data.policyAcceptances.find(
        (a) => a.policyId === policy.id,
      );
      return acceptance?.accepted === true;
    });

    return (
      data.name.trim() !== "" &&
      data.description.trim() !== "" &&
      data.version.trim() !== "" &&
      data.validFrom !== "" &&
      allRequiredAccepted
    );
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    // Simulate API delay
    setTimeout(() => {
      this.loading.set(false);
    }, 300);
  }

  // Search handler
  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  // Filter handlers
  onStatusFilterChange(status: string): void {
    this.filterStatus.set(status as LicenseStatus | "");
    this.currentPage.set(1);
  }

  onTypeFilterChange(type: string): void {
    this.filterType.set(type as LicenseType | "");
    this.currentPage.set(1);
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // Modal handlers
  openCreateModal(): void {
    this.isEditing.set(false);
    this.currentLicense.set(null);
    this.resetForm();
    this.isFormModalOpen.set(true);
  }

  openEditModal(license: License): void {
    this.isEditing.set(true);
    this.currentLicense.set(license);
    this.formData.set({
      name: license.name,
      description: license.description,
      type: license.type,
      version: license.version,
      file: null,
      policyAcceptances: [...license.policyAcceptances],
      validFrom: this.formatDateForInput(license.validFrom),
      validUntil: license.validUntil
        ? this.formatDateForInput(license.validUntil)
        : "",
    });
    this.isFormModalOpen.set(true);
  }

  openDetailModal(license: License): void {
    this.currentLicense.set(license);
    this.isDetailModalOpen.set(true);
  }

  openDeleteModal(license: License): void {
    this.currentLicense.set(license);
    this.isDeleteModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.currentLicense.set(null);
    this.resetForm();
  }

  closeDetailModal(): void {
    this.isDetailModalOpen.set(false);
    this.currentLicense.set(null);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.currentLicense.set(null);
  }

  // Form handlers
  updateFormField<K extends keyof LicenseFormData>(
    field: K,
    value: string,
  ): void {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  onFileSelected(file: File): void {
    this.formData.update((data) => ({ ...data, file }));
  }

  onFileRemoved(): void {
    this.formData.update((data) => ({ ...data, file: null }));
  }

  onPolicyAcceptanceChange(acceptances: PolicyAcceptance[]): void {
    this.formData.update((data) => ({
      ...data,
      policyAcceptances: acceptances,
    }));
  }

  // CRUD operations
  saveLicense(): void {
    if (!this.isFormValid()) return;

    const data = this.formData();

    if (this.isEditing()) {
      const licenseId = this.currentLicense()?.id;
      if (licenseId) {
        this.licensesService.updateLicense(licenseId, {
          name: data.name,
          description: data.description,
          type: data.type,
          version: data.version,
          file: data.file ?? undefined,
          policyAcceptances: data.policyAcceptances,
          validFrom: new Date(data.validFrom),
          validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        });
      }
    } else {
      this.licensesService.createLicense({
        name: data.name,
        description: data.description,
        type: data.type,
        version: data.version,
        file: data.file ?? undefined,
        policyAcceptances: data.policyAcceptances,
        validFrom: new Date(data.validFrom),
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      });
    }

    this.closeFormModal();
  }

  deleteLicense(): void {
    const licenseId = this.currentLicense()?.id;
    if (licenseId) {
      this.licensesService.deleteLicense(licenseId);
    }
    this.closeDeleteModal();
  }

  // Status helpers
  getStatusBadgeColor(
    status: LicenseStatus,
  ): "success" | "warning" | "error" | "light" {
    const colors: Record<
      LicenseStatus,
      "success" | "warning" | "error" | "light"
    > = {
      Activa: "success",
      Pendiente: "warning",
      Expirada: "error",
      Revocada: "light",
    };
    return colors[status];
  }

  getTypeBadgeColor(
    type: LicenseType,
  ): "primary" | "success" | "info" | "warning" | "error" | "light" {
    const colors: Record<
      LicenseType,
      "primary" | "success" | "info" | "warning" | "error" | "light"
    > = {
      "Creative Commons": "success",
      MIT: "info",
      GPL: "primary",
      Apache: "warning",
      Propietaria: "error",
      "Dominio Público": "light",
    };
    return colors[type];
  }

  // Get policy by ID
  getPolicyById(policyId: number): AcceptancePolicy | undefined {
    return this.licensesService.getPolicyById(policyId);
  }

  // Format file size
  formatFileSize(bytes: number): string {
    return this.licensesService.formatFileSize(bytes);
  }

  // Count accepted policies
  getAcceptedPoliciesCount(license: License): number {
    return license.policyAcceptances.filter((p) => p.accepted).length;
  }

  // Utility functions
  private resetForm(): void {
    this.formData.set({
      name: "",
      description: "",
      type: "Creative Commons",
      version: "",
      file: null,
      policyAcceptances: [],
      validFrom: "",
      validUntil: "",
    });
  }

  private formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split("T")[0];
  }

  trackById(_index: number, license: License): number {
    return license.id;
  }
}
