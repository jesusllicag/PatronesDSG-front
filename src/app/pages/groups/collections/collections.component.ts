import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DynamicBreadcrumbComponent } from '../../../shared/components/common/dynamic-breadcrumb/dynamic-breadcrumb.component';
import { HierarchyCardComponent } from '../../../shared/components/cards/hierarchy-card/hierarchy-card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ConfirmModalComponent } from '../../../shared/components/ui/confirm-modal/confirm-modal.component';
import { GroupsService } from '../../../shared/services/groups.service';
import { BreadcrumbItem, Collection, Subcommunity, Community } from '../../../shared/models';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [
    CommonModule,
    DynamicBreadcrumbComponent,
    HierarchyCardComponent,
    ButtonComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './collections.component.html',
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
      { label: 'Inicio', path: '/' },
      { label: 'Comunidades', path: '/grupos/comunidades' },
    ];
    const comm = this.community();
    const subcomm = this.subcommunity();
    if (comm) {
      items.push({
        label: comm.name,
        path: `/grupos/comunidades/${comm.id}/subcomunidades`
      });
    }
    if (subcomm) {
      items.push({
        label: subcomm.name,
        path: `/grupos/comunidades/${this.communityId()}/subcomunidades/${subcomm.id}/colecciones`
      });
    }
    return items;
  });

  ngOnInit(): void {
    const communityId = this.route.snapshot.paramMap.get('communityId');
    const subcommunityId = this.route.snapshot.paramMap.get('subcommunityId');

    if (communityId) {
      this.communityId.set(Number(communityId));
      const community = this.groupsService.getCommunityById(Number(communityId));
      if (community) {
        this.community.set(community);
      } else {
        this.router.navigate(['/grupos/comunidades']);
        return;
      }
    }

    if (subcommunityId) {
      this.subcommunityId.set(Number(subcommunityId));
      const subcommunity = this.groupsService.getSubcommunityById(Number(subcommunityId));
      if (subcommunity) {
        this.subcommunity.set(subcommunity);
      } else {
        this.router.navigate(['/grupos/comunidades', this.communityId(), 'subcomunidades']);
        return;
      }
    }
  }

  navigateToCreate(): void {
    this.router.navigate([
      '/grupos/comunidades',
      this.communityId(),
      'subcomunidades',
      this.subcommunityId(),
      'colecciones',
      'nuevo'
    ]);
  }

  navigateToEdit(collection: Collection): void {
    this.router.navigate([
      '/grupos/comunidades',
      this.communityId(),
      'subcomunidades',
      this.subcommunityId(),
      'colecciones',
      collection.id
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

  getCollectionPath(collection: Collection): string {
    // Collections are the final level, so they navigate to their detail/items view
    return `/grupos/comunidades/${this.communityId()}/subcomunidades/${this.subcommunityId()}/colecciones/${collection.id}/items`;
  }
}
