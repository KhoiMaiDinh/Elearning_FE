type IconWithText = {
  icon: React.ComponentType<any>; // Type for an icon component
  text: string;
};

const IconWithText: React.FC<IconWithText> = ({ icon: Icon, text }) => {
  return (
    <div className="flex justify-center items-center font-dmsans">
      <Icon className="mr-2 fill-majorelleBlue font-normal text-white" />{' '}
      {/* Adjust the icon styling */}
      <span className="text-black dark:text-white text-[12px] font-medium md:text-[14px] lg:text-[16px]">
        {text}
      </span>
    </div>
  );
};

export default IconWithText;
