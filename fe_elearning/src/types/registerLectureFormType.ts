// @/types/registerLectureFormType.ts
export interface RegisterLectureForm {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  expertise: string;
  experience: string;
  certificate?: FileList; // Change this to FileList | undefined
  bankAccount: string;
  bankName: string;
  accountHolder: string;
}
