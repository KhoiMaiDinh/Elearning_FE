import { CircleCheck } from "lucide-react";
import React from "react";
import AnimateWrapper from "../animations/animateWrapper";

type benefitBar = {
  description: string;
};
const BenefitsBar: React.FC<benefitBar> = ({ description }) => {
  return (
    <AnimateWrapper delay={0.2} direction="up">
      <div className=" flex flex-row gap-3 items-center px-4 py-2 bg-white dark:shadow-majorelleBlue50 dark:shadow-md dark:bg-black50 dark:text-AntiFlashWhite lg:w-4/5 md:w-4/5  w-full">
        <CircleCheck color="white" fill="green" />
        <text className="font-sans font-medium text-[16px] text-black70 dark:text-AntiFlashWhite">
          {description}
        </text>
      </div>
    </AnimateWrapper>
  );
};

export default BenefitsBar;
