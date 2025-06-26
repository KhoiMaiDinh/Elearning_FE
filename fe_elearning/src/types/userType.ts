import { InstructorType } from './instructorType';

export interface Roles {
  role_name: string;
  permissions: any;
}

export interface FileData {
  key: string;
  bucket?: string;
  status?: string;
  rejected_reason?: string;
  id?: string;
}

export interface UserType {
  username: string;
  profile_image: FileData;
  id?: string;
  email: string;
  createdAt?: string;
  first_name: string;
  last_name: string;
  roles?: Roles[];
  phone_number?: string;
  instructor_profile?: InstructorType;
}
