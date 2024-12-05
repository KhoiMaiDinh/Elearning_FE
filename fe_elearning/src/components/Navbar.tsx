"use client";
import { MENU } from "@/constants";
// import { setProfileDetails } from '@/constants/profileSlice'
// import { RootState } from '@/constants/store'
// import { APIGetProfileAdmin } from '@/utils/admin'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from 'react-redux'

const Navbar = () => {
  // const profileDetailsInfo = useSelector((state: RootState) => state.profile.profileDetailsInfo)

  const [menuTitle, setMenuTitle] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const currentPath = usePathname();
  const router = useRouter();

  // const dispatch = useDispatch()
  // const handleGetProfileAdmin = async () => {
  //   const response = await APIGetProfileAdmin()
  //   if (response?.status === 200) {
  //     dispatch(setProfileDetails(response.data))
  //   }
  // }
  // useEffect(() => {
  //   handleGetProfileAdmin()
  // }, [])

  useEffect(() => {
    if (currentPath === "/dashboard") {
      setMenuTitle("Welcome Thu Hien");
      setMenuDescription("Chào mừng đến với phần mềm quản lý Tools KiotViet");
    } else if (currentPath) {
      const title = MENU.find((item) => item.url == currentPath.toString());
      if (title) {
        setMenuTitle(title?.label);
        setMenuDescription(title?.description);
      }
    }
  }, [currentPath]);

  const handleOpenMenu = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar?.classList.remove("sidebar-close");
    sidebar?.classList.add("sidebar-open");
  };
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("refresh_token_expires_in");
    router.push("/");
  };
  return (
    <section
      id="navbar"
      className="sticky top-0 z-50 flex flex-col gap-5 bg-[#fff] p-6 lg:flex lg:h-20 lg:border-b lg:border-[#E6EFF5] lg:p-6"
    >
      <div className="flex-between gap-4">
        <div className="cursor-pointer lg:hidden" onClick={handleOpenMenu}>
          <Image
            src={"/icons/ic_menu.png"}
            width={14}
            height={18}
            alt="menu"
          ></Image>
        </div>
        <div className="flex flex-col ">
          <p className="text-xl font-[600] text-black lg:text-[20px]">
            {menuTitle}
          </p>
          <p className="text-sm font-normal text-gray lg:text-[12px]">
            {menuDescription}
          </p>
        </div>
        <div className="flex items-center justify-end gap-5">
          <div className="border-1 hidden h-[2.5rem] w-full items-end justify-start gap-3 rounded-full border border-customGray bg-white py-3 pl-5 pr-10 lg:flex">
            <Image
              src={"/icons/ic_search.png"}
              alt="search icon"
              width={16}
              height={16}
            ></Image>
            <input
              type="text"
              placeholder="Search for something"
              className="w-full  border-none bg-white text-[0.75rem] text-black "
            />
          </div>
          <div className="flex-center lg:flex-center hidden gap-5">
            <div className="flex-center h-10 w-10 rounded-full bg-white ">
              <Image
                src={"/icons/ic_notify.png"}
                alt="notification"
                width={18}
                height={18}
              ></Image>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="relative flex h-12 w-52 flex-row items-center rounded-md border border-customGray p-2">
                <div className="relative flex h-[35px]  w-[35px] rounded-full ">
                  <Image
                    src={"/images/avatar.jpeg"}
                    fill
                    className="rounded-full object-cover"
                    alt="avatar"
                  />
                </div>
                <div className="flex flex-col px-2">
                  <text className=" text-[14px] font-bold text-black">
                    {/* {profileDetailsInfo?.user_name} */}Thu Hien
                  </text>
                  <text className=" text-[10px] font-normal text-gray">
                    {/* {profileDetailsInfo?.branch_id?.name} */} Students
                  </text>
                </div>
                <div className="ml-auto ">
                  <Image
                    src={"/icons/ic_dropdown.png"}
                    alt="dropdown"
                    width={10}
                    height={10}
                  />
                </div>
              </div>
            </DropdownMenuTrigger>
            <div className="">
              <DropdownMenuContent className="mr-10 mt-4">
                <DropdownMenuItem>
                  <div className="flex flex-col">
                    <div className="flex-center gap-5"></div>
                    <div
                      className="flex cursor-pointer items-center justify-start gap-3 px-2"
                      onClick={handleLogout}
                    >
                      <Image
                        src={"/icons/ic_logout.png"}
                        alt="logout"
                        width={12}
                        height={12}
                      ></Image>
                      <p> Đăng xuất</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
