import { Component, signal, computed, OnInit } from "@angular/core";
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
import { Role, RoleCreate, Permission } from "../../../shared/models";
import { CheckboxComponent } from "../../../shared/components/form/input/checkbox.component";
import { InputFieldComponent } from "../../../shared/components/form/input/input-field.component";
import { TextAreaComponent } from "../../../shared/components/form/input/text-area.component";

@Component({
  selector: "app-roles",
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
    CheckboxComponent,
  ],
  templateUrl: "./roles.component.html",
})
export class RolesComponent implements OnInit {
  // State signals
  roles = signal<Role[]>([]);
  permissions = signal<Permission[]>([]);
  loading = signal<boolean>(false);

  // Modal states
  isFormModalOpen = signal<boolean>(false);
  isDeleteModalOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);

  // Form data
  currentRole = signal<Role | null>(null);
  formData = signal<RoleCreate>({
    name: "",
    description: "",
    permissionIds: [],
  });

  // Table configuration
  columns: TableColumn<Role>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Nombre" },
    { key: "description", header: "Descripción" },
    {
      key: "permissions",
      header: "Permisos",
      render: (role) => role.permissions?.length?.toString() ?? "0",
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
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.loading.set(true);
    // Simulated data - replace with actual API call
    setTimeout(() => {
      this.roles.set([
        {
          id: 1,
          name: "Administrador",
          description: "Acceso completo al sistema",
          permissions: [
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
          ],
        },
        {
          id: 2,
          name: "Editor",
          description: "Puede editar contenido",
          permissions: [
            {
              id: 2,
              name: "users.read",
              description: "Ver usuarios",
              module: "users",
            },
          ],
        },
        {
          id: 3,
          name: "Viewer",
          description: "Solo lectura",
          permissions: [],
        },
      ]);
      this.loading.set(false);
    }, 500);
  }

  loadPermissions(): void {
    // Simulated data - replace with actual API call
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
      { id: 6, name: "roles.read", description: "Ver roles", module: "roles" },
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
    ]);
  }

  // Group permissions by module
  groupedPermissions = computed(() => {
    const groups: Record<string, Permission[]> = {};
    for (const permission of this.permissions()) {
      if (!groups[permission.module]) {
        groups[permission.module] = [];
      }
      groups[permission.module].push(permission);
    }
    return groups;
  });

  getModuleKeys(): string[] {
    return Object.keys(this.groupedPermissions());
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.currentRole.set(null);
    this.formData.set({
      name: "",
      description: "",
      permissionIds: [],
    });
    this.isFormModalOpen.set(true);
  }

  openEditModal(role: Role): void {
    this.isEditing.set(true);
    this.currentRole.set(role);
    this.formData.set({
      name: role.name,
      description: role.description,
      permissionIds: role.permissions?.map((p) => p.id) ?? [],
    });
    this.isFormModalOpen.set(true);
  }

  openDeleteModal(role: Role): void {
    this.currentRole.set(role);
    this.isDeleteModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.currentRole.set(null);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.currentRole.set(null);
  }

  onActionClick(event: { action: string; item: Role }): void {
    if (event.action === "edit") {
      this.openEditModal(event.item);
    } else if (event.action === "delete") {
      this.openDeleteModal(event.item);
    }
  }

  updateFormField(field: keyof RoleCreate, value: string): void {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  togglePermission(permissionId: number, checked: boolean): void {
    this.formData.update((data) => {
      const permissionIds = checked
        ? [...data.permissionIds, permissionId]
        : data.permissionIds.filter((id) => id !== permissionId);
      return { ...data, permissionIds };
    });
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.formData().permissionIds.includes(permissionId);
  }

  saveRole(): void {
    const data = this.formData();

    if (this.isEditing()) {
      // Update existing role
      const roleId = this.currentRole()?.id;
      if (roleId) {
        this.roles.update((roles) =>
          roles.map((r) =>
            r.id === roleId
              ? {
                  ...r,
                  name: data.name,
                  description: data.description,
                  permissions: this.permissions().filter((p) =>
                    data.permissionIds.includes(p.id),
                  ),
                }
              : r,
          ),
        );
      }
    } else {
      // Create new role
      const newId = Math.max(...this.roles().map((r) => r.id), 0) + 1;
      const newRole: Role = {
        id: newId,
        name: data.name,
        description: data.description,
        permissions: this.permissions().filter((p) =>
          data.permissionIds.includes(p.id),
        ),
      };
      this.roles.update((roles) => [...roles, newRole]);
    }

    this.closeFormModal();
  }

  deleteRole(): void {
    const roleId = this.currentRole()?.id;
    if (roleId) {
      this.roles.update((roles) => roles.filter((r) => r.id !== roleId));
    }
    this.closeDeleteModal();
  }
}
