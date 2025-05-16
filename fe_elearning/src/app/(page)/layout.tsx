'use client';
import { useEffect } from 'react';
import '../globals.css';

import { useDispatch, useSelector } from 'react-redux';
import Header from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { useTheme } from 'next-themes';
import Footer from '@/components/footer';
import { connectSocket } from '@/constants/socketSlice';
import { RootState } from '@/constants/store';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();
  const { theme: _theme, setTheme: _setTheme } = useTheme(); // Sử dụng hook từ `next-themes`
  const token = localStorage.getItem('access_token');
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(connectSocket({ token, user_id: userInfo.id }));
    }
  }, [token, dispatch, userInfo.id]);

  return (
    <body className="bg-AntiFlashWhite dark:bg-eerieBlack">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="flex items-start justify-start bg-AntiFlashWhite dark:bg-eerieBlack">
          <div className="w-full h-full flex flex-col bg-white max-w-[1440px] mx-auto dark:bg-eerieBlack">
            <Header />
            <div className="w-full h-full bg-AntiFlashWhite dark:bg-eerieBlack ">{children}</div>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </body>
  );
}
