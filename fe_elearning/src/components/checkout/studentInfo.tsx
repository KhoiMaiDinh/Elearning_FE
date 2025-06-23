import { UserType } from '@/types/userType';
import { User, Mail, Phone, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  student: UserType;
};

export default function StudentInfo({ student }: Props) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-4">
      {/* User Avatar and Basic Info */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 border-2 border-blue-200 dark:border-blue-800">
          <AvatarImage
            src={
              student.profile_image?.key
                ? `${process.env.NEXT_PUBLIC_BASE_URL_IMAGE}${student.profile_image?.key}`
                : ''
            }
            alt={`${student.first_name} ${student.last_name}`}
          />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-lg">
            {getInitials(student.first_name, student.last_name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {student.first_name} {student.last_name}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">Học viên</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Email
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
              {student.email}
            </p>
          </div>
        </div>

        {student.phone_number && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Điện thoại
              </p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {student.phone_number}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <User className="w-4 h-4" />
        <span>Thông tin này sẽ được sử dụng cho việc cấp chứng chỉ</span>
      </div>
    </div>
  );
}
