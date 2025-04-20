"use client";
import "./globals.css";
import store, { persistor } from "@/constants/store";
// import { Suspense } from 'react'
import { Provider } from "react-redux";
import { metadata } from "./metadata";
import { Suspense, useEffect } from "react";
import { Inter, Nunito, Manrope } from "next/font/google"; // Import font từ next/font
import { appWithTranslation } from "next-i18next";
import { PersistGate } from "redux-persist/integration/react";

// import { PersistGate } from 'redux-persist/integration/react'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  // weight: ['400', '500', '700'], // Specify weights you need
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  // weight: ['400', '500', '700'], // Specify weights you need
});
const RootLayout = ({ children }: any) => {
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
      <body className={` ${inter.variable} ${manrope.variable}`}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
};

export default appWithTranslation(RootLayout);
