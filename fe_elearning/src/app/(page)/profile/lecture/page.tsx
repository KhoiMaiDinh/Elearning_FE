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
    console.log(userInfo);
  }, [userInfo]);
  return (
    <div className="w-full h-full">
      {/* {userInfo.id ? (
        !userInfo?.roles?.some((role) => role.role_name === "instructor") &&
        !userInfo?.instructor_profile ? (
          <NotRegisteredLecture />
        ) : (
          <RegisteredLecture />
        )
      ) : (
        <Loader />
      )} */}
      <RegisteredLecture />
    </div>
  );
};

export default Page;
