import { CourseForm } from "./courseType";


export type UnbanRequestType = {
  reason: string;
  disapproval_reason?: string;
  is_reviewed: boolean;
  is_approved: boolean;
  course?: CourseForm;
  createdAt: string;
};
