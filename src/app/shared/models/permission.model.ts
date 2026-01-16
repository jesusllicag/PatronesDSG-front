export interface Permission {
  id: number;
  name: string;
  description: string;
  module: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PermissionCreate {
  name: string;
  description: string;
  module: string;
}

export interface PermissionUpdate extends Partial<PermissionCreate> {
  id: number;
}
