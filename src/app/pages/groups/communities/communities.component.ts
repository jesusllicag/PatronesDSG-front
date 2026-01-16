import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DynamicBreadcrumbComponent } from '../../../shared/components/common/dynamic-breadcrumb/dynamic-breadcrumb.component';
import { HierarchyCardComponent } from '../../../shared/components/cards/hierarchy-card/hierarchy-card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { ConfirmModalComponent } from '../../../shared/components/ui/confirm-modal/confirm-modal.component';
import { GroupsService } from '../../../shared/services/groups.service';
import { BreadcrumbItem, Community } from '../../../shared/models';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [
    CommonModule,
    DynamicBreadcrumbComponent,
    HierarchyCardComponent,
    ButtonComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './communities.component.html',
})
export class CommunitiesComponent {
  private router = inject(Router);
  private groupsService = inject(GroupsService);

  communities = this.groupsService.communitiesWithCount;

  isDeleteModalOpen = signal(false);
  communityToDelete = signal<Community | null>(null);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', path: '/' },
  ];

  navigateToCreate(): void {
    this.router.navigate(['/grupos/comunidades/nuevo']);
  }

  navigateToEdit(community: Community): void {
    this.router.navigate(['/grupos/comunidades', community.id]);
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
