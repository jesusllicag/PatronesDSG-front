import { Role } from './role.model';

export type UserStatus = 'Activo' | 'Pendiente' | 'Rechazado';

export interface User {
  id: number;
  name: string;
  email: string;
  image?: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  roleId: number;
  image?: string;
}

export interface UserUpdate {
  id: number;
  name?: string;
  email?: string;
  roleId?: number;
  image?: string;
}

export interface UserStatusChange {
  id: number;
  status: UserStatus;
}
