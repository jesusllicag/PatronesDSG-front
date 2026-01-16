import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DynamicBreadcrumbComponent } from '../../../shared/components/common/dynamic-breadcrumb/dynamic-breadcrumb.component';
import { HierarchyCardComponent } from '../../../shared/components/cards/hierarchy-card/hierarchy-card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ConfirmModalComponent } from '../../../shared/components/ui/confirm-modal/confirm-modal.component';
import { GroupsService } from '../../../shared/services/groups.service';
import { BreadcrumbItem, Subcommunity, Community } from '../../../shared/models';

@Component({
  selector: 'app-subcommunities',
  standalone: true,
  imports: [
    CommonModule,
    DynamicBreadcrumbComponent,
    HierarchyCardComponent,
    ButtonComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './subcommunities.component.html',
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
      { label: 'Inicio', path: '/' },
      { label: 'Comunidades', path: '/grupos/comunidades' },
    ];
    const comm = this.community();
    if (comm) {
      items.push({ label: comm.name, path: `/grupos/comunidades/${comm.id}/subcomunidades` });
    }
    return items;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('communityId');
    if (id) {
      this.communityId.set(Number(id));
      const community = this.groupsService.getCommunityById(Number(id));
      if (community) {
        this.community.set(community);
      } else {
        this.router.navigate(['/grupos/comunidades']);
      }
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['/grupos/comunidades', this.communityId(), 'subcomunidades', 'nuevo']);
  }

  navigateToEdit(subcommunity: Subcommunity): void {
    this.router.navigate(['/grupos/comunidades', this.communityId(), 'subcomunidades', subcommunity.id]);
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
