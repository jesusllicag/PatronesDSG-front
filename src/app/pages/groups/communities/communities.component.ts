import { Component, inject, signal, computed } from "@angular/core";
import { Router } from "@angular/router";
import { HierarchyListComponent } from "../../../shared/components/common/hierarchy-list/hierarchy-list.component";
import { GroupsService } from "../../../shared/services/groups.service";
import {
  BreadcrumbItem,
  Community,
  HierarchyConfig,
} from "../../../shared/models";

@Component({
  selector: "app-communities",
  standalone: true,
  imports: [HierarchyListComponent],
  template: `
    <app-hierarchy-list
      [breadcrumbItems]="breadcrumbItems"
      [currentPage]="'Comunidades'"
      [config]="hierarchyConfig"
      [entities]="communities()"
      [isDeleteModalOpen]="isDeleteModalOpen()"
      [entityToDelete]="communityToDelete()"
      (create)="navigateToCreate()"
      (edit)="navigateToEdit($event)"
      (deleteEntity)="openDeleteModal($event)"
      (confirmDelete)="confirmDelete()"
      (cancelDelete)="closeDeleteModal()"
      (navigate)="navigateToSubcommunities($event)"
    />
  `,
})
export class CommunitiesComponent {
  private router = inject(Router);
  private groupsService = inject(GroupsService);

  communities = computed(() =>
    this.groupsService.communitiesWithCount().map((c) => ({
      ...c,
      childCount: c.subcommunityCount,
    })),
  );

  isDeleteModalOpen = signal(false);
  communityToDelete = signal<Community | null>(null);

  breadcrumbItems: BreadcrumbItem[] = [{ label: "Inicio", path: "/" }];

  hierarchyConfig: HierarchyConfig<Community> = {
    title: "Comunidades",
    description: "Gestiona las comunidades principales del repositorio",
    emptyStateMessage: "No hay comunidades",
    emptyStateIcon: `<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
    </svg>`,
    createButtonLabel: "Nueva Comunidad",
    deleteModalTitle: "Eliminar Comunidad",
    deleteModalMessage: (community) =>
      `¿Estás seguro de eliminar la comunidad ${community.name}? Se eliminarán también todas sus subcomunidades y colecciones.`,
    level: "community",
    childLabel: "subcomunidades",
  };

  navigateToCreate(): void {
    this.router.navigate(["/grupos/comunidades/nuevo"]);
  }

  navigateToEdit(community: Community): void {
    this.router.navigate(["/grupos/comunidades", community.id]);
  }

  navigateToSubcommunities(community: Community): void {
    this.router.navigate([
      "/grupos/comunidades",
      community.id,
      "subcomunidades",
    ]);
  }

  openDeleteModal(community: Community): void {
    this.communityToDelete.set(community);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.communityToDelete.set(null);
  }

  confirmDelete(): void {
    const community = this.communityToDelete();
    if (community) {
      this.groupsService.deleteCommunity(community.id);
    }
    this.closeDeleteModal();
  }
}
