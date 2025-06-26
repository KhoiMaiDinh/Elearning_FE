import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface InformTooltipProps {
  content: string | React.ReactNode;
  size?: number;
  color?: string;
  fillColor?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  width?: string;
  className?: string;
}

const InformTooltip: React.FC<InformTooltipProps> = ({
  content,
  size = 18,
  color = '#fff',
  fillColor = '#F3C623',
  side = 'right',
  width = 'w-60',
  className,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={className}>
          <Info size={size} color={color} fill={fillColor} />
        </TooltipTrigger>
        <TooltipContent className={`${width} bg-black `} side={side}>
          <p className="flex-wrap text-wrap text-left text-white shadow whitespace-pre-line">
            {content}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InformTooltip;
