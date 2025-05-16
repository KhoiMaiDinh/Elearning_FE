import { UserType } from '@/types/userType';

type Props = {
  student: UserType;
};

export default function StudentInfo({ student }: Props) {
  return (
    <div className="bg-pinkLace/40 dark:bg-zinc-700 p-4 rounded-xl space-y-1">
      <h2 className="text-lg font-semibold mb-1">Thông tin học viên</h2>
      <p>
        <strong>Họ tên:</strong> {student.first_name} {student.last_name}
      </p>
      <p>
        <strong>Email:</strong> {student.email}
      </p>
    </div>
  );
}
