export type RegisterLectureForm = {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  expertise: string;
  experience: string;
  certificate?: File[];
  bankAccount: string;
  bankName: string;
  accountHolder: string;
};
