'use client';

import { Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import AnimateWrapper from './animations/animateWrapper';

const Footer = () => {
  return (
    <footer className="dark:bg-eerieBlack bg-AntiFlashWhite text-AntiFlashWhite pt-12 pb-6  w-full ">
      <AnimateWrapper delay={0.2} direction="up" className="w-full p-0 m-0 ">
        <div className="w-full ">
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-darkSilver/20 dark:border-lightSilver/20 pb-10 px-4 w-full">
            {/* Cột 1: Logo + mô tả */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/images/logo.png"
                  alt="NovaLearn Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h2 className="text-2xl font-bold text-LavenderIndigo dark:text-white">
                  NovaLearn
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Nền tảng học tập tiên tiến giúp bạn phát triển kỹ năng và nâng cao tri thức mỗi
                ngày.
              </p>
            </div>

            {/* Cột 2: Về chúng tôi */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Về chúng tôi</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about">Giới thiệu</Link>
                </li>
                <li>
                  <Link href="/team">Đội ngũ</Link>
                </li>
                <li>
                  <Link href="/careers">Tuyển dụng</Link>
                </li>
              </ul>
            </div>

            {/* Cột 3: Khóa học */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Khóa học</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/courses">Danh sách khóa học</Link>
                </li>
                <li>
                  <Link href="/lecturer">Danh sách giảng viên</Link>
                </li>
                {/* <li>
                  <Link href="/blog">Blog học tập</Link>
                </li> */}
              </ul>
            </div>

            {/* Cột 4: Hỗ trợ */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/faq">Câu hỏi thường gặp</Link>
                </li>
                <li>
                  <Link href="/contact">Liên hệ</Link>
                </li>
                <li>
                  <Link href="/support">Trung tâm trợ giúp</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dòng dưới */}
        <div className=" mt-6 flex flex-col md:flex-row justify-between items-center gap-4 px-4 md:px-16">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 NovaLearn. All rights reserved.
          </p>
          <div className="flex space-x-4 text-xl text-muted-foreground">
            <a
              href="https://www.facebook.com/"
              className="dark:hover:text-white hover:text-black transition"
            >
              <Facebook />
            </a>
            <a href="https://x.com" className="dark:hover:text-white hover:text-black transition">
              <Twitter />
            </a>
            <a
              href="https://www.linkedin.com/"
              className="dark:hover:text-white hover:text-black transition"
            >
              <Linkedin />
            </a>
            <a
              href="https://www.youtube.com/"
              className="dark:hover:text-white hover:text-black transition"
            >
              <Youtube />
            </a>
          </div>
        </div>
      </AnimateWrapper>
    </footer>
  );
};

export default Footer;
