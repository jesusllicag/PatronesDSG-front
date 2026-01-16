import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbItem } from '../../../models';

@Component({
  selector: 'app-dynamic-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dynamic-breadcrumb.component.html',
})
export class DynamicBreadcrumbComponent {
  items = input.required<BreadcrumbItem[]>();
  currentPage = input.required<string>();
}
