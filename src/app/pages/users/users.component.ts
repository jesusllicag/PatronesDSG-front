import { Component, signal, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { ModalComponent } from "../../shared/components/ui/modal/modal.component";
import { ConfirmModalComponent } from "../../shared/components/ui/confirm-modal/confirm-modal.component";
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { SelectComponent } from "../../shared/components/form/select/select.component";
import { SearchInputComponent } from "../../shared/components/form/search-input/search-input.component";
import { StatusBadgeComponent } from "../../shared/components/ui/status-badge/status-badge.component";
import { User, UserCreate, UserStatus, Role } from "../../shared/models";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageBreadcrumbComponent,
    ModalComponent,
    ConfirmModalComponent,
    ButtonComponent,
    InputFieldComponent,
    LabelComponent,
    SelectComponent,
    SearchInputComponent,
    StatusBadgeComponent,
  ],
  templateUrl: "./users.component.html",
})
export class UsersComponent implements OnInit {
  // Expose Math for template
  protected readonly Math = Math;

  // Data signals
  users = signal<User[]>([]);
  roles = signal<Role[]>([]);
  loading = signal<boolean>(false);
  searchTerm = signal<string>("");

  // Modal states
  isFormModalOpen = signal<boolean>(false);
  isDeleteModalOpen = signal<boolean>(false);
  isStatusModalOpen = signal<boolean>(false);
  isEditing = signal<boolean>(false);

  // Current item signals
  currentUser = signal<User | null>(null);
  pendingStatus = signal<UserStatus | null>(null);

  // Form data
  formData = signal<UserCreate>({
    name: "",
    email: "",
    password: "",
    roleId: 0,
  });

  // Pagination
  currentPage = signal<number>(1);
  itemsPerPage = 5;

  // Computed: filtered users based on search
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const allUsers = this.users();

    if (!term) return allUsers;

    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.name.toLowerCase().includes(term) ||
        user.status.toLowerCase().includes(term),
    );
  });

  // Computed: paginated users
  paginatedUsers = computed(() => {
    const filtered = this.filteredUsers();
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  });

  // Computed: total pages
  totalPages = computed(() => {
    return Math.ceil(this.filteredUsers().length / this.itemsPerPage);
  });

  // Computed: page numbers array
  pageNumbers = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  // Role options for select
  roleOptions = computed(() => {
    return this.roles().map((role) => ({
      value: role.id.toString(),
      label: role.name,
    }));
  });

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.loading.set(true);
    // Simulated API call
    setTimeout(() => {
      this.users.set([
        {
          id: 1,
          name: "Carlos Mendoza",
          email: "carlos.mendoza@mail.com",
          image: "images/user/user-17.jpg",
          role: {
            id: 1,
            name: "Administrador",
            description: "Acceso completo",
            permissions: [],
          },
          status: "Activo",
          createdAt: new Date("2024-01-15"),
        },
        {
          id: 2,
          name: "María García",
          email: "maria.garcia@mail.com",
          image: "images/user/user-18.jpg",
          role: {
            id: 2,
            name: "Editor",
            description: "Puede editar contenido",
            permissions: [],
          },
          status: "Pendiente",
          createdAt: new Date("2024-02-20"),
        },
        {
          id: 3,
          name: "Juan Pérez",
          email: "juan.perez@mail.com",
          image: "images/user/user-19.jpg",
          role: {
            id: 3,
            name: "Viewer",
            description: "Solo lectura",
            permissions: [],
          },
          status: "Activo",
          createdAt: new Date("2024-03-10"),
        },
        {
          id: 4,
          name: "Ana López",
          email: "ana.lopez@mail.com",
          image: "images/user/user-20.jpg",
          role: {
            id: 2,
            name: "Editor",
            description: "Puede editar contenido",
            permissions: [],
          },
          status: "Rechazado",
          createdAt: new Date("2024-03-15"),
        },
        {
          id: 5,
          name: "Roberto Sánchez",
          email: "roberto.sanchez@mail.com",
          image: "images/user/user-21.jpg",
          role: {
            id: 3,
            name: "Viewer",
            description: "Solo lectura",
            permissions: [],
          },
          status: "Pendiente",
          createdAt: new Date("2024-04-01"),
        },
        {
          id: 6,
          name: "Laura Martínez",
          email: "laura.martinez@mail.com",
          image: "images/user/user-22.jpg",
          role: {
            id: 1,
            name: "Administrador",
            description: "Acceso completo",
            permissions: [],
          },
          status: "Activo",
          createdAt: new Date("2024-04-10"),
        },
        {
          id: 7,
          name: "Diego Ramírez",
          email: "diego.ramirez@mail.com",
          image: "images/user/user-23.jpg",
          role: {
            id: 2,
            name: "Editor",
            description: "Puede editar contenido",
            permissions: [],
          },
          status: "Pendiente",
          createdAt: new Date("2024-04-15"),
        },
      ]);
      this.loading.set(false);
    }, 500);
  }

  loadRoles(): void {
    this.roles.set([
      {
        id: 1,
        name: "Administrador",
        description: "Acceso completo al sistema",
        permissions: [],
      },
      {
        id: 2,
        name: "Editor",
        description: "Puede editar contenido",
        permissions: [],
      },
      { id: 3, name: "Viewer", description: "Solo lectura", permissions: [] },
    ]);
  }

  // Search handler
  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1); // Reset to first page on search
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
    this.currentUser.set(null);
    this.formData.set({
      name: "",
      email: "",
      password: "",
      roleId: 0,
    });
    this.isFormModalOpen.set(true);
  }

  openEditModal(user: User): void {
    this.isEditing.set(true);
    this.currentUser.set(user);
    this.formData.set({
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.role.id,
    });
    this.isFormModalOpen.set(true);
  }

  openDeleteModal(user: User): void {
    this.currentUser.set(user);
    this.isDeleteModalOpen.set(true);
  }

  openStatusModal(user: User, newStatus: UserStatus): void {
    this.currentUser.set(user);
    this.pendingStatus.set(newStatus);
    this.isStatusModalOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormModalOpen.set(false);
    this.currentUser.set(null);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.currentUser.set(null);
  }

  closeStatusModal(): void {
    this.isStatusModalOpen.set(false);
    this.currentUser.set(null);
    this.pendingStatus.set(null);
  }

  // Form handlers
  updateFormField(field: keyof UserCreate, value: string | number): void {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  // CRUD operations
  saveUser(): void {
    const data = this.formData();
    const selectedRole = this.roles().find((r) => r.id === Number(data.roleId));

    if (!selectedRole) return;

    if (this.isEditing()) {
      const userId = this.currentUser()?.id;
      if (userId) {
        this.users.update((users) =>
          users.map((u) =>
            u.id === userId
              ? { ...u, name: data.name, email: data.email, role: selectedRole }
              : u,
          ),
        );
      }
    } else {
      const newId = Math.max(...this.users().map((u) => u.id), 0) + 1;
      const newUser: User = {
        id: newId,
        name: data.name,
        email: data.email,
        image: "images/user/user-default.jpg",
        role: selectedRole,
        status: "Pendiente", // New users always start as Pending
        createdAt: new Date(),
      };
      this.users.update((users) => [...users, newUser]);
    }

    this.closeFormModal();
  }

  deleteUser(): void {
    const userId = this.currentUser()?.id;
    if (userId) {
      this.users.update((users) => users.filter((u) => u.id !== userId));
    }
    this.closeDeleteModal();
  }

  confirmStatusChange(): void {
    const userId = this.currentUser()?.id;
    const newStatus = this.pendingStatus();

    if (userId && newStatus) {
      this.users.update((users) =>
        users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
      );
    }
    this.closeStatusModal();
  }

  // Status helpers
  getStatusMessage(): string {
    const status = this.pendingStatus();
    const userName = this.currentUser()?.name ?? "";

    if (status === "Activo") {
      return `¿Estás seguro de aprobar al usuario "${userName}"? Tendrá acceso completo según su rol asignado.`;
    } else if (status === "Rechazado") {
      return `¿Estás seguro de rechazar al usuario "${userName}"? No podrá acceder al sistema.`;
    }
    return `¿Estás seguro de cambiar el estado del usuario "${userName}" a ${status}?`;
  }

  getStatusModalTitle(): string {
    const status = this.pendingStatus();
    if (status === "Activo") return "Aprobar Usuario";
    if (status === "Rechazado") return "Rechazar Usuario";
    return "Cambiar Estado";
  }

  getStatusModalVariant(): "danger" | "warning" | "primary" {
    const status = this.pendingStatus();
    if (status === "Activo") return "primary";
    if (status === "Rechazado") return "danger";
    return "warning";
  }

  canApprove(user: User): boolean {
    return user.status === "Pendiente";
  }

  canReject(user: User): boolean {
    return user.status === "Pendiente" || user.status === "Activo";
  }

  trackById(_index: number, user: User): number {
    return user.id;
  }
}
