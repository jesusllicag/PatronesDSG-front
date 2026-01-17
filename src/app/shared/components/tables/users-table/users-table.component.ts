import { Component } from "@angular/core";
import { BadgeComponent } from "../../ui/badge/badge.component";
import { CommonModule } from "@angular/common";
import { TableDropdownComponent } from "../../common/table-dropdown/table-dropdown.component";
import { ButtonComponent } from "../../ui/button/button.component";

interface User {
  id: number;
  image: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

@Component({
  selector: "app-users-table",
  imports: [
    CommonModule,
    ButtonComponent,
    TableDropdownComponent,
    BadgeComponent,
  ],
  templateUrl: "./users-table.component.html",
  styleUrl: "./users-table.component.css",
})
export class UsersTableComponent {
  tableData: User[] = [
    {
      id: 1,
      image: "images/user/user-17.jpg",
      name: "Lindsey Curtis",
      email: "lindcurtis@mail.com",
      role: "Web Designer",
      status: "Activo",
      createdAt: "2024-12-11",
    },
    {
      id: 2,
      image: "images/user/user-18.jpg",
      name: "Kaiya George",
      email: "kaiyageorge@mail.com",
      role: "Project Manager",
      status: "Pendiente",
      createdAt: "2023-01-25",
    },
    {
      id: 3,
      image: "images/user/user-17.jpg",
      name: "Zain Geidt",
      email: "zaingeidt@mail.com",
      role: "Content Writer",
      status: "Activo",
      createdAt: "2026-09-03",
    },
    {
      id: 4,
      image: "images/user/user-20.jpg",
      name: "Abram Schleifer",
      email: "abramschiefer@mail.com",
      role: "Digital Marketer",
      status: "Activo",
      createdAt: "2023-01-01",
    },
    {
      id: 5,
      image: "images/user/user-21.jpg",
      name: "Carla George",
      email: "carlag@mail.com",
      role: "Front-end Developer",
      status: "Rechazado",
      createdAt: "2026-01-15",
    },
  ];

  currentPage = 1;
  itemsPerPage = 4;

  get totalPages(): number {
    return Math.ceil(this.tableData.length / this.itemsPerPage);
  }

  get currentItems(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.tableData.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  handleViewMore(item: User) {
    // logic here
    console.log("View More:", item);
  }

  handleDelete(item: User) {
    // logic here
    console.log("Delete:", item);
  }

  getBadgeColor(status: string): "success" | "warning" | "error" {
    if (status === "Activo") return "success";
    if (status === "Pendiente") return "warning";
    return "error";
  }
}
