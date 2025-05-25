'use client';
import IconWithText from '@/components/course/iconWithText';
import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import SocialMedia from '@/components/contact/socialMedia';
import AnimateWrapper from '@/components/animations/animateWrapper';
import Image from 'next/image';

const Page = () => {
  return (
    <div className="relative flex h-full w-full flex-col gap-4">
      {/* header */}
      <div className="grid md:grid-cols-3 grid-cols-1 items-center ">
        {' '}
        <div className="md:col-span-2 col-span-1 flex items-center justify-center flex-col text-center text-white ">
          <AnimateWrapper delay={0.3} direction="left">
            <div className=" flex items-center justify-center flex-col text-center text-white md:px-4">
              <h1 className="lg:text-4xl font-sans md:text-2xl text-xl font-extrabold dark:text-white text-eerieBlack leading-tight">
                Kết nối với <span className="text-LavenderIndigo">chúng tôi</span>
                <br />
                để nhận hỗ trợ nhanh chóng
              </h1>{' '}
              <p className="mt-4 lg:text-lg md:text-base text-sm text-muted-foreground max-w-xl">
                Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe, giải đáp thắc mắc và đồng hành cùng
                bạn. Hãy để lại lời nhắn hoặc liên hệ trực tiếp — bạn sẽ nhận được phản hồi trong
                thời gian sớm nhất.
              </p>
              <div className="mt-4 md:mt-6 flex md:gap-4 gap-2 md:text-base text-[10px]">
                <button className="bg-custom-gradient-button-violet text-white md:px-6 px-4 py-2 rounded-xl hover:bg-majorelleBlue70 transition">
                  Liên hệ ngay
                </button>
              </div>
            </div>
          </AnimateWrapper>
        </div>
        <div className="col-span-1 flex justify-center md:justify-start">
          <img
            src="/images/contact_bg.png"
            alt="Khóa học"
            className="md:w-[300px] w-[200px] rounded-xl"
          />
        </div>
      </div>

      {/* contact */}

      <AnimateWrapper delay={0.3} direction="up">
        <div className="relative z-10 flex h-full w-full items-center ">
          <div className="w-full ">
            <div className="flex w-full flex-col justify-between gap-6 px-4 md:flex-row ">
              <div className="relative flex w-full flex-col gap-3 md:gap-6">
                <div className="relative text-cosmicCobalt font-sans text-[24px] font-bold dark:text-white md:text-[32px]">
                  NovaLearn
                  <span className="absolute bottom-[-2px] left-0 h-[2px] w-full bg-cosmicCobalt/20 dark:bg-white/20 "></span>
                </div>
                <div className="flex flex-col gap-2 px-2 md:gap-4">
                  <IconWithText
                    IconComponent={MapPin}
                    title={'Số 6, phường Linh Trung, TP.Thủ Đức'}
                  />
                  <IconWithText IconComponent={Phone} title={'0987 887 656'} />
                  <IconWithText IconComponent={Mail} title={'elearning@gmail.com'} />
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 md:gap-6">
                <div className="relative text-cosmicCobalt font-sans text-[24px] font-bold dark:text-white md:text-[32px]">
                  Theo dõi chúng tôi
                  <span className="absolute bottom-[-2px] left-0 h-[2px] w-full bg-cosmicCobalt/20 dark:bg-white/20"></span>
                </div>
                <div className="grid grid-cols-4 items-center justify-center gap-3 md:gap-6">
                  <SocialMedia
                    icon={Facebook}
                    url={'https://www.facebook.com/'}
                    sizeIcon={24}
                    className="containerFour"
                  />

                  <SocialMedia
                    icon={Instagram}
                    url={'https://www.facebook.com/'}
                    sizeIcon={24}
                    className="containerOne"
                  />

                  <SocialMedia
                    icon={Twitter}
                    url={'https://www.facebook.com/'}
                    sizeIcon={24}
                    className="containerTwo"
                  />

                  <SocialMedia
                    icon={Linkedin}
                    url={'https://www.facebook.com/'}
                    sizeIcon={24}
                    className="containerThree"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimateWrapper>

      <AnimateWrapper delay={0.2} direction="up" amount={0.1}>
        <div className="flex w-full flex-col px-4 py-4 ">
          <iframe
            src={
              'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2811.1267908210693!2d106.80047917317096!3d10.870014157464315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2sUniversity%20of%20Information%20Technology%20-%20VNUHCM!5e1!3m2!1sen!2s!4v1740718066994!5m2!1sen!2s'
            }
            className="h-[300px] w-full md:h-[400px] lg:h-[500px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </AnimateWrapper>
    </div>
  );
};

export default Page;
