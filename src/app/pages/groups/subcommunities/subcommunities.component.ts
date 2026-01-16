import { Component, inject, signal, computed, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HierarchyListComponent } from "../../../shared/components/common/hierarchy-list/hierarchy-list.component";
import { GroupsService } from "../../../shared/services/groups.service";
import {
  BreadcrumbItem,
  Subcommunity,
  Community,
  HierarchyConfig,
} from "../../../shared/models";

@Component({
  selector: "app-subcommunities",
  standalone: true,
  imports: [HierarchyListComponent],
  template: `
    <app-hierarchy-list
      [breadcrumbItems]="breadcrumbItems()"
      [currentPage]="currentPageTitle()"
      [config]="hierarchyConfig()"
      [entities]="subcommunities()"
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
export class SubcommunitiesComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);

  communityId = signal<number>(0);
  community = signal<Community | null>(null);

  subcommunities = computed(() => {
    const id = this.communityId();
    if (!id) return [];
    return this.groupsService.getSubcommunitiesByCommunity(id)();
  });

  isDeleteModalOpen = signal(false);
  subcommunityToDelete = signal<Subcommunity | null>(null);

  breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      { label: "Inicio", path: "/" },
      { label: "Comunidades", path: "/grupos/comunidades" },
    ];
    const comm = this.community();
    if (comm) {
      items.push({
        label: comm.name,
        path: `/grupos/comunidades/${comm.id}/subcomunidades`,
      });
    }
    return items;
  });

  currentPageTitle = computed(() => "Subcomunidades");

  hierarchyConfig = computed<HierarchyConfig<Subcommunity>>(() => ({
    title: `Subcomunidades de ${this.community()?.name || ""}`,
    description: "Gestiona las subcomunidades dentro de esta comunidad",
    emptyStateMessage: "No hay subcomunidades",
    emptyStateIcon: `<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
    </svg>`,
    createButtonLabel: "Nueva Subcomunidad",
    deleteModalTitle: "Eliminar Subcomunidad",
    deleteModalMessage: (subcommunity) =>
      `¿Estás seguro de eliminar la subcomunidad ${subcommunity.name}? Se eliminarán también todas sus colecciones.`,
    level: "subcommunity",
    childLabel: "colecciones",
  }));

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("communityId");
    if (id) {
      this.communityId.set(Number(id));
      const community = this.groupsService.getCommunityById(Number(id));
      if (community) {
        this.community.set(community);
      } else {
        this.router.navigate(["/grupos/comunidades"]);
      }
    }
  }

  navigateToCreate(): void {
    this.router.navigate([
      "/grupos/comunidades",
      this.communityId(),
      "subcomunidades",
      "nuevo",
    ]);
  }

  navigateToEdit(subcommunity: Subcommunity): void {
    this.router.navigate([
      "/grupos/comunidades",
      this.communityId(),
      "subcomunidades",
      subcommunity.id,
    ]);
  }

  navigateToCollections(subcommunity: Subcommunity): void {
    this.router.navigate([
      "/grupos/comunidades",
      this.communityId(),
      "subcomunidades",
      subcommunity.id,
      "colecciones",
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
