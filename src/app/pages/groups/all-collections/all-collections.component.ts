import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HierarchyListComponent } from '../../../shared/components/common/hierarchy-list/hierarchy-list.component';
import { GroupsService } from '../../../shared/services/groups.service';
import { BreadcrumbItem, Collection, HierarchyConfig } from '../../../shared/models';

@Component({
  selector: 'app-all-collections',
  standalone: true,
  imports: [HierarchyListComponent],
  template: `
    <app-hierarchy-list
      [breadcrumbItems]="breadcrumbItems"
      [currentPage]="'Colecciones'"
      [config]="hierarchyConfig"
      [entities]="allCollections()"
      [isDeleteModalOpen]="isDeleteModalOpen()"
      [entityToDelete]="collectionToDelete()"
      (create)="navigateToCreate()"
      (edit)="navigateToEdit($event)"
      (deleteEntity)="openDeleteModal($event)"
      (confirmDelete)="confirmDelete()"
      (cancelDelete)="closeDeleteModal()"
      (navigate)="navigateToItems($event)"
    />
  `,
})
export class AllCollectionsComponent {
  private router = inject(Router);
  private groupsService = inject(GroupsService);

  allCollections = computed(() =>
    this.groupsService.collections().map(col => ({
      ...col,
      childCount: col.itemCount ?? 0,
    }))
  );

  isDeleteModalOpen = signal(false);
  collectionToDelete = signal<Collection | null>(null);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', path: '/' },
  ];

  hierarchyConfig: HierarchyConfig<Collection> = {
    title: 'Todas las Colecciones',
    description: 'Gestiona todas las colecciones del repositorio',
    emptyStateMessage: 'No hay colecciones',
    emptyStateIcon: `<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"/>
    </svg>`,
    createButtonLabel: 'Nueva Colección',
    deleteModalTitle: 'Eliminar Colección',
    deleteModalMessage: (collection) =>
      `¿Estás seguro de eliminar la colección ${collection.name}? Se eliminarán también todos los documentos asociados.`,
    level: 'collection',
    childLabel: 'documentos',
  };

  navigateToCreate(): void {
    // Necesita seleccionar una subcomunidad primero
    this.router.navigate(['/grupos/subcomunidades']);
  }

  navigateToEdit(collection: Collection): void {
    const subcommunity = this.groupsService.getSubcommunityById(collection.subcommunityId);
    if (subcommunity) {
      this.router.navigate([
        '/grupos/comunidades',
        subcommunity.communityId,
        'subcomunidades',
        collection.subcommunityId,
        'colecciones',
        collection.id
      ]);
    }
  }

  navigateToItems(collection: Collection): void {
    const subcommunity = this.groupsService.getSubcommunityById(collection.subcommunityId);
    if (subcommunity) {
      this.router.navigate([
        '/grupos/comunidades',
        subcommunity.communityId,
        'subcomunidades',
        collection.subcommunityId,
        'colecciones',
        collection.id,
        'items'
      ]);
    }
  }

  openDeleteModal(collection: Collection): void {
    this.collectionToDelete.set(collection);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.collectionToDelete.set(null);
  }

  confirmDelete(): void {
    const collection = this.collectionToDelete();
    if (collection) {
      this.groupsService.deleteCollection(collection.id);
    }
    this.closeDeleteModal();
  }
}
