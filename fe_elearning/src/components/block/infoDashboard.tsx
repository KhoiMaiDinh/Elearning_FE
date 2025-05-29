'use client';

import type React from 'react';
import CountUp from '../text/countUp';

type InfoDashboardProps = {
  number: number;
  title: string;
  Icon: React.ElementType;
  color?: string;
  bgColor?: string;
};

const InfoDashboard: React.FC<InfoDashboardProps> = ({ number, title, Icon, color, bgColor }) => {
  // Convert color strings to Tailwind classes
  const getIconBgClass = () => {
    switch (bgColor) {
      case '#1568DF':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case '#219653':
        return 'bg-green-100 dark:bg-green-900/30';
      case '#9B51DF':
        return 'bg-purple-100 dark:bg-purple-900/30';
      case '#FF2E2E':
        return 'bg-red-100 dark:bg-red-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-800/50';
    }
  };

  const getIconColorClass = () => {
    switch (color) {
      case '#1568DF':
        return 'text-blue-600 dark:text-blue-400';
      case '#219653':
        return 'text-green-600 dark:text-green-400';
      case '#9B51DF':
        return 'text-purple-600 dark:text-purple-400';
      case '#FF2E2E':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-full ${getIconBgClass()} flex items-center justify-center`}
          >
            <Icon className={`w-8 h-8 ${getIconColorClass()}`} />
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              <CountUp
                from={0}
                to={number}
                separator=","
                direction="up"
                duration={1.5}
                className="count-up-text"
              />
            </div>
            <p className="text-gray-600 dark:text-gray-300">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoDashboard;

// Add Card component to avoid import errors
const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={className}>{children}</div>;
};

const CardContent = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={className}>{children}</div>;
};
