import { Component, inject, signal, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { DynamicBreadcrumbComponent } from "../../../../shared/components/common/dynamic-breadcrumb/dynamic-breadcrumb.component";
import { ButtonComponent } from "../../../../shared/components/ui/button/button.component";
import { LabelComponent } from "../../../../shared/components/form/label/label.component";
import { GroupsService } from "../../../../shared/services/groups.service";
import {
  BreadcrumbItem,
  CollectionCreate,
  Community,
  Subcommunity,
} from "../../../../shared/models";
import { InputFieldComponent } from "../../../../shared/components/form/input/input-field.component";
import { TextAreaComponent } from "../../../../shared/components/form/input/text-area.component";

@Component({
  selector: "app-collection-form",
  standalone: true,
  imports: [
    CommonModule,
    DynamicBreadcrumbComponent,
    ButtonComponent,
    InputFieldComponent,
    TextAreaComponent,
    LabelComponent,
  ],
  templateUrl: "./collection-form.component.html",
})
export class CollectionFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private groupsService = inject(GroupsService);

  isEditing = signal(false);
  communityId = signal<number>(0);
  subcommunityId = signal<number>(0);
  collectionId = signal<number | null>(null);
  community = signal<Community | null>(null);
  subcommunity = signal<Subcommunity | null>(null);

  formData = signal<CollectionCreate>({
    name: "",
    description: "",
    subcommunityId: 0,
  });

  breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      { label: "Inicio", path: "/" },
      { label: "Comunidades", path: "/grupos/comunidades" },
    ];
    const comm = this.community();
    const subcomm = this.subcommunity();
    if (comm) {
      items.push({
        label: comm.name,
        path: `/grupos/comunidades/${comm.id}/subcomunidades`,
      });
    }
    if (subcomm) {
      items.push({
        label: subcomm.name,
        path: `/grupos/comunidades/${this.communityId()}/subcomunidades/${subcomm.id}/colecciones`,
      });
    }
    return items;
  });

  pageTitle = signal("Nueva Colección");

  ngOnInit(): void {
    const communityId = this.route.snapshot.paramMap.get("communityId");
    const subcommunityId = this.route.snapshot.paramMap.get("subcommunityId");
    const id = this.route.snapshot.paramMap.get("id");

    if (communityId) {
      this.communityId.set(Number(communityId));
      const community = this.groupsService.getCommunityById(
        Number(communityId),
      );
      if (community) {
        this.community.set(community);
      } else {
        this.router.navigate(["/grupos/comunidades"]);
        return;
      }
    }

    if (subcommunityId) {
      this.subcommunityId.set(Number(subcommunityId));
      const subcommunity = this.groupsService.getSubcommunityById(
        Number(subcommunityId),
      );
      if (subcommunity) {
        this.subcommunity.set(subcommunity);
        this.formData.update((data) => ({
          ...data,
          subcommunityId: Number(subcommunityId),
        }));
      } else {
        this.router.navigate([
          "/grupos/comunidades",
          this.communityId(),
          "subcomunidades",
        ]);
        return;
      }
    }

    if (id && id !== "nuevo") {
      this.isEditing.set(true);
      this.collectionId.set(Number(id));
      this.pageTitle.set("Editar Colección");

      const collection = this.groupsService.getCollectionById(Number(id));
      if (collection) {
        this.formData.set({
          name: collection.name,
          description: collection.description,
          subcommunityId: collection.subcommunityId,
        });
      } else {
        this.navigateBack();
      }
    }
  }

  updateFormField(field: keyof CollectionCreate, value: string | number): void {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  onSubmit(): void {
    const data = this.formData();

    if (!data.name.trim()) return;

    if (this.isEditing()) {
      const id = this.collectionId();
      if (id) {
        this.groupsService.updateCollection(id, data);
      }
    } else {
      this.groupsService.createCollection(data);
    }

    this.navigateBack();
  }

  onCancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate([
      "/grupos/comunidades",
      this.communityId(),
      "subcomunidades",
      this.subcommunityId(),
      "colecciones",
    ]);
  }
}
