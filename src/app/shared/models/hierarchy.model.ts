import { Signal } from '@angular/core';

export type HierarchyLevel = 'community' | 'subcommunity' | 'collection';

export interface HierarchyEntity {
  id: number;
  name: string;
  description: string;
}

export interface HierarchyEntityWithCount extends HierarchyEntity {
  childCount?: number;
}

export interface HierarchyConfig<T extends HierarchyEntity> {
  title: string;
  description: string;
  emptyStateMessage: string;
  emptyStateIcon: string;
  createButtonLabel: string;
  deleteModalTitle: string;
  deleteModalMessage: (entity: T) => string;
  level: HierarchyLevel;
  childLabel: string;
}
