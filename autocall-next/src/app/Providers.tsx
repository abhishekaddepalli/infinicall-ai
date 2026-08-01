"use client";

import DynamicFavicon from "@/components/reusable/DynamicFavicon";
import { FloatingVirtualPhoneWidget } from "@/components/features/virtual-phone/FloatingVirtualPhoneWidget";
import MaintenanceGuard from "@/components/reusable/MaintenanceGuard";
import "@/lib/i18n";
import i18n from "@/lib/i18n";
import { store } from "@/redux/store";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import DirectionWrapper from "../layout/DirectionWrapper";
import FacebookSDKProvider from "./FacebookSDKProvider";

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return;
    }
    orig.apply(console, args);
  };
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define routes that should always be in light mode
  const isLandingPage = pathname === '/' || pathname === '/explore' || pathname === '/landing';

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange
          forcedTheme={isLandingPage ? "light" : undefined}
        >
          <FacebookSDKProvider>
            <DirectionWrapper>
              <MaintenanceGuard>
                <DynamicFavicon />
                {children}
                <FloatingVirtualPhoneWidget />
              </MaintenanceGuard>
            </DirectionWrapper>
          </FacebookSDKProvider>
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
}

