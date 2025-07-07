'use client';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import store, { persistor } from '@/constants/store';
import { Provider } from 'react-redux';
import { metadata } from './metadata';
import { Suspense } from 'react';
import { Inter, Manrope } from 'next/font/google';
import { appWithTranslation } from 'next-i18next';
import { PersistGate } from 'redux-persist/integration/react';
import Loader from '@/components/loading/loader';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@/components/theme-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ScrollToTop from '@/components/scrollToTop';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  // weight: ['400', '500', '700'], // Specify weights you need
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  // weight: ['400', '500', '700'], // Specify weights you need
});
const RootLayout = ({ children }: any) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{String(metadata.title) ?? 'Default Title'}</title>
        <meta />
        {/* <link rel="shortcut icon" href={(metadata.icons as any)?.shortcut} />
        <link rel="apple-touch-icon" href={(metadata.icons as any)?.apple} /> */}
      </head>
      <body className={` ${inter.variable} ${manrope.variable}`}>
        <script async src="https://sp.zalo.me/plugins/sdk.js"></script>
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
              <PersistGate loading={null} persistor={persistor}>
                <Suspense
                  fallback={
                    <div className="flex justify-center w-full items-center h-screen">
                      <Loader />
                    </div>
                  }
                >
                  <ScrollToTop />
                  <main className="">{children}</main>
                  <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={'light'}
                  />
                </Suspense>
              </PersistGate>
            </GoogleOAuthProvider>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
};

export default appWithTranslation(RootLayout);
