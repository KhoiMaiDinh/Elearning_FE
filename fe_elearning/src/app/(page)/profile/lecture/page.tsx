"use client";
import NotRegisteredLecture from "@/components/profile-lecture/notRegisteredLecture";
import RegisteredLecture from "@/components/profile-lecture/registeredLecture";
import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full h-full">
      <RegisteredLecture />
      {/* <NotRegisteredLecture /> */}
    </div>
  );
};

export default Page;
