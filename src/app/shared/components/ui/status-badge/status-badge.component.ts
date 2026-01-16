import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStatus } from '../../../models';

type StatusConfig = {
  bg: string;
  text: string;
  dot: string;
  label: string;
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {
  status = input.required<UserStatus>();
  showDot = input<boolean>(true);

  private statusConfig: Record<UserStatus, StatusConfig> = {
    'Activo': {
      bg: 'bg-success-50 dark:bg-success-500/15',
      text: 'text-success-600 dark:text-success-400',
      dot: 'bg-success-500',
      label: 'Activo',
    },
    'Pendiente': {
      bg: 'bg-warning-50 dark:bg-warning-500/15',
      text: 'text-warning-600 dark:text-warning-400',
      dot: 'bg-warning-500',
      label: 'Pendiente',
    },
    'Rechazado': {
      bg: 'bg-error-50 dark:bg-error-500/15',
      text: 'text-error-600 dark:text-error-400',
      dot: 'bg-error-500',
      label: 'Rechazado',
    },
  };

  config = computed(() => this.statusConfig[this.status()]);
}
