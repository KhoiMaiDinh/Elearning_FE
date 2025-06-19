import { CourseLevel } from '@/constants/courseLevel';
import { useMemo } from 'react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const CourseLevelBadge = ({ level, className = '' }: { level: string; className?: string }) => {
  const levelToShow = useMemo(() => {
    if (level === CourseLevel.BEGINNER) {
      return 'Cơ bản';
    } else if (level === CourseLevel.INTERMEDIATE) {
      return 'Trung bình';
    } else {
      return 'Nâng cao';
    }
  }, [level]);
  return (
    <Badge
      className={cn(
        'py-[2px] rounded-sm w-fit text-white px-2 hover:opacity-90 hover:bg-majorelleBlue border-none',
        {
          'bg-majorelleBlue': level === CourseLevel.BEGINNER,
          'bg-intermediate-gradient': level === CourseLevel.INTERMEDIATE,
          'bg-advance-gradient': level === CourseLevel.ADVANCED,
        },
        className
      )}
    >
      {levelToShow}
    </Badge>
  );
};

export default CourseLevelBadge;
