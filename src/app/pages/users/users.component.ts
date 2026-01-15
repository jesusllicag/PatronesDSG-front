import { Component } from "@angular/core";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { ComponentCardComponent } from "../../shared/components/common/component-card/component-card.component";
import { UsersTableComponent } from "../../shared/components/tables/users-table/users-table.component";

@Component({
  selector: "app-users",
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    UsersTableComponent,
  ],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.css",
})
export class UsersComponent {}
