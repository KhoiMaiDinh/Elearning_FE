export interface Roles {
  role_name: string;
  permissions: any;
}

export interface UserType {
  username: string;
  profile_image: string;
  id?: string;
  email: string;
  createdAt?: string;
  first_name: string;
  last_name: string;
  roles?: Roles[];
  phone_number?: string;
}
