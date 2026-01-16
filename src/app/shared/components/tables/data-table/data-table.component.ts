import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => string;
}

export interface TableAction {
  icon: string;
  label: string;
  action: string;
  color?: 'primary' | 'danger' | 'warning' | 'success';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent<T extends { id: number }> {
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  actions = input<TableAction[]>([]);
  loading = input<boolean>(false);
  emptyMessage = input<string>('No hay registros disponibles');

  actionClick = output<{ action: string; item: T }>();

  trackById = (_index: number, item: T) => item.id;

  getCellValue(item: T, column: TableColumn<T>): string {
    if (column.render) {
      return column.render(item);
    }
    const keys = (column.key as string).split('.');
    let value: unknown = item;
    for (const key of keys) {
      value = (value as Record<string, unknown>)?.[key];
    }
    return String(value ?? '');
  }

  onActionClick(action: string, item: T): void {
    this.actionClick.emit({ action, item });
  }

  getActionColorClasses(color?: string): string {
    const colors: Record<string, string> = {
      primary: 'text-brand-500 hover:text-brand-600 dark:text-brand-400',
      danger: 'text-error-500 hover:text-error-600 dark:text-error-400',
      warning: 'text-warning-500 hover:text-warning-600 dark:text-warning-400',
      success: 'text-success-500 hover:text-success-600 dark:text-success-400',
    };
    return colors[color ?? 'primary'] ?? colors['primary'];
  }
}
