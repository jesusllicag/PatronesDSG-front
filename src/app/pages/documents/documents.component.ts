import { Component } from "@angular/core";
import { ComponentCardComponent } from "../../shared/components/common/component-card/component-card.component";
import { PageBreadcrumbComponent } from "../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { DocumentsTableComponent } from "../../shared/components/tables/documents-table/documents-table.component";

@Component({
  selector: "app-documents",
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    DocumentsTableComponent,
  ],
  templateUrl: "./documents.component.html",
  styleUrl: "./documents.component.css",
})
export class DocumentsComponent {}
