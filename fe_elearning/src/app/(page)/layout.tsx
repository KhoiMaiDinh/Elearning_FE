"use client";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();

  return (
    // <html lang="en">
    <body className="bg-AntiFlashWhite">
      <div className="flex items-start justify-start bg-AntiFlashWhite">
        <SidebarProvider>
          <AppSidebar />

          <SidebarInset className="bg-AntiFlashWhite">
            <div className="relative bg-AntiFlashWhite">
              <header className="flex h-16 top-0 sticky bg-white  shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 w-full ">
                {" "}
                <div className="flex items-center gap-2 px-4 w-full ">
                  <SidebarTrigger className="bg-majorelleBlue50" />

                  <Header />
                  <Separator
                    orientation="vertical"
                    className="mr-2 h-4 bg-AntiFlashWhite"
                  />
                </div>
              </header>

              <hr />

              <div className="w-full h-full p-3 bg-AntiFlashWhite ">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </body>
    // </html>
  );
}
