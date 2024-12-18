import React from "react";

const Header = () => {
  return (
    <div className=" w-full h-11/12 flex items-center justify-between fix top-0 sticky ">
      {/* Nội dung Header */}
      <h1 className="text-2xl font-bold ml-4">My E-Learning</h1>
      <div className="mr-4">
        {/* Có thể thêm nút điều hướng hoặc tài khoản */}
        <button className="px-4 py-2 bg-majorelleBlue text-white border rounded hover:bg-majorelleBlue50 hover:text-white">
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Header;
