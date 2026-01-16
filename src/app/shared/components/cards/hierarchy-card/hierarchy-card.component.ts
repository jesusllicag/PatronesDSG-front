import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type HierarchyLevel = 'community' | 'subcommunity' | 'collection';

@Component({
  selector: 'app-hierarchy-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hierarchy-card.component.html',
})
export class HierarchyCardComponent {
  title = input.required<string>();
  description = input<string>('');
  level = input.required<HierarchyLevel>();
  navigateTo = input<string>('');
  childCount = input<number>(0);
  childLabel = input<string>('elementos');

  edit = output<void>();
  delete = output<void>();

  onEdit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.edit.emit();
  }

  onDelete(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.delete.emit();
  }

  get levelConfig() {
    const configs = {
      community: {
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>`,
        bgColor: 'bg-brand-50 dark:bg-brand-500/10',
        iconColor: 'text-brand-500',
        borderColor: 'border-brand-100 dark:border-brand-500/20',
      },
      subcommunity: {
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
        </svg>`,
        bgColor: 'bg-success-50 dark:bg-success-500/10',
        iconColor: 'text-success-500',
        borderColor: 'border-success-100 dark:border-success-500/20',
      },
      collection: {
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"/>
        </svg>`,
        bgColor: 'bg-warning-50 dark:bg-warning-500/10',
        iconColor: 'text-warning-500',
        borderColor: 'border-warning-100 dark:border-warning-500/20',
      },
    };
    return configs[this.level()];
  }
}
