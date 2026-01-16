import { Component, inject, signal, computed, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HierarchyListComponent } from "../../../shared/components/common/hierarchy-list/hierarchy-list.component";
import { GroupsService } from "../../../shared/services/groups.service";
import {
  BreadcrumbItem,
  Collection,
  Subcommunity,
  Community,
  HierarchyConfig,
} from "../../../shared/models";

@Component({
  selector: "app-collections",
  standalone: true,
  imports: [HierarchyListComponent],
  template: `
    <app-hierarchy-list
      [breadcrumbItems]="breadcrumbItems()"
      [currentPage]="currentPageTitle()"
      [config]="hierarchyConfig()"
      [entities]="collections()"
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
export class CollectionsComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);

  communityId = signal<number>(0);
  subcommunityId = signal<number>(0);
  community = signal<Community | null>(null);
  subcommunity = signal<Subcommunity | null>(null);

  collections = computed(() => {
    const id = this.subcommunityId();
    if (!id) return [];
    return this.groupsService.getCollectionsBySubcommunity(id)();
  });

  isDeleteModalOpen = signal(false);
  collectionToDelete = signal<Collection | null>(null);

  breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      { label: "Inicio", path: "/" },
      { label: "Comunidades", path: "/grupos/comunidades" },
    ];
    const comm = this.community();
    const subcomm = this.subcommunity();
    if (comm) {
      items.push({
        label: comm.name,
        path: `/grupos/comunidades/${comm.id}/subcomunidades`,
      });
    }
    if (subcomm) {
      items.push({
        label: subcomm.name,
        path: `/grupos/comunidades/${this.communityId()}/subcomunidades/${subcomm.id}/colecciones`,
      });
    }
    return items;
  });

  currentPageTitle = computed(() => "Colecciones");

  hierarchyConfig = computed<HierarchyConfig<Collection>>(() => ({
    title: `Colecciones de ${this.subcommunity()?.name || ""}`,
    description: "Gestiona las colecciones dentro de esta subcomunidad",
    emptyStateMessage: "No hay colecciones",
    emptyStateIcon: `<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"/>
    </svg>`,
    createButtonLabel: "Nueva Colección",
    deleteModalTitle: "Eliminar Colección",
    deleteModalMessage: (collection) =>
      `¿Estás seguro de eliminar la colección ${collection.name}? Se eliminarán también todos los documentos asociados.`,
    level: "collection",
    childLabel: "documentos",
  }));

  ngOnInit(): void {
    const communityId = this.route.snapshot.paramMap.get("communityId");
    const subcommunityId = this.route.snapshot.paramMap.get("subcommunityId");

    if (communityId) {
      this.communityId.set(Number(communityId));
      const community = this.groupsService.getCommunityById(
        Number(communityId),
      );
      if (community) {
        this.community.set(community);
      } else {
        this.router.navigate(["/grupos/comunidades"]);
        return;
      }
    }

    if (subcommunityId) {
      this.subcommunityId.set(Number(subcommunityId));
      const subcommunity = this.groupsService.getSubcommunityById(
        Number(subcommunityId),
      );
      if (subcommunity) {
        this.subcommunity.set(subcommunity);
      } else {
        this.router.navigate([
          "/grupos/comunidades",
          this.communityId(),
          "subcomunidades",
        ]);
        return;
      }
    }
  }

  navigateToCreate(): void {
    this.router.navigate([
      "/grupos/comunidades",
      this.communityId(),
      "subcomunidades",
      this.subcommunityId(),
      "colecciones",
      "nuevo",
    ]);
  }

  navigateToEdit(collection: Collection): void {
    this.router.navigate([
      "/grupos/comunidades",
      this.communityId(),
      "subcomunidades",
      this.subcommunityId(),
      "colecciones",
      collection.id,
    ]);
  }

  navigateToItems(collection: Collection): void {
    this.router.navigate([
      "/grupos/comunidades",
      this.communityId(),
      "subcomunidades",
      this.subcommunityId(),
      "colecciones",
      collection.id,
      "items",
    ]);
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
