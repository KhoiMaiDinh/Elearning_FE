import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

type ViewMoreButtonProps = {
  onClick?: () => void;
  label?: string;
};

const ViewMoreButton: React.FC<ViewMoreButtonProps> = ({ onClick, label = 'Xem thêm' }) => {
  return (
    <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={onClick}>
      {label}
      <ChevronRight className="h-3 w-3" />
    </Button>
  );
};

export default ViewMoreButton;
