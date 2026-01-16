import { Component, input, output, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DynamicBreadcrumbComponent } from "../dynamic-breadcrumb/dynamic-breadcrumb.component";
import { HierarchyCardComponent } from "../../cards/hierarchy-card/hierarchy-card.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { ConfirmModalComponent } from "../../ui/confirm-modal/confirm-modal.component";
import {
  BreadcrumbItem,
  HierarchyConfig,
  HierarchyEntityWithCount,
} from "../../../models";

@Component({
  selector: "app-hierarchy-list",
  standalone: true,
  imports: [
    CommonModule,
    DynamicBreadcrumbComponent,
    HierarchyCardComponent,
    ButtonComponent,
    ConfirmModalComponent,
  ],
  templateUrl: "./hierarchy-list.component.html",
})
export class HierarchyListComponent<T extends HierarchyEntityWithCount> {
  // Inputs
  breadcrumbItems = input.required<BreadcrumbItem[]>();
  currentPage = input.required<string>();
  config = input.required<HierarchyConfig<T>>();
  entities = input.required<T[]>();
  isDeleteModalOpen = input.required<boolean>();
  entityToDelete = input<T | null>(null);

  // Outputs
  create = output<void>();
  edit = output<T>();
  deleteEntity = output<T>();
  confirmDelete = output<void>();
  cancelDelete = output<void>();
  navigate = output<T>();

  // Computed
  deleteMessage = computed(() => {
    const entity = this.entityToDelete();
    if (!entity) return "";
    return this.config().deleteModalMessage(entity);
  });

  onCardNavigate(entity: T): void {
    this.navigate.emit(entity);
  }

  onEdit(entity: T): void {
    this.edit.emit(entity);
  }

  onDelete(entity: T): void {
    this.deleteEntity.emit(entity);
  }

  onConfirmDelete(): void {
    this.confirmDelete.emit();
  }

  onCancelDelete(): void {
    this.cancelDelete.emit();
  }
}
