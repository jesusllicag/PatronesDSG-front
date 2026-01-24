import { Routes } from "@angular/router";
import { EcommerceComponent } from "./pages/dashboard/ecommerce/ecommerce.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { FormElementsComponent } from "./pages/forms/form-elements/form-elements.component";
import { BasicTablesComponent } from "./pages/tables/basic-tables/basic-tables.component";
import { BlankComponent } from "./pages/blank/blank.component";
import { NotFoundComponent } from "./pages/other-page/not-found/not-found.component";
import { AppLayoutComponent } from "./shared/layout/app-layout/app-layout.component";
import { InvoicesComponent } from "./pages/invoices/invoices.component";
import { LineChartComponent } from "./pages/charts/line-chart/line-chart.component";
import { BarChartComponent } from "./pages/charts/bar-chart/bar-chart.component";
import { AlertsComponent } from "./pages/ui-elements/alerts/alerts.component";
import { AvatarElementComponent } from "./pages/ui-elements/avatar-element/avatar-element.component";
import { BadgesComponent } from "./pages/ui-elements/badges/badges.component";
import { ButtonsComponent } from "./pages/ui-elements/buttons/buttons.component";
import { ImagesComponent } from "./pages/ui-elements/images/images.component";
import { VideosComponent } from "./pages/ui-elements/videos/videos.component";
import { SignInComponent } from "./pages/auth-pages/sign-in/sign-in.component";
import { SignUpComponent } from "./pages/auth-pages/sign-up/sign-up.component";
import { CalenderComponent } from "./pages/calender/calender.component";
import { UsersComponent } from "./pages/users/users.component";
import { DocumentsComponent } from "./pages/documents/documents.component";
import { RolesComponent } from "./pages/policies/roles/roles.component";
import { PermissionsComponent } from "./pages/policies/permissions/permissions.component";
import { CommunitiesComponent } from "./pages/groups/communities/communities.component";
import { CommunityFormComponent } from "./pages/groups/communities/community-form/community-form.component";
import { SubcommunitiesComponent } from "./pages/groups/subcommunities/subcommunities.component";
import { SubcommunityFormComponent } from "./pages/groups/subcommunities/subcommunity-form/subcommunity-form.component";
import { CollectionsComponent } from "./pages/groups/collections/collections.component";
import { CollectionFormComponent } from "./pages/groups/collections/collection-form/collection-form.component";
import { AllSubcommunitiesComponent } from "./pages/groups/all-subcommunities/all-subcommunities.component";
import { AllCollectionsComponent } from "./pages/groups/all-collections/all-collections.component";
import { LicensesComponent } from "./pages/licenses/licenses.component";

export const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        component: EcommerceComponent,
        pathMatch: "full",
        title:
          "Angular Ecommerce Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "usuarios",
        component: UsersComponent,
        pathMatch: "full",
        title: "Usuarios",
      },
      {
        path: "documentos",
        component: DocumentsComponent,
        pathMatch: "full",
        title: "Documentos",
      },
      {
        path: "roles",
        component: RolesComponent,
        pathMatch: "full",
        title: "Roles",
      },
      {
        path: "permisos",
        component: PermissionsComponent,
        pathMatch: "full",
        title: "Permisos",
      },
      // Groups - Hierarchical navigation
      // Global views
      {
        path: "grupos/comunidades",
        component: CommunitiesComponent,
        title: "Comunidades",
      },
      {
        path: "grupos/subcomunidades",
        component: AllSubcommunitiesComponent,
        title: "Subcomunidades",
      },
      {
        path: "grupos/colecciones",
        component: AllCollectionsComponent,
        title: "Colecciones",
      },
      {
        path: "grupos/comunidades/nuevo",
        component: CommunityFormComponent,
        title: "Nueva Comunidad",
      },
      {
        path: "grupos/comunidades/:id",
        component: CommunityFormComponent,
        title: "Editar Comunidad",
      },
      {
        path: "grupos/comunidades/:communityId/subcomunidades",
        component: SubcommunitiesComponent,
        title: "Subcomunidades",
      },
      {
        path: "grupos/comunidades/:communityId/subcomunidades/nuevo",
        component: SubcommunityFormComponent,
        title: "Nueva Subcomunidad",
      },
      {
        path: "grupos/comunidades/:communityId/subcomunidades/:id",
        component: SubcommunityFormComponent,
        title: "Editar Subcomunidad",
      },
      {
        path: "grupos/comunidades/:communityId/subcomunidades/:subcommunityId/colecciones",
        component: CollectionsComponent,
        title: "Colecciones",
      },
      {
        path: "grupos/comunidades/:communityId/subcomunidades/:subcommunityId/colecciones/nuevo",
        component: CollectionFormComponent,
        title: "Nueva Colección",
      },
      {
        path: "grupos/comunidades/:communityId/subcomunidades/:subcommunityId/colecciones/:id",
        component: CollectionFormComponent,
        title: "Editar Colección",
      },
      {
        path: "licencias",
        component: LicensesComponent,
        pathMatch: "full",
        title: "Licencias",
      },
      {
        path: "calendar",
        component: CalenderComponent,
        title:
          "Angular Calender | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "profile",
        component: ProfileComponent,
        title:
          "Angular Profile Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "form-elements",
        component: FormElementsComponent,
        title:
          "Angular Form Elements Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "basic-tables",
        component: BasicTablesComponent,
        title:
          "Angular Basic Tables Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "blank",
        component: BlankComponent,
        title:
          "Angular Blank Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      // support tickets
      {
        path: "invoice",
        component: InvoicesComponent,
        title:
          "Angular Invoice Details Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "line-chart",
        component: LineChartComponent,
        title:
          "Angular Line Chart Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "bar-chart",
        component: BarChartComponent,
        title:
          "Angular Bar Chart Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "alerts",
        component: AlertsComponent,
        title:
          "Angular Alerts Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "avatars",
        component: AvatarElementComponent,
        title:
          "Angular Avatars Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "badge",
        component: BadgesComponent,
        title:
          "Angular Badges Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "buttons",
        component: ButtonsComponent,
        title:
          "Angular Buttons Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "images",
        component: ImagesComponent,
        title:
          "Angular Images Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
      {
        path: "videos",
        component: VideosComponent,
        title:
          "Angular Videos Dashboard | TailAdmin - Angular Admin Dashboard Template",
      },
    ],
  },
  // auth pages
  {
    path: "signin",
    component: SignInComponent,
    title:
      "Angular Sign In Dashboard | TailAdmin - Angular Admin Dashboard Template",
  },
  {
    path: "signup",
    component: SignUpComponent,
    title:
      "Angular Sign Up Dashboard | TailAdmin - Angular Admin Dashboard Template",
  },
  // error pages
  {
    path: "**",
    component: NotFoundComponent,
    title:
      "Angular NotFound Dashboard | TailAdmin - Angular Admin Dashboard Template",
  },
];
