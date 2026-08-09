/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Script from "next/script";
import { ReactNode, createContext, useContext, useState } from "react";

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const FacebookContext = createContext<boolean>(false);

export const useFacebookReady = () => useContext(FacebookContext);

export default function FacebookSDKProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <FacebookContext.Provider value={ready}>
      <Script
        id="facebook-sdk"
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="afterInteractive"
        onLoad={() => {
          // FB SDK is loaded — init will be called per-user in useEmbeddedSignup
          setReady(true);
        }}
      />
      {children}
    </FacebookContext.Provider>
  );
}
