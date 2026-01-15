import { Component } from "@angular/core";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { BasicTableOneComponent } from "../../shared/components/tables/basic-tables/basic-table-one/basic-table-one.component";
import { ComponentCardComponent } from "../../shared/components/common/component-card/component-card.component";

@Component({
  selector: "app-users",
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    BasicTableOneComponent,
  ],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.css",
})
export class UsersComponent {}
