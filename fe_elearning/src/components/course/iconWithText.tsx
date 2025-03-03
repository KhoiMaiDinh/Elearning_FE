type iconWithText = {
  IconComponent: React.ElementType; // The type for a React component
  title: string; // The type for the title string
};

const IconWithText: React.FC<iconWithText> = ({
  IconComponent: Icon,
  title,
}) => {
  return (
    <div className="flex flex-row w-full items-center gap-4   justify-center">
      <div className="flex flex-row items-center px-10 w-72 lg:w-full md:w-full border dark:border-white border-black70 shadow-sm shadow-majorelleBlue ">
        <div className="flex w-fit p-2 ">
          <Icon
            // color={"#000000"}
            size={16}
            className="dark:text-AntiFlashWhite text-black70"
          />
        </div>
        <div className="flex">
          <span className="flex text-black70 dark:text-AntiFlashWhite  font-medium font-sans text-[16px]">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IconWithText;
