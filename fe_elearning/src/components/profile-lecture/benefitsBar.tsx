import { CircleCheck } from 'lucide-react';
import React from 'react';

type BenefitBarProps = {
  description: string;
};

const BenefitsBar: React.FC<BenefitBarProps> = ({ description }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white shadow-sm dark:bg-black50 dark:shadow-majorelleBlue20 dark:shadow-md w-full md:w-4/5 lg:w-4/5 text-black70 dark:text-AntiFlashWhite">
      <CircleCheck className="w-5 h-5 text-white" fill="green" />
      <span className="text-base font-normal font-sans">{description}</span>
    </div>
  );
};

export default BenefitsBar;
