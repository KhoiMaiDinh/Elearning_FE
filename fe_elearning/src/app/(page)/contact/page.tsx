"use client";
import IconWithText from "@/components/course/iconWithText";
import React, { useEffect, useState } from "react";
import {
  Clock3,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import dynamic from "next/dynamic";
import { RootState } from "@/constants/store";
import { useSelector } from "react-redux";
import SocialMedia from "@/components/contact/socialMedia";

const Page = () => {
  return (
    <div className="relative flex h-full w-full flex-col">
      <div className="relative">
        {/* Ảnh nền */}
        <div
          className="absolute top-[-64px] h-72 w-full bg-cover bg-center bg-no-repeat md:h-96"
          id="banner"
          style={{
            backgroundImage: `url(${"/bg_contact.jpg"})`,
          }}
        >
          <div className="absolute inset-0 bg-Black35"></div>
          <div className="absolute inset-0 flex flex-col items-start justify-center gap-2 px-6 text-White md:gap-4 md:px-16">
            <text className="w-2/3 font-sans text-[24px] font-bold md:w-1/2 md:text-[48px]">
              Học online - mọi lúc - mọi nơi
            </text>
            <div className="flex flex-row items-center gap-2">
              <div className="h-14 w-1 bg-[#C49A6C] md:h-16"></div>
              <div className="flex flex-col gap-2">
                <text className="text-[10px] md:text-[18px]">
                  Liên hệ ngay, đội ngũ tư vấn luôn sẵn sàng hỗ trợ bạn
                </text>
              </div>
            </div>
          </div>
        </div>

        {/* Lớp phủ đen 30% */}
        <div className="absolute inset-0 bg-black50/20"></div>
      </div>

      <div className="relative z-10 flex h-full w-full items-center pt-60 md:pt-96">
        <div className="w-full max-w-[1440px]">
          <div className="flex w-full flex-col justify-between gap-6 px-4 md:flex-row md:px-20 lg:px-32">
            <div className="relative flex w-full flex-col gap-3 md:gap-6">
              <div className="relative font-sans text-[24px] font-bold md:text-[32px]">
                E-Learning
                <span className="absolute bottom-[-2px] left-0 h-[2px] w-full bg-black50"></span>
              </div>
              <div className="flex flex-col gap-2 px-2 md:gap-4">
                <IconWithText
                  IconComponent={MapPin}
                  title={"Số 6, phường Linh Trung, TP.Thủ Đức"}
                />
                <IconWithText IconComponent={Phone} title={"0987 887 656"} />
                <IconWithText
                  IconComponent={Mail}
                  title={"elearning@gmail.com"}
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 md:gap-6">
              <div className="relative font-sans text-[24px] font-bold md:text-[32px]">
                Theo dõi chúng tôi
                <span className="absolute bottom-[-2px] left-0 h-[2px] w-full bg-black50"></span>
              </div>
              <div className="grid grid-cols-4 items-center justify-center gap-3 md:gap-6">
                <SocialMedia
                  icon={Facebook}
                  url={"https://www.facebook.com/"}
                  sizeIcon={24}
                  className="containerFour"
                />

                <SocialMedia
                  icon={Instagram}
                  url={"https://www.facebook.com/"}
                  sizeIcon={24}
                  className="containerOne"
                />

                <SocialMedia
                  icon={Twitter}
                  url={"https://www.facebook.com/"}
                  sizeIcon={24}
                  className="containerTwo"
                />

                <SocialMedia
                  icon={Linkedin}
                  url={"https://www.facebook.com/"}
                  sizeIcon={24}
                  className="containerThree"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col px-2 py-4 md:px-20 lg:px-32">
        <iframe
          src={
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2811.1267908210693!2d106.80047917317096!3d10.870014157464315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2sUniversity%20of%20Information%20Technology%20-%20VNUHCM!5e1!3m2!1sen!2s!4v1740718066994!5m2!1sen!2s"
          }
          className="h-[300px] w-full md:h-[400px] lg:h-[500px]"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default Page;
