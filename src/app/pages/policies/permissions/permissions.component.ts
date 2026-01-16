import { Component, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import {
  DataTableComponent,
  TableColumn,
  TableAction,
} from "../../../shared/components/tables/data-table/data-table.component";
import { ConfirmModalComponent } from "../../../shared/components/ui/confirm-modal/confirm-modal.component";
import { ModalComponent } from "../../../shared/components/ui/modal/modal.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { LabelComponent } from "../../../shared/components/form/label/label.component";
import { SelectComponent } from "../../../shared/components/form/select/select.component";
import { Permission, PermissionCreate } from "../../../shared/models";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { TextAreaComponent } from "../../../shared/components/form/input/text-area.component";

@Component({
  selector: "app-permissions",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    DataTableComponent,
    ConfirmModalComponent,
    ModalComponent,
    ButtonComponent,
    InputFieldComponent,
    TextAreaComponent,
    LabelComponent,
    SelectComponent,
  ],
  templateUrl: "./permissions.component.html",
})
export class PermissionsComponent implements OnInit {
  // State signals
  permissions = signal<Permission[]>([]);
  loading = signal<boolean>(false);

  // Modal states
  isFormModalOpen = signal<boolean>(false);
  isDeleteModalOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);

  // Form data
  currentPermission = signal<Permission | null>(null);
  formData = signal<PermissionCreate>({
    name: "",
    description: "",
    module: "",
  });

  // Module options for select
  moduleOptions = [
    { value: "users", label: "Usuarios" },
    { value: "roles", label: "Roles" },
    { value: "permissions", label: "Permisos" },
    { value: "settings", label: "Configuración" },
    { value: "reports", label: "Reportes" },
  ];

  // Table configuration
  columns: TableColumn<Permission>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Nombre" },
    { key: "description", header: "Descripción" },
    {
      key: "module",
      header: "Módulo",
      render: (permission) => this.getModuleLabel(permission.module),
    },
  ];

  actions: TableAction[] = [
    {
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
      </svg>`,
      label: "Editar",
      action: "edit",
      color: "primary",
    },
    {
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>`,
      label: "Eliminar",
      action: "delete",
      color: "danger",
    },
  ];

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.loading.set(true);
    // Simulated data - replace with actual API call
    setTimeout(() => {
      this.permissions.set([
        {
          id: 1,
          name: "users.create",
          description: "Crear usuarios",
          module: "users",
        },
        {
          id: 2,
          name: "users.read",
          description: "Ver usuarios",
          module: "users",
        },
        {
          id: 3,
          name: "users.update",
          description: "Actualizar usuarios",
          module: "users",
        },
        {
          id: 4,
          name: "users.delete",
          description: "Eliminar usuarios",
          module: "users",
        },
        {
          id: 5,
          name: "roles.create",
          description: "Crear roles",
          module: "roles",
        },
        {
          id: 6,
          name: "roles.read",
          description: "Ver roles",
          module: "roles",
        },
        {
          id: 7,
          name: "roles.update",
          description: "Actualizar roles",
          module: "roles",
        },
        {
          id: 8,
          name: "roles.delete",
          description: "Eliminar roles",
          module: "roles",
        },
        {
          id: 9,
          name: "settings.read",
          description: "Ver configuración",
          module: "settings",
        },
        {
          id: 10,
          name: "settings.update",
          description: "Modificar configuración",
          module: "settings",
        },
      ]);
      this.loading.set(false);
    }, 500);
  }

  getModuleLabel(module: string): string {
    const option = this.moduleOptions.find((opt) => opt.value === module);
    return option?.label ?? module;
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.currentPermission.set(null);
    this.formData.set({
      name: "",
      description: "",
      module: "",
    });
    this.isFormModalOpen.set(true);
  }

  openEditModal(permission: Permission): void {
    this.isEditing.set(true);
    this.currentPermission.set(permission);
    this.formData.set({
      name: permission.name,
      description: permission.description,
      module: permission.module,
    });
    this.isFormModalOpen.set(true);
  }

  openDeleteModal(permission: Permission): void {
    this.currentPermission.set(permission);
    this.isDeleteModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.currentPermission.set(null);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.currentPermission.set(null);
  }

  onActionClick(event: { action: string; item: Permission }): void {
    if (event.action === "edit") {
      this.openEditModal(event.item);
    } else if (event.action === "delete") {
      this.openDeleteModal(event.item);
    }
  }

  updateFormField(field: keyof PermissionCreate, value: string): void {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  savePermission(): void {
    const data = this.formData();

    if (this.isEditing()) {
      // Update existing permission
      const permissionId = this.currentPermission()?.id;
      if (permissionId) {
        this.permissions.update((permissions) =>
          permissions.map((p) =>
            p.id === permissionId ? { ...p, ...data } : p,
          ),
        );
      }
    } else {
      // Create new permission
      const newId = Math.max(...this.permissions().map((p) => p.id), 0) + 1;
      const newPermission: Permission = {
        id: newId,
        ...data,
      };
      this.permissions.update((permissions) => [...permissions, newPermission]);
    }

    this.closeFormModal();
  }

  deletePermission(): void {
    const permissionId = this.currentPermission()?.id;
    if (permissionId) {
      this.permissions.update((permissions) =>
        permissions.filter((p) => p.id !== permissionId),
      );
    }
    this.closeDeleteModal();
  }
}
