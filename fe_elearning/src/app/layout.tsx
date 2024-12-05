"use client";
import "./globals.css";
import store from "@/constants/store";
// import { Suspense } from 'react'
import { Provider } from "react-redux";
import { metadata } from "./metadata";
import { Suspense } from "react";
// import { PersistGate } from 'redux-persist/integration/react'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>{String(metadata.title) ?? "Default Title"}</title>
        <meta />
        {/* <link rel="shortcut icon" href={(metadata.icons as any)?.shortcut} />
        <link rel="apple-touch-icon" href={(metadata.icons as any)?.apple} /> */}
      </head>
      <body>
        <Provider store={store}>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </Provider>
      </body>
    </html>
  );
}
