export interface Roles {
  role_name: string;
  permissions: any;
}

export interface UserType {
  username: string;
  avatar?: string;
  id?: string;
  email?: string;
  createdAt?: string;

  roles?: Roles[];
  phone_number?: string;
}
