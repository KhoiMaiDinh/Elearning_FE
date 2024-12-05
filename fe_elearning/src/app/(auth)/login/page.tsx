import React from "react";

const page = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[url(/images/img_background.png)] bg-cover bg-center bg-no-repeat sm:items-center md:items-center lg:items-end lg:px-8">
      <div className="flex h-2/3 w-5/6 items-center sm:w-5/6 sm:items-center md:w-1/2 md:items-center lg:ml-auto lg:w-1/3 ">
        {/* Form nằm bên phải */}
        <div className=" flex w-full flex-col items-center justify-center gap-4 rounded-l-lg bg-white bg-opacity-90 p-8 shadow-lg">
          <div className="flex w-full flex-row gap-4"></div>
        </div>
      </div>
    </div>
  );
};

export default page;
