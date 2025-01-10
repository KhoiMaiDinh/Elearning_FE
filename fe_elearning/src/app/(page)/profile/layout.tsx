"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState("Học viên");

  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);

  const handleButtonClick = async (type: string) => {
    setActiveButton(type);
    router.push(`/profile/${type === "Học viên" ? "student" : "lecture"}`);
  };
  return (
    <div className="w-full h-full flex flex-col gap-3 bg-AntiFlashWhite dark:bg-eerieBlack font-sans font-medium text-majorelleBlue  overflow-auto">
      <div className="flex justify-center gap-2 bg-majorelleBlue50 rounded-full w-fit p-2">
        <Button
          onClick={() => handleButtonClick("Học viên")}
          className={`lg:w-32 md:w-24 sm:w-24 w-24 rounded-full  ${
            activeButton === "Học viên"
              ? "bg-majorelleBlue text-white hover:bg-majorelleBlue "
              : "bg-trnsp text-black hover:bg-majorelleBlue70 hover:text-white shadow-none"
          } hover:shadow-lg`}
        >
          Học viên
        </Button>

        {/* Nút Đăng ký */}
        <Button
          onClick={() => handleButtonClick("Giảng viên")}
          className={`lg:w-32 md:w-24 sm:w-24 w-24 rounded-full  ${
            activeButton === "Giảng viên"
              ? "bg-majorelleBlue text-white hover:bg-majorelleBlue "
              : "bg-trnsp text-black hover:bg-majorelleBlue70 hover:text-white shadow-none"
          } hover:shadow-lg`}
        >
          Giảng viên
        </Button>
      </div>
      {/* {activeButton === "Giảng viên" && <NotRegisteredLecture />} */}
      {/* {activeButton === "Giảng viên" && <RegisteredLecture />} */}
      {children}
      {}
    </div>
  );
}
