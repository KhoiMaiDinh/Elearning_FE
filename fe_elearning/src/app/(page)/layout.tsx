"use client";
import { useEffect } from "react";
import type { Metadata } from "next";
import "../globals.css";

import { useDispatch } from "react-redux";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";

import { Separator } from "@radix-ui/react-separator";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";
import Aurora from "@/components/animations/background-aurora";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme(); // Sử dụng hook từ `next-themes`

  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);

  return (
    <body className="bg-AntiFlashWhite dark:bg-eerieBlack">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex items-start justify-start bg-AntiFlashWhite dark:bg-eerieBlack">
          <div className="w-full h-full flex flex-col bg-white max-w-[1440px] mx-auto dark:bg-eerieBlack">
            <Header />
            <div className="w-full h-full bg-AntiFlashWhite dark:bg-eerieBlack ">
              {children}
            </div>
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </body>
  );
}
