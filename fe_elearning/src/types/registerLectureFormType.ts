import { Category } from "./categoryType";
import { MediaType } from "./mediaType";
export type RegisterLectureForm = {
  category: {
    slug: string;
  };
  biography: string;
  certificates: MediaType[];
  headline: string;
  resume: MediaType;
  website_url?: string | null;
  facebook_url?: string | null;
  linkedin_url?: string | null;
  bankAccount: string;
  bankName: string;
  accountHolder: string;
};

export type Lecture = RegisterLectureForm & {
  category: Category;
  is_approved: boolean;
  resume: {
    key: string;
    rejected_reason: string | null;
    status: string;
    bucket: string;
  };
  certificates: {
    certificate_file: {
      key: string;
      rejected_reason: string | null;
      status: string;
      bucket: string;
    };
  }[];
};
