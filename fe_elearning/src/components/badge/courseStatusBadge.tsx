import { useMemo } from 'react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Ban, Bolt, Globe, PencilRuler, Trash2 } from 'lucide-react';

enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  BANNED = 'BANNED',
}

enum CourseItemStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  MODIFIED = 'MODIFIED',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
}

const CourseStatusBadge = ({ status, className = '' }: { status: string; className?: string }) => {
  const statusToShow = useMemo(() => {
    if (status === CourseStatus.DRAFT) {
      return 'Bản nháp';
    } else if (status === CourseStatus.PUBLISHED) {
      return 'Xuất bản';
    } else if (status === CourseItemStatus.MODIFIED) {
      return 'Chỉnh sửa';
    } else if (status === CourseItemStatus.DELETED) {
      return 'Đã xóa';
    } else {
      return 'Bị cấm';
    }
  }, [status]);

  return (
    <Badge
      className={cn(
        'text-AntiFlashWhite gap-2 rounded-2xl',
        status === CourseStatus.PUBLISHED
          ? 'bg-vividMalachite/80 hover:bg-vividMalachite'
          : status === CourseStatus.BANNED
            ? 'bg-redPigment/65 hover:bg-redPigment/75'
            : status === CourseItemStatus.MODIFIED
              ? 'bg-orange-600/80 hover:bg-orange-600'
              : status === CourseItemStatus.DELETED
                ? 'bg-gray-600/80 hover:bg-gray-600'
                : 'bg-amber-500/80 hover:bg-amber-500',
        className
      )}
    >
      {statusToShow}
      {status === CourseStatus.DRAFT && <PencilRuler className="w-3 h-3" />}
      {status === CourseStatus.PUBLISHED && <Globe className="w-3 h-3" />}
      {status === CourseItemStatus.MODIFIED && <Bolt className="w-3 h-3" />}
      {status === CourseStatus.BANNED && <Ban className="w-3 h-3" />}
      {status === CourseItemStatus.DELETED && <Trash2 className="w-3 h-3" />}
    </Badge>
  );
};

export default CourseStatusBadge;
