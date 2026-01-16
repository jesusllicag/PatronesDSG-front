import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { DynamicBreadcrumbComponent } from "../../../../shared/components/common/dynamic-breadcrumb/dynamic-breadcrumb.component";
import { ButtonComponent } from "../../../../shared/components/ui/button/button.component";
import { LabelComponent } from "../../../../shared/components/form/label/label.component";
import { GroupsService } from "../../../../shared/services/groups.service";
import { BreadcrumbItem, CommunityCreate } from "../../../../shared/models";
import { InputFieldComponent } from "../../../../shared/components/form/input/input-field.component";
import { TextAreaComponent } from "../../../../shared/components/form/input/text-area.component";

@Component({
  selector: "app-community-form",
  standalone: true,
  imports: [
    CommonModule,
    DynamicBreadcrumbComponent,
    ButtonComponent,
    InputFieldComponent,
    TextAreaComponent,
    LabelComponent,
  ],
  templateUrl: "./community-form.component.html",
})
export class CommunityFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);

  isEditing = signal(false);
  communityId = signal<number | null>(null);

  formData = signal<CommunityCreate>({
    name: "",
    description: "",
  });

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: "Inicio", path: "/" },
    { label: "Comunidades", path: "/grupos/comunidades" },
  ]);

  pageTitle = signal("Nueva Comunidad");

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");

    if (id && id !== "nuevo") {
      this.isEditing.set(true);
      this.communityId.set(Number(id));
      this.pageTitle.set("Editar Comunidad");

      const community = this.groupsService.getCommunityById(Number(id));
      if (community) {
        this.formData.set({
          name: community.name,
          description: community.description,
        });
      } else {
        this.router.navigate(["/grupos/comunidades"]);
      }
    }
  }

  updateFormField(field: keyof CommunityCreate, value: string): void {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  onSubmit(): void {
    const data = this.formData();

    if (!data.name.trim()) return;

    if (this.isEditing()) {
      const id = this.communityId();
      if (id) {
        this.groupsService.updateCommunity(id, data);
      }
    } else {
      this.groupsService.createCommunity(data);
    }

    this.router.navigate(["/grupos/comunidades"]);
  }

  onCancel(): void {
    this.router.navigate(["/grupos/comunidades"]);
  }
}
