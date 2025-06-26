'use client';

import { CircleDot } from 'lucide-react';
import EmptyInfoBox from './emptyInfoBox';

interface CourseRequirementsProps {
  requirements?: string[];
}

const CourseRequirements: React.FC<CourseRequirementsProps> = ({ requirements }) => {
  if (!requirements?.length) {
    return <EmptyInfoBox message="Chưa điền phần Kiến thức cần có trước khi tham gia khóa học" />;
  }

  return (
    <ul className="space-y-4 text-left">
      {requirements.map((requirement, index) => (
        <li
          key={index}
          className="flex items-center gap-3 rtl:space-x-reverse text-gray-500 dark:text-gray-400"
        >
          <CircleDot className="w-4 h-4 dark:text-PaleViolet text-majorelleBlue" />
          {requirement}
        </li>
      ))}
    </ul>
  );
};

export default CourseRequirements;
