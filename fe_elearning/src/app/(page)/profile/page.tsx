// "use client";
// import BenefitsBar from "@/components/profile-lecture/benefitsBar";
// import NotRegisteredLecture from "@/components/profile-lecture/notRegisteredLecture";
// import RegisteredLecture from "@/components/profile-lecture/registeredLecture";
// import RegisterLecture from "@/components/profile-lecture/registerLecture";
// import { Button } from "@/components/ui/button";
// import React, { useState } from "react";

// const Page = () => {
//   const [activeButton, setActiveButton] = useState("Học viên");

//   const handleButtonClick = async (type: string) => {
//     setActiveButton(type);
//   };
//   return (
//     <div className="w-full h-full flex flex-col gap-3 bg-AntiFlashWhite font-sans font-medium text-majorelleBlue  overflow-auto">
//       <div className="flex justify-center gap-2 bg-majorelleBlue50 rounded-full w-fit p-2">
//         <Button
//           onClick={() => handleButtonClick("Học viên")}
//           className={`lg:w-32 md:w-24 sm:w-24 w-24 rounded-full  ${
//             activeButton === "Học viên"
//               ? "bg-majorelleBlue text-white hover:bg-majorelleBlue "
//               : "bg-trnsp text-black hover:bg-majorelleBlue70 hover:text-white shadow-none"
//           } hover:shadow-lg`}
//         >
//           Học viên
//         </Button>

//         {/* Nút Đăng ký */}
//         <Button
//           onClick={() => handleButtonClick("Giảng viên")}
//           className={`lg:w-32 md:w-24 sm:w-24 w-24 rounded-full  ${
//             activeButton === "Giảng viên"
//               ? "bg-majorelleBlue text-white hover:bg-majorelleBlue "
//               : "bg-trnsp text-black hover:bg-majorelleBlue70 hover:text-white shadow-none"
//           } hover:shadow-lg`}
//         >
//           Giảng viên
//         </Button>
//       </div>
//       {/* {activeButton === "Giảng viên" && <NotRegisteredLecture />} */}
//       {activeButton === "Giảng viên" && <RegisteredLecture />}

//       {}
//     </div>
//   );
// };

// export default Page;
