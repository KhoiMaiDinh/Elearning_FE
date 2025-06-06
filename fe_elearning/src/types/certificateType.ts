import { CourseForm } from './courseType';

export interface CertificateType {
  certificate_code: string;
  completed_at: string;
  createdAt: string;
  course: CourseForm;
}
