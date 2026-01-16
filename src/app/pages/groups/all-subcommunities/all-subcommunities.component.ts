import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HierarchyListComponent } from '../../../shared/components/common/hierarchy-list/hierarchy-list.component';
import { GroupsService } from '../../../shared/services/groups.service';
import { BreadcrumbItem, Subcommunity, HierarchyConfig } from '../../../shared/models';

@Component({
  selector: 'app-all-subcommunities',
  standalone: true,
  imports: [HierarchyListComponent],
  template: `
    <app-hierarchy-list
      [breadcrumbItems]="breadcrumbItems"
      [currentPage]="'Subcomunidades'"
      [config]="hierarchyConfig"
      [entities]="allSubcommunities()"
      [isDeleteModalOpen]="isDeleteModalOpen()"
      [entityToDelete]="subcommunityToDelete()"
      (create)="navigateToCreate()"
      (edit)="navigateToEdit($event)"
      (deleteEntity)="openDeleteModal($event)"
      (confirmDelete)="confirmDelete()"
      (cancelDelete)="closeDeleteModal()"
      (navigate)="navigateToCollections($event)"
    />
  `,
})
export class AllSubcommunitiesComponent {
  private router = inject(Router);
  private groupsService = inject(GroupsService);

  allSubcommunities = computed(() => {
    const subcommunities = this.groupsService.subcommunities();
    const collections = this.groupsService.collections();

    return subcommunities.map(sub => ({
      ...sub,
      childCount: collections.filter(c => c.subcommunityId === sub.id).length,
    }));
  });

  isDeleteModalOpen = signal(false);
  subcommunityToDelete = signal<Subcommunity | null>(null);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', path: '/' },
  ];

  hierarchyConfig: HierarchyConfig<Subcommunity> = {
    title: 'Todas las Subcomunidades',
    description: 'Gestiona todas las subcomunidades del repositorio',
    emptyStateMessage: 'No hay subcomunidades',
    emptyStateIcon: `<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
    </svg>`,
    createButtonLabel: 'Nueva Subcomunidad',
    deleteModalTitle: 'Eliminar Subcomunidad',
    deleteModalMessage: (subcommunity) =>
      `¿Estás seguro de eliminar la subcomunidad ${subcommunity.name}? Se eliminarán también todas sus colecciones.`,
    level: 'subcommunity',
    childLabel: 'colecciones',
  };

  navigateToCreate(): void {
    // Necesita seleccionar una comunidad primero
    this.router.navigate(['/grupos/comunidades']);
  }

  navigateToEdit(subcommunity: Subcommunity): void {
    this.router.navigate([
      '/grupos/comunidades',
      subcommunity.communityId,
      'subcomunidades',
      subcommunity.id
    ]);
  }

  navigateToCollections(subcommunity: Subcommunity): void {
    this.router.navigate([
      '/grupos/comunidades',
      subcommunity.communityId,
      'subcomunidades',
      subcommunity.id,
      'colecciones'
    ]);
  }

  openDeleteModal(subcommunity: Subcommunity): void {
    this.subcommunityToDelete.set(subcommunity);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.subcommunityToDelete.set(null);
  }

  confirmDelete(): void {
    const subcommunity = this.subcommunityToDelete();
    if (subcommunity) {
      this.groupsService.deleteSubcommunity(subcommunity.id);
    }
    this.closeDeleteModal();
  }
}
