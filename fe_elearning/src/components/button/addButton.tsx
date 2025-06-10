import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { LucideIcon } from 'lucide-react';

interface AddButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  className?: string;
  size?: 'sm' | 'lg';
}

const AddButton = ({
  onClick,
  label = 'Thêm yêu cầu',
  disabled,
  loading,
  className,
  icon: Icon = Plus,
  size,
}: AddButtonProps) => {
  return (
    <Button
      variant="outline"
      size={size}
      className={`bg-majorelleBlue text-white hover:bg-majorelleBlue hover:brightness-110 hover:text-white shadow-md shadow-majorelleBlue/40  ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? <Spinner size="small" className="text-white" /> : <Icon className="mr-1" />}
      {label}
    </Button>
  );
};

export default AddButton;
