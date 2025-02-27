export interface RegisterLectureForm {
  fullName: string;
  dob: string;
  email: string;
  bio: string;
  address: string;
  expertise: string;
  experience: string;
  certificate: string[]; // Đổi thành string[] để lưu tên file
  bankAccount: string;
  bankName: string;
  accountHolder: string;
}
