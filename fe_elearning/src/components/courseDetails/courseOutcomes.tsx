import { Check } from 'lucide-react';
import EmptyInfoBox from './emptyInfoBox';

interface CourseOutcomesProps {
  outcomes: string[] | undefined;
}

const CourseOutcomes: React.FC<CourseOutcomesProps> = ({ outcomes }) => {
  if (!outcomes?.length) {
    return <EmptyInfoBox message="Chưa điền phần Kiến thức có được sau khóa học" />;
  }

  return (
    <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400">
      {outcomes.map((outcome, index) => (
        <li key={index} className="flex items-center gap-3 rtl:space-x-reverse">
          <Check className="w-4 h-4 text-goGreen stroke-[2.5]" />
          {outcome}
        </li>
      ))}
    </ul>
  );
};

export default CourseOutcomes;
