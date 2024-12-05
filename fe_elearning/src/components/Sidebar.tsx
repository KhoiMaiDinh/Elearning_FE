"use client";
import { MENU } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Sidebar = () => {
  const [currentMenu, setCurrentMenu] = useState("dashboard");

  const handleClickMenu = (title: string) => {
    setCurrentMenu(title);
  };

  const handleCloseSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar?.classList.remove("sidebar-open");
    sidebar?.classList.add("sidebar-close");
  };
  return (
    <section
      id="sidebar"
      className="sidebar-close w-56 bg-[#fff] lg:sticky lg:left-0 lg:top-0  lg:h-[100vh] lg:w-56 lg:min-w-56 lg:border-r lg:border-[#E6EFF5]"
    >
      <div className="flex-center relative h-20 gap-4">
        <Image
          src={"/images/logo_minvoice.png"}
          alt="logo"
          width={32}
          height={32}
        ></Image>
        <p className="text-2xl font-black text-medium_slate_blue">M-invoice.</p>
        <div
          className="absolute right-4 top-2 cursor-pointer lg:hidden"
          onClick={handleCloseSidebar}
        >
          <Image
            src={"/icons/ic_close.png"}
            width={24}
            height={24}
            alt="close"
          ></Image>
        </div>
      </div>
      <div className="flex flex-col items-start justify-center gap-8 py-4">
        {MENU.map((item) => (
          <Link href={item.url} key={item.id}>
            <div className="flex-center w-full cursor-pointer justify-start py-1 hover:bg-[#f7f7f7]">
              <div
                className={`h-[2.5rem] ${
                  currentMenu === item.id ? "w-[0.3rem]" : "w-0"
                } rounded-br-lg rounded-tr-lg bg-medium_slate_blue  transition-all duration-150 ease-out`}
              ></div>

              <div
                className={`flex-center w-full items-center justify-start gap-4 ${
                  currentMenu === item.id ? "pl-4" : "pl-[1.3rem]"
                } h-[2.5rem] transition-all duration-200 ease-out `}
                onClick={() => handleClickMenu(item.id)}
              >
                <Image
                  src={currentMenu === item.id ? item.icon_active : item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                ></Image>
                <p
                  className={`${
                    currentMenu === item.id
                      ? "text-medium_slate_blue"
                      : "text-gray"
                  } text-center font-medium`}
                >
                  {item.label}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Sidebar;
