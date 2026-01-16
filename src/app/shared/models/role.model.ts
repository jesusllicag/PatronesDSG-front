import { Permission } from './permission.model';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RoleCreate {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface RoleUpdate extends Partial<RoleCreate> {
  id: number;
}
