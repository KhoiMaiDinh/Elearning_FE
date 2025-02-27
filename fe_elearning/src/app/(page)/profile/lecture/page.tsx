"use client";
import Loader from "@/components/loading/loader";
import NotRegisteredLecture from "@/components/profile-lecture/notRegisteredLecture";
import RegisteredLecture from "@/components/profile-lecture/registeredLecture";
import { RootState } from "@/constants/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full h-full">
      {userInfo.id ? (
        userInfo?.roles[0]?.role_name === "student" ? (
          <NotRegisteredLecture />
        ) : (
          <RegisteredLecture />
        )
      ) : (
        <Loader />
      )}
      {/* <RegisteredLecture /> */}
    </div>
  );
};

export default Page;
