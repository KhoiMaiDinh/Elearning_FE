"use client";
import "./globals.css";
import store from "@/constants/store";
// import { Suspense } from 'react'
import { Provider } from "react-redux";
import { metadata } from "./metadata";
import { Suspense, useEffect } from "react";
import { Inter } from "next/font/google"; // Import font từ next/font

// import { PersistGate } from 'redux-persist/integration/react'

const inter = Inter({
  subsets: ["latin"], // Chọn các subsets cần thiết
  weight: ["100", "200", "400", "500", "700", "900"], // Các trọng số bạn muốn sử dụng
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Scroll to top when the component mounts or route changes
    window.scrollTo(0, 0);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>{String(metadata.title) ?? "Default Title"}</title>
        <meta />
        {/* <link rel="shortcut icon" href={(metadata.icons as any)?.shortcut} />
        <link rel="apple-touch-icon" href={(metadata.icons as any)?.apple} /> */}
      </head>
      <body className={inter.className}>
        <Provider store={store}>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </Provider>
      </body>
    </html>
  );
}
