import { useMemo } from 'react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Ban, Globe, PencilRuler } from 'lucide-react';

enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  BANNED = 'BANNED',
}

const CourseStatusBadge = ({ status, className = '' }: { status: string; className?: string }) => {
  const statusToShow = useMemo(() => {
    if (status === CourseStatus.DRAFT) {
      return 'Bản nháp';
    } else if (status === CourseStatus.PUBLISHED) {
      return 'Xuất bản';
    } else {
      return 'Bị cấm';
    }
  }, [status]);
  return (
    <Badge
      className={cn(
        'text-AntiFlashWhite absolute right-2 top-2 gap-2 rounded-2xl',
        status === CourseStatus.PUBLISHED
          ? 'bg-vividMalachite/80 hover:bg-vividMalachite'
          : status === CourseStatus.BANNED
            ? 'bg-carminePink/25 hover:bg-carminePink/35'
            : 'bg-amber/80 hover:bg-amber',
        className
      )}
    >
      {statusToShow}
      {status === CourseStatus.DRAFT && <PencilRuler className="w-3 h-3" />}
      {status === CourseStatus.PUBLISHED && <Globe className="w-3 h-3" />}
      {status === CourseStatus.BANNED && <Ban className="w-3 h-3" />}
    </Badge>
  );
};

export default CourseStatusBadge;
