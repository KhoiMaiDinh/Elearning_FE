import React from "react";

const Header = () => {
  return (
    <div className="bg-Sunglow fixed top-0 left-0 w-screen h-16 flex items-center justify-between shadow-md z-50">
      {/* Nội dung Header */}
      <h1 className="text-2xl font-bold ml-4">My E-Learning Platform</h1>
      <div className="mr-4">
        {/* Có thể thêm nút điều hướng hoặc tài khoản */}
        <button className="px-4 py-2 bg-white text-Sunglow border rounded hover:bg-Sunglow hover:text-white">
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Header;
