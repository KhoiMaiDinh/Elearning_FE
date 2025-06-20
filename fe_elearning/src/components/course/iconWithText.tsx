import type React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconWithTextProps {
  IconComponent: LucideIcon;
  title: string;
  className?: string;
}

const IconWithText: React.FC<IconWithTextProps> = ({ IconComponent, title, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{title}</span>
    </div>
  );
};

export default IconWithText;
