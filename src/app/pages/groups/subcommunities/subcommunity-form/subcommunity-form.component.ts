import { Component, inject, signal, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { DynamicBreadcrumbComponent } from "../../../../shared/components/common/dynamic-breadcrumb/dynamic-breadcrumb.component";
import { ButtonComponent } from "../../../../shared/components/ui/button/button.component";
import { InputFieldComponent } from "../../../../shared/components/form/input/input-field.component";
import { TextAreaComponent } from "../../../../shared/components/form/input/text-area.component";
import { LabelComponent } from "../../../../shared/components/form/label/label.component";
import { GroupsService } from "../../../../shared/services/groups.service";
import {
  BreadcrumbItem,
  SubcommunityCreate,
  Community,
} from "../../../../shared/models";

@Component({
  selector: "app-subcommunity-form",
  standalone: true,
  imports: [
    CommonModule,
    DynamicBreadcrumbComponent,
    ButtonComponent,
    InputFieldComponent,
    TextAreaComponent,
    LabelComponent,
  ],
  templateUrl: "./subcommunity-form.component.html",
})
export class SubcommunityFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);

  isEditing = signal(false);
  communityId = signal<number>(0);
  subcommunityId = signal<number | null>(null);
  community = signal<Community | null>(null);

  formData = signal<SubcommunityCreate>({
    name: "",
    description: "",
    communityId: 0,
  });

  breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      { label: "Inicio", path: "/" },
      { label: "Comunidades", path: "/grupos/comunidades" },
    ];
    const comm = this.community();
    if (comm) {
      items.push({
        label: comm.name,
        path: `/grupos/comunidades/${comm.id}/subcomunidades`,
      });
    }
    return items;
  });

  pageTitle = signal("Nueva Subcomunidad");

  ngOnInit(): void {
    const communityId = this.route.snapshot.paramMap.get("communityId");
    const id = this.route.snapshot.paramMap.get("id");

    if (communityId) {
      this.communityId.set(Number(communityId));
      const community = this.groupsService.getCommunityById(
        Number(communityId),
      );
      if (community) {
        this.community.set(community);
        this.formData.update((data) => ({
          ...data,
          communityId: Number(communityId),
        }));
      } else {
        this.router.navigate(["/grupos/comunidades"]);
        return;
      }
    }

    if (id && id !== "nuevo") {
      this.isEditing.set(true);
      this.subcommunityId.set(Number(id));
      this.pageTitle.set("Editar Subcomunidad");

      const subcommunity = this.groupsService.getSubcommunityById(Number(id));
      if (subcommunity) {
        this.formData.set({
          name: subcommunity.name,
          description: subcommunity.description,
          communityId: subcommunity.communityId,
        });
      } else {
        this.router.navigate([
          "/grupos/comunidades",
          this.communityId(),
          "subcomunidades",
        ]);
      }
    }
  }

  updateFormField(
    field: keyof SubcommunityCreate,
    value: string | number,
  ): void {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  onSubmit(): void {
    const data = this.formData();

    if (!data.name.trim()) return;

    if (this.isEditing()) {
      const id = this.subcommunityId();
      if (id) {
        this.groupsService.updateSubcommunity(id, data);
      }
    } else {
      this.groupsService.createSubcommunity(data);
    }

    this.router.navigate([
      "/grupos/comunidades",
      this.communityId(),
      "subcomunidades",
    ]);
  }

  onCancel(): void {
    this.router.navigate([
      "/grupos/comunidades",
      this.communityId(),
      "subcomunidades",
    ]);
  }
}
