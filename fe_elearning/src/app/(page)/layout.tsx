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
    <body className="bg-AntiFlashWhite">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex items-start justify-start bg-AntiFlashWhite dark:bg-eerieBlack">
          <SidebarProvider>
            <AppSidebar />

            <SidebarInset className="bg-AntiFlashWhite dark:bg-eerieBlack">
              <div className="relative bg-AntiFlashWhite dark:bg-eerieBlack">
                <header className="flex h-16 top-0 sticky bg-white dark:bg-eerieBlack shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 w-full ">
                  {" "}
                  <div className="flex items-center gap-2 px-4 w-full ">
                    <SidebarTrigger className="bg-majorelleBlue70" />

                    <Header />
                    <Separator
                      orientation="vertical"
                      className="mr-2 h-4 bg-AntiFlashWhite"
                    />
                  </div>
                </header>

                <hr />

                <div className="w-full h-full p-3 bg-AntiFlashWhite dark:bg-eerieBlack ">
                  {children}
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </ThemeProvider>
    </body>
  );
}
