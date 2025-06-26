'use client';
import { useEffect, useState } from 'react';
import '../globals.css';

import { useDispatch, useSelector } from 'react-redux';
import Header from '@/components/header';
import { useTheme } from 'next-themes';
import Footer from '@/components/footer';
import { connectSocket } from '@/constants/socketSlice';
import { RootState } from '@/constants/store';
import { CategorySelectionPopup } from '@/components/recomand/popupSelectCategory';
import { APIGetPreference } from '@/utils/preference';
import { Preference } from '@/types/preferenceType';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();
  const { theme: _theme, setTheme: _setTheme } = useTheme(); // Sử dụng hook từ `next-themes`
  const token = localStorage.getItem('access_token');
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [preference, setPreference] = useState<Preference | null>(null);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGetPreference = async () => {
    const response = await APIGetPreference();
    if (response?.status === 200) {
      setPreference(response.data);
      setShow(response.data.categories.length === 0);
    }
  };
  useEffect(() => {
    if (token) {
      dispatch(connectSocket({ token, user_id: userInfo.id }) as any);
      handleGetPreference();
    }
  }, [token, dispatch, userInfo.id]);

  return (
    <body className="bg-AntiFlashWhite dark:bg-eerieBlack">
      <div className="flex items-start justify-start bg-AntiFlashWhite dark:bg-eerieBlack">
        <div className="w-full h-full flex flex-col bg-white max-w-[1440px] mx-auto dark:bg-eerieBlack">
          <Header />
          <div className="w-full h-full bg-AntiFlashWhite dark:bg-eerieBlack ">
            {children}
            {preference?.categories.length === 0 && show && (
              <CategorySelectionPopup
                onClose={() => setShow(false)}
                isOpen={show}
                initialSelectedCategories={preference?.categories.map((category) => category.slug)}
              />
            )}
          </div>
          <Footer />
        </div>
      </div>
    </body>
  );
}
