type Role = {
  id: number;
  name: string;
  claims: string[];
};

export type RoleCreateRequest = Role;

export type RoleUpdateRequest = Role;

export type RoleGetResponse = Role;
