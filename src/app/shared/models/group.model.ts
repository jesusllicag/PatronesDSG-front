export interface Community {
  id: number;
  name: string;
  description: string;
  logo?: string;
  subcommunities?: Subcommunity[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CommunityCreate {
  name: string;
  description: string;
  logo?: string;
}

export interface Subcommunity {
  id: number;
  name: string;
  description: string;
  communityId: number;
  community?: Community;
  collections?: Collection[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubcommunityCreate {
  name: string;
  description: string;
  communityId: number;
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  subcommunityId: number;
  subcommunity?: Subcommunity;
  itemCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CollectionCreate {
  name: string;
  description: string;
  subcommunityId: number;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: string;
}
