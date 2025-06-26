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
  iconPosition?: 'left' | 'right';
}

const AddButton = ({
  onClick,
  label = 'Thêm yêu cầu',
  disabled,
  loading,
  className,
  icon: Icon = Plus,
  size,
  iconPosition = 'left',
}: AddButtonProps) => {
  const iconElement = loading ? (
    <Spinner size="small" className="text-white" />
  ) : (
    <Icon className={iconPosition === 'left' ? 'mr-1' : 'ml-1'} />
  );

  return (
    <Button
      size={size}
      className={`bg-majorelleBlue text-white hover:bg-majorelleBlue hover:brightness-110 hover:text-white shadow-md shadow-majorelleBlue/40  ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {iconPosition === 'left' ? (
        <>
          {iconElement}
          {label}
        </>
      ) : (
        <>
          {label}
          {iconElement}
        </>
      )}
    </Button>
  );
};

export default AddButton;
